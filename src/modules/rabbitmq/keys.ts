import {CoreBindings} from '@loopback/core';
import {RabbitMQConfig} from './rabbitmq.server';

export namespace RabbitmqBindings {
  export const CONFIG = CoreBindings.APPLICATION_CONFIG.deepProperty<RabbitMQConfig>('rabbitmq');
}
