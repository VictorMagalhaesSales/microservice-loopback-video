import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CastMember, CastMemberRelations} from '../models/cast-member.model';
import {Esv7DataSource} from '../modules/elasticsearch/esv7.datasource';

export class CastMemberRepository extends
  DefaultCrudRepository<CastMember, typeof CastMember.prototype.id, CastMemberRelations> {

  constructor(@inject('datasources.esv7') dataSource: Esv7DataSource) {
    super(CastMember, dataSource);
  }
}
