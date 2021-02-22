import {Context, Server} from '@loopback/core';
import {Channel, connect, Connection} from 'amqplib';


export class RabbitmqServer extends Context implements Server {
  listening: boolean;
  conn: Connection;

  async start(): Promise<void> {
    /*
    * Lib AMQP instalada para se trabalhar com protocolo AMPQ com Node.
    * Rabbitmq utiliza esse protocolo.
    */
    this.conn = await connect({
      hostname: 'rabbitmq',
      username: 'admin',
      password: 'admin'
    });
    this.listening = true;
    this.boot();
  }

  async boot(): Promise<void> {
    // Criação do canal para comunicação com o Rabbitmq que usaremos para enviar e consumir informações
    const channel: Channel = await this.conn.createChannel();
    // Criando 'exchange' e 'queue' e fazendo um bind através de uma routing key
    const exchangeTopic = await channel.assertExchange('amq.topic', 'topic');
    const syncVideosQueue = await channel.assertQueue('micro-catalog/sync-videos');
    // Qualquer publicação na exchange amq.topic com a key seguindo o padrão micro.*.*, cairá na queue de sync videos
    channel.bindQueue(syncVideosQueue.queue, exchangeTopic.exchange, 'micro.*.*');

    channel.consume(syncVideosQueue.queue, msg => {
      if (!msg) return null;
      console.log(Buffer.from(msg.content).toString());
    })
  }

  async stop(): Promise<void> {
    this.listening = false;
    return undefined;
  }

}
