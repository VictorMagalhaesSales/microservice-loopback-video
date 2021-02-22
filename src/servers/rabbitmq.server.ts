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
    const exchangeAmq = await channel.assertExchange('amq.direct', 'direct');
    const queue1 = await channel.assertQueue('queue-1');
    channel.bindQueue(queue1.queue, exchangeAmq.exchange, 'first-key');
  }

  async stop(): Promise<void> {
    this.listening = false;
    return undefined;
  }

}
