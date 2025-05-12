import { Inject, Injectable } from '@nestjs/common';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { FindStablesByGeoloc } from './find-by-geoloc.query';

@Injectable()
export class FindStablesByGeolocHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(query: FindStablesByGeoloc): Promise<StableEntity[]> {
    return this.stableRepository.findByGeoLocation(
      query.latitude,
      query.longitude,
    );
  }
}
