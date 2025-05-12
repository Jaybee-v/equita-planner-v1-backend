import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { FindByIdQuery } from './find-by-id.query';

@Injectable()
export class FindRiderByIdHandler {
  constructor(
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
  ) {}

  async execute(query: FindByIdQuery): Promise<RiderEntity> {
    const rider = await this.riderRepository.findById(query.id);

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    return rider;
  }
}
