import {
  AffiliationRequest as PrismaAffiliationRequest,
  Instructor as PrismaInstructor,
  Price as PrismaPrice,
  SlotRequest as PrismaSlotRequest,
  Stable as PrismaStable,
} from '@prisma/client';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { AffiliationRequestMapper } from './affiliation-request.mapper';
import { InstructorMapper } from './instructor.mapper';
import { PriceMapper } from './price.mapper';
import { SlotRequestMapper } from './slot-request.mapper';

export class StableMapper {
  static toDomain(
    raw: PrismaStable & {
      affiliationRequests?: PrismaAffiliationRequest[];
      instructors?: PrismaInstructor[];
      slotRequests?: PrismaSlotRequest[];
      prices?: PrismaPrice[];
    },
  ): StableEntity {
    return new StableEntity(
      raw.id,
      raw.userId,
      raw.name,
      raw.street,
      raw.numStreet,
      raw.zip,
      raw.city,
      raw.country,
      raw.region ?? '',
      raw.department ?? '',
      raw.latitude ?? 0,
      raw.longitude ?? 0,
      raw.phone,
      raw.website ?? '',
      raw.logoUrl ?? '',
      raw.picture1 ?? '',
      raw.picture2 ?? '',
      raw.picture3 ?? '',
      raw.slug,
      raw.createdAt,
      raw.updatedAt,
      raw.affiliationRequests?.map((affiliationRequest) =>
        AffiliationRequestMapper.toDomain(affiliationRequest),
      ),
      raw.instructors?.map((instructor) =>
        InstructorMapper.toDomain(instructor),
      ),
      raw.slotRequests?.map((slotRequest) =>
        SlotRequestMapper.toDomain(slotRequest),
      ),
      raw.prices?.map((price) => PriceMapper.toDomain(price)),
    );
  }
}
