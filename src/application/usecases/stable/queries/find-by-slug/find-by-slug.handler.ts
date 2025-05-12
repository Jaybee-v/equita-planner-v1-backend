import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { FindBySlugQuery } from './find-by-slug.query';

@Injectable()
export class FindStableBySlugHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(query: FindBySlugQuery) {
    const stableBySlug = await this.stableRepository.findBySlug(query.slug);

    if (!stableBySlug) {
      const stableById = await this.stableRepository.findById(query.id);
      if (!stableById) {
        throw new NotFoundException('Stable not found');
      }
      return stableById;
    }
    return stableBySlug;
  }
}
