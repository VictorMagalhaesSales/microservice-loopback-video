import {Entity, model, property} from '@loopback/repository';

@model()
export class Genre extends Entity {

  @property({type: 'number', id: true, generated: false, required: true})
  id: number;

  @property({type: 'string', required: true})
  name: string;

  @property({type: 'boolean', required: false, default: true})
  is_active: boolean;

  @property({type: 'date', required: false})
  created_at: string;

  @property({type: 'date', required: false})
  updated_at: string;

  constructor(data?: Partial<Genre>) {
    super(data);
  }
}

export interface GenreRelations {
  // describe navigational properties here
}

export type GenreWithRelations = Genre & GenreRelations;
