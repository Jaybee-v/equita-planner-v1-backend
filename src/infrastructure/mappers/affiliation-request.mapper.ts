import {
  AffiliationRequest as PrismaAffiliationRequest,
  Rider as PrismaRider,
  Stable as PrismaStable,
} from '@prisma/client';
import { AffiliationRequestEntity } from 'src/domain/entities/affiliation-request.entity';
import { Status } from 'src/domain/enums/status.enum';
import { RiderMapper } from './rider.mapper';
import { StableMapper } from './stable.mapper';
export class AffiliationRequestMapper {
  static toDomain(
    raw: PrismaAffiliationRequest & {
      stable?: PrismaStable;
      rider?: PrismaRider;
    },
  ): AffiliationRequestEntity {
    return new AffiliationRequestEntity(
      raw.id,
      raw.riderId,
      raw.stableId,
      raw.status as Status,
      raw.createdAt,
      raw.updatedAt,
      raw.stable ? StableMapper.toDomain(raw.stable) : undefined,
      raw.rider ? RiderMapper.toDomain(raw.rider) : undefined,
    );
  }
}
