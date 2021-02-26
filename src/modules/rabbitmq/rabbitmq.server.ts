import {Application, Context, CoreBindings, inject, MetadataInspector, Server} from '@loopback/core';
import {AmqpConnectionManager, ChannelWrapper, connect} from 'amqp-connection-manager';
import {Channel, ConfirmChannel} from 'amqplib';
import {RABBITMQ_SUBSCRIBE_DECORATOR} from './rabbitmq-subscribe.decorator';
import {RabbitmqBindings, RabbitMQConfig, RabbitmqSubscriberMetadata, SubscriberRabbitMQ} from './utils.rabbitmq';

export class RabbitmqServer extends Context implements Server {
  listening: boolean;
  conn: AmqpConnectionManager;
  channelManager: ChannelWrapper;
  channel: Channel;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(RabbitmqBindings.CONFIG) private config: RabbitMQConfig
  ) {
    super(app);
  }

  async start(): Promise<void> {
    /*
    * ANTIGO: Lib AMQP instalada para se trabalhar com protocolo AMPQ(utilizada pelo RabbitMQ) com Node
    * NOVO: => Estamos utilizando o amqp-connection-manager para conectar e não mais o amqplib
    */
    this.conn = await connect([this.config.uri], this.config.configOptions);
    this.listening = true;
    await this.boot();

    const subscribers = this.searchMethodsWithDecorators();
    this.bindSubscribers(subscribers);
  }

  private async bindSubscribers(subscribers: SubscriberRabbitMQ[]) {
    subscribers.map(sub => {
      return this.channelManager.addSetup(async (channel: ConfirmChannel) => {
        const {queue, exchange, routingKey, queueOptions} = sub.decorator;
        /* Criando as queues */
        const assertQueue = await channel.assertQueue(queue ?? '', queueOptions ?? undefined);

        /* Fazendo o bind e exchange entre a queue da anotação através da(s) routingKey(s) */
        const keys = Array.isArray(routingKey) ? routingKey : [routingKey];
        keys.map(key => {
          channel.bindQueue(assertQueue.queue, exchange, key);
        })
      });
    });
  }

  private searchMethodsWithDecorators(): Array<SubscriberRabbitMQ> {
    const subscribers = new Array<SubscriberRabbitMQ>();
    const serviceBindings = this.find('services.*');
    serviceBindings.map(binding => {
      /* Pegando todos os decorators do rabbit adicionados aos services */
      const metadatas = MetadataInspector.getAllMethodMetadata<RabbitmqSubscriberMetadata>(
        RABBITMQ_SUBSCRIBE_DECORATOR,
        binding.valueConstructor?.prototype
      );
      if (!metadatas) return;

      /* Pegando o método e montando objeto do Subscriber para ser retornado */
      for (const methodName in metadatas) {
        if (!Object.prototype.hasOwnProperty.call(metadatas, methodName)) return;

        const service = this.getSync(binding.key) as any;
        subscribers.push({
          method: service[methodName].bind(service),
          decorator: metadatas[methodName]
        });
      }
    });
    return subscribers;
  }

  async boot(): Promise<void> {
    // Criação do canal para comunicação com o Rabbitmq que usaremos para enviar e consumir informações
    this.channelManager = await this.conn.createChannel();
    this.channelManager.on('connect', () => {
      console.log("Sucessfully connected a RabbitMQ channel!");
      this.listening = true;
    });
    this.channelManager.on('error', (err: Error, info: {name: string;}) => {
      console.log(`Failed to setup a RabbitMQ channel - name: ${info.name} / error: ${err.message}!`);
      this.listening = false;
    });
    await this.createExchanges();
  }

  private async createExchanges(): Promise<void> {
    return this.channelManager.addSetup(async (channel: ConfirmChannel) => {

      if (!this.config.exchanges) return;
      await Promise.all(this.config.exchanges.map(ex => {
        channel.assertExchange(ex.name, ex.type, ex.options);
      }));
    });

    // this.channel.consume(syncVideosQueue.queue, msg => {
    //   if (!msg)
    //     return;
    //   const data = JSON.parse(msg.content.toString());
    //   const [category, operation] = msg.fields.routingKey.split('.').slice(1);
    //   this.operacao(category, operation, data)
    //     .then(() => this.channel.ack(msg))
    //     .catch(() => this.channel.reject(msg));
    // });
  }

  // async operacao(category: string, operation: string, data: any) {
  //   if (category == 'video' && data) {
  //     switch (operation) {
  //       case 'create': await this.categoryRepo.create(data);
  //       case 'update': await this.categoryRepo.updateById(data.id, data);
  //       case 'delete': await this.categoryRepo.deleteById(data.id);
  //     }
  //   }
  // }

  async stop(): Promise<void> {
    this.listening = false;
    return undefined;
  }

}
