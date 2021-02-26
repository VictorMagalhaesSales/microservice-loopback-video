import {MethodDecoratorFactory} from '@loopback/core';
import {Options} from 'amqplib';

export interface RabbitmqSubscriberMetadata {
  exchange: string,
  rountingKey: string | string[]
  queue?: string,
  queueOptions?: Options.AssertQueue
}

export const RABBITMQ_SUBSCRIBE_DECORATOR = 'rabbitmq-subscribe-metadata';

export function rabbitmqSubscribe(spec: RabbitmqSubscriberMetadata): MethodDecorator {
  const factory = new MethodDecoratorFactory<RabbitmqSubscriberMetadata>(
    RABBITMQ_SUBSCRIBE_DECORATOR, spec
  );
  return factory.create();
}
