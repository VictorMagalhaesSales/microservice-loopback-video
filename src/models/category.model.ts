import {Entity, model, property} from '@loopback/repository';

@model()
export class Category extends Entity {

  @property({type: 'number', id: true, generated: false, required: true,})
  id: number;

  @property({type: 'string'})
  name?: string;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
