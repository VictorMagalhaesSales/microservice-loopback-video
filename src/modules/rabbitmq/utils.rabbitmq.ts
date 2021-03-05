import {CoreBindings} from '@loopback/core';
import {AmqpConnectionManagerOptions} from 'amqp-connection-manager';
import {Options} from 'amqplib';

export interface RabbitmqSubscriberMetadata {
  exchange: string,
  routingKey: string | string[]
  queue?: string,
  queueOptions?: Options.AssertQueue
}

export interface RabbitMQConfig {
  uri: string,
  configOptions?: AmqpConnectionManagerOptions,
  exchanges?: Array<{
    name: string,
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string,
    options: Options.AssertExchange
  }>,
  queues?: {
    name: string,
    options: Options.AssertQueue,
    exchangeBind: {name: string, routingKey: string}
  }[],
  binds: Array<{queue: string, exchange: string, key: string}>
}

export interface SubscriberRabbitMQ {
  method: Function,
  decorator: RabbitmqSubscriberMetadata
}

export namespace RabbitmqBindings {
  export const CONFIG = CoreBindings.APPLICATION_CONFIG.deepProperty<RabbitMQConfig>('rabbitmq');
}

