import {BindingScope, injectable} from '@loopback/core';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';

@injectable({scope: BindingScope.TRANSIENT})
export class CategorySyncService {
  constructor() { }

  @rabbitmqSubscribe({
    exchange: 'teste.topic',
    rountingKey: 'micro.*.*'
  })
  handler() {
  }
}
