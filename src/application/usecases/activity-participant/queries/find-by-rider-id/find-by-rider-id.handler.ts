import { Inject, Injectable } from '@nestjs/common';
import { ActivityParticipantEntity } from 'src/domain/entities/activity-participant.entity';
import { IActivityParticipantRepository } from 'src/domain/interfaces/activity-participant.repository';
import { FindActivityParticipantsByRiderIdQuery } from './find-by-rider-id.query';

@Injectable()
export class FindActivityParticipantsByRiderIdHandler {
  constructor(
    @Inject('IActivityParticipantRepository')
    private readonly activityParticipantRepository: IActivityParticipantRepository,
  ) {}

  async execute(query: FindActivityParticipantsByRiderIdQuery): Promise<{
    waiting: Record<string, ActivityParticipantEntity>[];
    validated: Record<string, ActivityParticipantEntity>[];
    past: Record<string, ActivityParticipantEntity>[];
  }> {
    const waiting = await this.activityParticipantRepository.findByRiderId({
      riderId: query.riderId,
      type: 'waiting-response',
    });

    const validated = await this.activityParticipantRepository.findByRiderId({
      riderId: query.riderId,
      type: 'validated',
    });

    const past = await this.activityParticipantRepository.findByRiderId({
      riderId: query.riderId,
      type: 'past',
    });

    const _waiting = waiting.map((p) => p.toJson());
    const _validated = validated.map((p) => p.toJson());
    const _past = past.map((p) => p.toJson());

    return {
      waiting: _waiting,
      validated: _validated,
      past: _past,
    };
  }
}
