import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {GenreRepository} from '../repositories/genre.repository';
import {BaseSyncService} from './base-sync.service';

@injectable({scope: BindingScope.SINGLETON})
export class GenreSyncService extends BaseSyncService {

  constructor(
    @repository(GenreRepository) protected repository: GenreRepository
  ) {
    super(repository);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.genre.*',
    queue: 'micro-catalog/sync-videos/genre'
  })
  async handler(data: any, message: ConsumeMessage) {
    this.sync(data, message);
  }
}
