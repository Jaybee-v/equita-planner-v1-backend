import { ActivityParticipantEntity } from '../entities/activity-participant.entity';

export interface IActivityParticipantRepository {
  create(
    participant: ActivityParticipantEntity,
  ): Promise<ActivityParticipantEntity>;
  findByRiderId(data: {
    riderId: string;
    type: 'past' | 'waiting-response' | 'validated';
  }): Promise<ActivityParticipantEntity[]>;
  findById(id: string): Promise<ActivityParticipantEntity | null>;
  delete(id: string): Promise<void>;
}
