import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {Genre} from '../models/genre.model';
import {GenreRepository} from '../repositories/genre.repository';

export class GenreController {
  constructor(
    @repository(GenreRepository)
    public genreRepository: GenreRepository,
  ) { }

  @get('/genres/count')
  @response(200, {
    description: 'Genre model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Genre) where?: Where<Genre>,
  ): Promise<Count> {
    return this.genreRepository.count(where);
  }

  @get('/genres')
  @response(200, {
    description: 'Array of Genre model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Genre, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Genre) filter?: Filter<Genre>,
  ): Promise<Genre[]> {
    return this.genreRepository.find(filter);
  }
  @get('/genres/{id}')
  @response(200, {
    description: 'Genre model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Genre, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Genre, {exclude: 'where'}) filter?: FilterExcludingWhere<Genre>
  ): Promise<Genre> {
    return this.genreRepository.findById(id, filter);
  }
}
