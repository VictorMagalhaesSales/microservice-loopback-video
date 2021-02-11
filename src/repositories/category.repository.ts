import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {Esv7DataSource} from '../datasources';
import {Category, CategoryRelations} from '../models';

export class CategoryRepository extends
      DefaultCrudRepository<Category, typeof Category.prototype.id, CategoryRelations> {

  constructor(@inject('datasources.esv7') dataSource: Esv7DataSource) {
    super(Category, dataSource);
  }
}
