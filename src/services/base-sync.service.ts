import {EntityCrudRepository, EntityNotFoundError} from '@loopback/repository';
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

  protected async syncRelations(data: any, idRelations: string[], relationName: string,
    relationRepository: EntityCrudRepository<any, any>, message: ConsumeMessage) {
    const relationFields = this.getRelationFieldsForQuery(relationName);
    const listRelations = await relationRepository.find({
      where: {
        or: idRelations.map((idRelation) => ({id: idRelation})),
        fields: relationFields
      }
    });
    if (!listRelations.length) throw new EntityNotFoundError("Entity not found", null);
    data[relationName] = listRelations;
    this.sync(data, message);
  }

  private getRelationFieldsForQuery(relationName: string) {
    return Object.keys(this.repository.entityClass.definition.properties[relationName].jsonSchema?.properties as Object)
      .reduce((obj: any, nextValue) => {
        obj[nextValue] = true;
        return obj
      }, {});
  }
}
