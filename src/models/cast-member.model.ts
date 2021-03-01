import {Entity, model, property} from '@loopback/repository';

export enum CastMemberType {
  DIRECTOR = 1,
  ACTOR = 2
}

@model()
export class CastMember extends Entity {

  @property({type: 'number', id: true, generated: false, required: true})
  id: number;

  @property({
    type: 'string', required: true, jsonSchema: {
      minLength: 1, maxLength: 255
    }
  })
  name: string;

  @property({type: 'number', required: true})
  type: number;

  @property({type: 'date', required: false})
  created_at: string;

  @property({type: 'date', required: false})
  updated_at: string;

  constructor(data?: Partial<CastMember>) {
    super(data);
  }
}

export interface CastMemberRelations {
  // describe navigational properties here
}

export type CastMemberWithRelations = CastMember & CastMemberRelations;
