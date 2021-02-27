import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {CastMemberRepository} from '../repositories/cast-member.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class CastMemberSyncService {

  constructor(
    @repository(CastMemberRepository) private repository: CastMemberRepository
  ) { }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.cast-member.*',
    queue: 'micro-catalog/sync-videos/cast-member'
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
