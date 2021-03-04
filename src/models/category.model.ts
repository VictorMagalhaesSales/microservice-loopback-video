import {Entity, model, property} from '@loopback/repository';

export interface SmallerCategory {
  id: number;
  name: string;
  is_active: boolean;
}

@model()
export class Category extends Entity {

  @property({type: 'number', id: true, generated: false, required: true, })
  id: number;

  @property({type: 'string'})
  name?: string;

  @property({type: 'boolean', required: false, default: true})
  is_active: boolean;

  @property({type: 'date', required: false})
  created_at: string;

  @property({type: 'date', required: false})
  updated_at: string;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
