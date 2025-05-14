import {
  ActivityParticipant as PrismaActivityParticipant,
  AffiliationRequest as PrismaAffiliationRequest,
  Rider as PrismaRider,
  SlotRequest as PrismaSlotRequest,
  User as PrismaUser,
} from '@prisma/client';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { Gender } from 'src/domain/enums/gender.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { ActivityParticipantMapper } from './activity-participant.mapper';
import { AffiliationRequestMapper } from './affiliation-request.mapper';
import { SlotRequestMapper } from './slot-request.mapper';
import { UserMapper } from './user.mapper';

export class RiderMapper {
  static toDomain(
    raw: PrismaRider & {
      affiliationRequests?: PrismaAffiliationRequest[];
      user?: PrismaUser;
      slotRequests?: PrismaSlotRequest[];
      activityParticipants?: PrismaActivityParticipant[];
    },
  ): RiderEntity {
    return new RiderEntity(
      raw.id,
      raw.userId,
      raw.name,
      raw.familyName,
      raw.level as RiderLevel,
      raw.gender as Gender,
      raw.createdAt,
      raw.updatedAt,
      raw.imageUrl ?? '',
      raw.affiliationRequests?.map((affiliation) =>
        AffiliationRequestMapper.toDomain(affiliation),
      ),
      raw.user ? UserMapper.toDomain(raw.user) : undefined,
      raw.slotRequests?.map((slotRequest) =>
        SlotRequestMapper.toDomain(slotRequest),
      ),
      raw.activityParticipants?.map((activityParticipant) =>
        ActivityParticipantMapper.toDomain(activityParticipant),
      ),
    );
  }
}
