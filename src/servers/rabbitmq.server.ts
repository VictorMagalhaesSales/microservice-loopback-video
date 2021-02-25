import {Context, inject, Server} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AmqpConnectionManager, AmqpConnectionManagerOptions, ChannelWrapper, connect} from 'amqp-connection-manager';
import {Channel} from 'amqplib';
import {RabbitmqBindings} from '../keys';
import {CategoryRepository} from '../repositories';

export interface RabbitMQConfig {
  uri: string,
  configOptions?: AmqpConnectionManagerOptions
}

export class RabbitmqServer extends Context implements Server {
  listening: boolean;
  conn: AmqpConnectionManager;
  channelManager: ChannelWrapper;
  channel: Channel;

  constructor(
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
    @inject(RabbitmqBindings.CONFIG) private config: RabbitMQConfig
  ) {
    super();
  }

  async start(): Promise<void> {
    /*
    * ANTIGO: Lib AMQP instalada para se trabalhar com protocolo AMPQ(utilizada pelo RabbitMQ) com Node
    * NOVO: => Estamos utilizando o amqp-connection-manager para conectar e não mais o amqplib
    */
    this.conn = await connect([this.config.uri], this.config.configOptions);
    this.listening = true;
    await this.boot();
  }

  private async boot(): Promise<void> {
    // Criação do canal para comunicação com o Rabbitmq que usaremos para enviar e consumir informações
    this.channelManager = await this.conn.createChannel();
    this.channelManager.on('connect', () => {
      console.log("Sucessfully connected a RabbitMQ channel!");
      this.listening = true;
      this.configRabbit();
    });
    this.channelManager.on('error', (err: Error, info: {name: string;}) => {
      console.log(`Failed to setup a RabbitMQ channel - name: ${info.name} / error: ${err.message}!`);
      this.listening = false;
    });
  }

  private async configRabbit() {
    // Criando 'exchange' e 'queue' e fazendo um bind através de uma routing key
    const exchangeTopic = await this.channel.assertExchange('amq.topic', 'topic');
    const syncVideosQueue = await this.channel.assertQueue('micro-catalog/sync-videos');
    // Qualquer publicação na exchange amq.topic com a key seguindo o padrão micro.*.*, cairá na queue de sync videos
    this.channel.bindQueue(syncVideosQueue.queue, exchangeTopic.exchange, 'micro.*.*');

    this.channel.consume(syncVideosQueue.queue, msg => {
      if (!msg)
        return;
      const data = JSON.parse(msg.content.toString());
      const [category, operation] = msg.fields.routingKey.split('.').slice(1);
      this.operacao(category, operation, data)
        .then(() => this.channel.ack(msg))
        .catch(() => this.channel.reject(msg));
    });
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
