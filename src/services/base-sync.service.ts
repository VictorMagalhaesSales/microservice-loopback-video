import {EntityCrudRepository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';

export class BaseSyncService {

  constructor(
    protected repository: EntityCrudRepository<any, any>
  ) { }

  protected async sync(data: any, message: ConsumeMessage) {
    const action = this.getAction(message);
    switch (action) {
      case 'created': await this.repository.create(data); break;
      case 'updated': await this.repository.updateById(data.id, data); break;
      case 'deleted': await this.repository.deleteById(data.id); break;
    }
  }

  private getAction(message: ConsumeMessage): string {
    return message.fields.routingKey.split('.').slice(2)[0];
  }
}
