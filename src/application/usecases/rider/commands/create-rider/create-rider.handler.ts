import { Inject, Injectable } from '@nestjs/common';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { CreateRiderCommand } from './create-rider.command';

@Injectable()
export class CreateRiderHandler {
  constructor(
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
  ) {}

  async execute(command: CreateRiderCommand): Promise<RiderEntity> {
    const rider = RiderEntity.create(
      command.userId,
      command.name,
      command.familyName,
      command.level,
      command.gender,
      '',
    );
    return this.riderRepository.create(rider);
  }
}
