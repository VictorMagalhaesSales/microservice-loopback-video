import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {CategoryRepository} from '../repositories/category.repository';
import {GenreRepository} from '../repositories/genre.repository';
import {BaseSyncService} from './base-sync.service';

@injectable({scope: BindingScope.SINGLETON})
export class GenreSyncService extends BaseSyncService {

  constructor(
    @repository(GenreRepository) protected repository: GenreRepository,
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository
  ) {
    super(repository);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.genre.*',
    queue: 'micro-catalog/sync-videos/genre',
    queueOptions: {
      deadLetterExchange: 'dlx.topic'
    }
  })
  async handler(data: any, message: ConsumeMessage) {
    this.sync(data, message);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.genre-categories.*',
    queue: 'micro-catalog/sync-videos/genre-categories',
    queueOptions: {
      deadLetterExchange: 'dlx.topic'
    }
  })
  async handlerCategories(data: any, message: ConsumeMessage) {
    this.syncRelations(data, data.relation_ids, 'categories', this.categoryRepository, message);
  }
}
