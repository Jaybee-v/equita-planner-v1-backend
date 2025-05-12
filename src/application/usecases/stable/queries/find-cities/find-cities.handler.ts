import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { FindCitiesQuery } from './find-cities.query';

@Injectable()
export class FindCitiesHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(query: FindCitiesQuery): Promise<string[]> {
    if (query.search.length < 3) {
      throw new BadRequestException(
        'La recherche doit contenir au moins 3 caractères',
      );
    }
    return this.stableRepository.findCities(query.search);
  }
}
