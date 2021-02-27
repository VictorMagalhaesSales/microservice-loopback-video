import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {GenreRepository} from '../repositories/genre.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class GenreSyncService {

  constructor(
    @repository(GenreRepository) private repository: GenreRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.genre.*',
    queue: 'micro-catalog/sync-videos/genre'
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
