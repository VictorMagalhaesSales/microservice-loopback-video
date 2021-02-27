import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {Genre, GenreRelations} from '../models/genre.model';
import {Esv7DataSource} from '../modules/elasticsearch/esv7.datasource';

export class GenreRepository extends
  DefaultCrudRepository<Genre, typeof Genre.prototype.id, GenreRelations> {

  constructor(@inject('datasources.esv7') dataSource: Esv7DataSource) {
    super(Genre, dataSource);
  }
}
