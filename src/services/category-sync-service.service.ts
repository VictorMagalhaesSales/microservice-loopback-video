import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {CategoryRepository} from '../repositories/category.repository';

@injectable({scope: BindingScope.SINGLETON})
export class CategorySyncService {

  constructor(
    @repository(CategoryRepository) private repository: CategoryRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.category.*',
    queue: 'micro-catalog/sync-videos/category'
  })
  async handler(data: any, message: ConsumeMessage) {
    const action = message.fields.routingKey.split('.').slice(2)[0];
    console.log(data);
    switch (action) {
      case 'created': await this.repository.create(data); break;
      case 'updated': await this.repository.updateById(data.id, data); break;
      case 'deleted': await this.repository.deleteById(data.id); break;
    }
  }
}
