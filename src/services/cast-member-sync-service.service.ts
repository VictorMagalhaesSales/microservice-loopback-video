import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {rabbitmqSubscribe} from '../modules/rabbitmq/rabbitmq-subscribe.decorator';
import {CastMemberRepository} from '../repositories/cast-member.repository';
import {BaseSyncService} from './base-sync.service';

@injectable({scope: BindingScope.SINGLETON})
export class CastMemberSyncService extends BaseSyncService {

  constructor(
    @repository(CastMemberRepository) protected repository: CastMemberRepository
  ) {
    super(repository);
  }

  @rabbitmqSubscribe({
    exchange: 'amq.topic',
    routingKey: 'micro.cast-member.*',
    queue: 'micro-catalog/sync-videos/cast-member'
  })
  async handler(data: any, message: ConsumeMessage) {
    this.sync(data, message);
  }
}
