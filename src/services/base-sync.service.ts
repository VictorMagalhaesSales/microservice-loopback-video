import {EntityCrudRepository} from '@loopback/repository';
import {ConsumeMessage} from 'amqplib';
import {pick} from 'lodash';

export class BaseSyncService {

  constructor(
    protected repository: EntityCrudRepository<any, any>
  ) { }

  protected async sync(data: any, message: ConsumeMessage) {
    const action = this.getAction(message);
    const entity = this.getValidatedEntity(data);
    switch (action) {
      case 'created': await this.repository.create(entity); break;
      case 'updated': await this.repository.updateById(data.id, entity); break;
      case 'deleted': await this.repository.deleteById(data.id); break;
    }
  }

  private getAction(message: ConsumeMessage): string {
    return message.fields.routingKey.split('.').slice(2)[0];
  }

  private getValidatedEntity(data: any) {
    return pick(data, Object.keys(this.repository.entityClass.definition.properties));
  }
}
