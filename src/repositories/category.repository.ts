import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {Category, CategoryRelations} from '../models/category.model';
import {Esv7DataSource} from '../modules/elasticsearch/esv7.datasource';

export class CategoryRepository extends
  DefaultCrudRepository<Category, typeof Category.prototype.id, CategoryRelations> {

  constructor(@inject('datasources.esv7') dataSource: Esv7DataSource) {
    super(Category, dataSource);
  }
}
