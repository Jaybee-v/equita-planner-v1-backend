import {
  Activity as PrismaActivity,
  ActivityParticipant as PrismaActivityParticipant,
  Rider as PrismaRider,
} from '@prisma/client';
import { ActivityParticipantEntity } from 'src/domain/entities/activity-participant.entity';
import { Status } from 'src/domain/enums/status.enum';
import { ActivityMapper } from './activity.mapper';
import { RiderMapper } from './rider.mapper';

export class ActivityParticipantMapper {
  static toDomain(
    raw: PrismaActivityParticipant & {
      rider?: PrismaRider;
      activity?: PrismaActivity;
    },
  ): ActivityParticipantEntity {
    return new ActivityParticipantEntity(
      raw.id,
      raw.activityId,
      raw.riderId,
      raw.status as Status,
      raw.createdAt,
      raw.rider ? RiderMapper.toDomain(raw.rider) : undefined,
      raw.activity ? ActivityMapper.toDomain(raw.activity) : undefined,
    );
  }
}
