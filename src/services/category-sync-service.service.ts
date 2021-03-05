import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {CategoryRepository} from '../repositories/category.repository';
import {BaseSyncService} from './base-sync.service';

@injectable({scope: BindingScope.SINGLETON})
export class CategorySyncService extends BaseSyncService {

  constructor(
    @repository(CategoryRepository) protected repository: CategoryRepository
  ) {
    super(repository);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.category.*',
    queue: 'micro-catalog/sync-videos/category',
    queueOptions: {
      deadLetterExchange: 'dlx.topic'
    }
  })
  async handler(data: any, message: ConsumeMessage) {
    this.sync(data, message);
  }
}
