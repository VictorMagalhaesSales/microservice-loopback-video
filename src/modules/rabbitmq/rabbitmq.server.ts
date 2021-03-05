import {Application, Context, CoreBindings, inject, MetadataInspector, Server} from '@loopback/core';
import {AmqpConnectionManager, ChannelWrapper, connect} from 'amqp-connection-manager';
import {Channel, ConfirmChannel, Message, Replies} from 'amqplib';
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
    this.bindSubscribersAndConsume(subscribers);
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
    await this.createQueues();
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

  private async bindSubscribersAndConsume(subscribers: SubscriberRabbitMQ[]) {
    subscribers.map(sub => {
      return this.channelManager.addSetup(async (channel: ConfirmChannel) => {
        const {queue, exchange, routingKey, queueOptions} = sub.decorator;
        /* Criando as queues */
        const assertQueue = await channel.assertQueue(queue ?? '', queueOptions ?? undefined);

        /* Fazendo o bind e exchange entre a queue da anotação através da(s) routingKey(s) */
        const keys = Array.isArray(routingKey) ? routingKey : [routingKey];
        keys.map(key => {
          channel.bindQueue(assertQueue.queue, exchange, key);
        });
        /* Ligando o consumidor da queue ao método decorado  */
        this.consume(channel, assertQueue, sub.method);
      });
    });
  }

  /* OBS: Cada fila só pode ter um único consumidor */
  private consume(channel: ConfirmChannel, assertQueue: Replies.AssertQueue, method: Function) {
    channel.consume(assertQueue.queue, msg => {
      if (!msg) return;
      try {
        if (msg.content) {
          let data;
          try {
            data = JSON.parse(msg.content.toString());
          } catch (error) {
            data = null;
            console.log("Unable to transform data to JSON");
          }
          method(data, msg);
          channel.ack(msg);
        }
      } catch (error) {
        console.log("Mensagem recusada. Erro: " + error);
        if (!msg) return;
        if (this.canDeadLetter(channel, msg)) {
          console.log("Reject in message", {content: msg.content.toString()});
          channel.nack(msg, false, false);
        }
      }
    });
  }

  private canDeadLetter(channel: Channel, message: Message): boolean {
    if (message.properties.headers && 'x-death' in message.properties.headers) {
      const countDeads = message.properties.headers['x-death']![0].count;
      console.log(message.properties.headers['x-death']);
      if (countDeads > this.config.maxAttemptsDeadQueue) {
        channel.ack(message);
        const queue = message.properties.headers['x-death']![0].queue;
        console.error(`Ack in ${queue} with error. Max attempts exceeded: ${this.config.maxAttemptsDeadQueue}`);
        return false;
      }
    }
    return true;
  }

  private async createExchanges(): Promise<void> {
    return this.channelManager.addSetup(async (channel: ConfirmChannel) => {

      if (!this.config.exchanges) return;
      await Promise.all(this.config.exchanges.map(ex => {
        channel.assertExchange(ex.name, ex.type, ex.options);
      }));
    });

  }

  private async createQueues(): Promise<void> {
    return this.channelManager.addSetup(async (channel: ConfirmChannel) => {
      if (!this.config.queues) return;
      await Promise.all(this.config.queues.map(async queue => {
        await channel.assertQueue(queue.name, queue.options);
        if (!queue.exchangeBind) return;
        await channel.bindQueue(queue.name, queue.exchangeBind.name, queue.exchangeBind.routingKey);
      }));
    });

  }

  async stop(): Promise<void> {
    this.listening = false;
    return undefined;
  }

}
