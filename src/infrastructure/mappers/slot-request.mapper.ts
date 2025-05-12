import {
  Rider as PrismaRider,
  SlotRequest as PrismaSlotRequest,
  Stable as PrismaStable,
} from '@prisma/client';
import { SlotRequestEntity } from 'src/domain/entities/slot-request.entity';
import { Status } from 'src/domain/enums/status.enum';
import { RiderMapper } from './rider.mapper';
import { StableMapper } from './stable.mapper';

export class SlotRequestMapper {
  static toDomain(
    raw: PrismaSlotRequest & { rider?: PrismaRider; stable?: PrismaStable },
  ): SlotRequestEntity {
    return new SlotRequestEntity(
      raw.id,
      raw.stableId,
      raw.riderId,
      raw.message ?? '',
      raw.status as Status,
      raw.createdAt,
      raw.updatedAt,
      raw.preferredStartDate,
      raw.preferredEndDate,
      raw.rider ? RiderMapper.toDomain(raw.rider) : undefined,
      raw.stable ? StableMapper.toDomain(raw.stable) : undefined,
    );
  }
}
