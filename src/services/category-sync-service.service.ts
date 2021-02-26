import {BindingScope, injectable} from '@loopback/core';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';

@injectable({scope: BindingScope.TRANSIENT})
export class CategorySyncService {

  constructor() { }

  @rabbitmqSubscribe({
    exchange: 'teste.topic',
    routingKey: 'micro.*.*',
    queue: 'queue1'
  })
  handler() {
  }
}
