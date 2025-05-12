import {
  Activity as PrismaActivity,
  ActivityParticipant as PrismaActivityParticipant,
  Instructor as PrismaInstructor,
  Stable as PrismaStable,
} from '@prisma/client';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { ActivityType } from 'src/domain/enums/activity-type.enum';
import { ActivityVisibility } from 'src/domain/enums/activity-visibility.enum';
import { CreatedByOption } from 'src/domain/enums/created-by-option.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { ValidationOption } from 'src/domain/enums/validation-option.enum';
import { ActivityParticipantMapper } from './activity-participant.mapper';
import { InstructorMapper } from './instructor.mapper';
import { StableMapper } from './stable.mapper';
export class ActivityMapper {
  static toDomain(
    raw: PrismaActivity & {
      participants?: PrismaActivityParticipant[];
      instructor?: PrismaInstructor;
      stable?: PrismaStable;
    },
  ): ActivityEntity {
    return new ActivityEntity(
      raw.id,
      raw.stableId,
      raw.title,
      raw.description ?? '',
      raw.date,
      raw.startDate,
      raw.endDate,
      raw.type as ActivityType,
      raw.visibility as ActivityVisibility,
      raw.requiredLevel as RiderLevel,
      raw.maxParticipants ?? 0,
      raw.createdBy as CreatedByOption,
      raw.createdFromRequestId ?? '',
      raw.validationParticipantOption as ValidationOption,
      raw.instructorId ?? '',
      raw.openToMoreLevel,
      raw.openToPublic,
      raw.createdAt,
      raw.updatedAt,
      raw.participants?.map((participant) =>
        ActivityParticipantMapper.toDomain(participant),
      ),
      raw.instructor ? InstructorMapper.toDomain(raw.instructor) : undefined,
      raw.stable ? StableMapper.toDomain(raw.stable) : undefined,
    );
  }
}
