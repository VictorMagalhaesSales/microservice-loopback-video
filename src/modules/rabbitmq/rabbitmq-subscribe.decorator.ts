import {MethodDecoratorFactory} from '@loopback/core';
import {RabbitmqSubscriberMetadata} from './utils.rabbitmq';

export const RABBITMQ_SUBSCRIBE_DECORATOR = 'rabbitmq-subscribe-metadata';

export function rabbitmqSubscribe(spec: RabbitmqSubscriberMetadata): MethodDecorator {
  const factory = new MethodDecoratorFactory<RabbitmqSubscriberMetadata>(
    RABBITMQ_SUBSCRIBE_DECORATOR, spec
  );
  return factory.create();
}
