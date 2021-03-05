import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {CastMember} from '../models/cast-member.model';
import {CastMemberRepository} from '../repositories/cast-member.repository';

export class CastmemberController {
  constructor(
    @repository(CastMemberRepository)
    public castMemberRepository: CastMemberRepository,
  ) { }

  @get('/cast-members/count')
  @response(200, {
    description: 'CastMember model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CastMember) where?: Where<CastMember>,
  ): Promise<Count> {
    return this.castMemberRepository.count(where);
  }

  @get('/cast-members')
  @response(200, {
    description: 'Array of CastMember model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CastMember, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CastMember) filter?: Filter<CastMember>,
  ): Promise<CastMember[]> {
    return this.castMemberRepository.find(filter);
  }

  @get('/cast-members/{id}')
  @response(200, {
    description: 'CastMember model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CastMember, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CastMember, {exclude: 'where'}) filter?: FilterExcludingWhere<CastMember>
  ): Promise<CastMember> {
    return this.castMemberRepository.findById(id, filter);
  }
}
