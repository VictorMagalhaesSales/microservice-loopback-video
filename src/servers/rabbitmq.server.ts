import {Context, inject, Server} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Channel, connect, Connection} from 'amqplib';
import {RabbitmqBindings} from '../keys';
import {CategoryRepository} from '../repositories';

export interface RabbitMQConfig {
  uri: string
}

export class RabbitmqServer extends Context implements Server {
  listening: boolean;
  conn: Connection;
  channel: Channel;

  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
    @inject(RabbitmqBindings.CONFIG) private config: RabbitMQConfig
  ) {
    super();
  }

  async start(): Promise<void> {
    /*
    * Lib AMQP instalada para se trabalhar com protocolo AMPQ com Node.
    * Rabbitmq utiliza esse protocolo.
    */
    this.conn = await connect(this.config.uri);
    this.listening = true;
    this.boot();
  }

  async boot(): Promise<void> {
    // Criação do canal para comunicação com o Rabbitmq que usaremos para enviar e consumir informações
    this.channel = await this.conn.createChannel();
    // Criando 'exchange' e 'queue' e fazendo um bind através de uma routing key
    const exchangeTopic = await this.channel.assertExchange('amq.topic', 'topic');
    const syncVideosQueue = await this.channel.assertQueue('micro-catalog/sync-videos');
    // Qualquer publicação na exchange amq.topic com a key seguindo o padrão micro.*.*, cairá na queue de sync videos
    this.channel.bindQueue(syncVideosQueue.queue, exchangeTopic.exchange, 'micro.*.*');

    this.channel.consume(syncVideosQueue.queue, msg => {
      if (!msg) return;
      const data = JSON.parse(msg.content.toString());
      const [category, operation] = msg.fields.routingKey.split('.').slice(1);
      this.operacao(category, operation, data)
        .then(() => this.channel.ack(msg))
        .catch(() => this.channel.reject(msg));
    })
  }

  async operacao(category: string, operation: string, data: any) {
    if (category == 'video' && data) {
      switch (operation) {
        case 'create': await this.categoryRepo.create(data);
        case 'update': await this.categoryRepo.updateById(data.id, data);
        case 'delete': await this.categoryRepo.deleteById(data.id);
      }
    }
  }

  async stop(): Promise<void> {
    this.listening = false;
    return undefined;
  }

}
