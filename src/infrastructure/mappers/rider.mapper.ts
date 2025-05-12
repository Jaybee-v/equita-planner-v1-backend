import {
  AffiliationRequest as PrismaAffiliationRequest,
  Rider as PrismaRider,
  User as PrismaUser,
} from '@prisma/client';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { Gender } from 'src/domain/enums/gender.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { AffiliationRequestMapper } from './affiliation-request.mapper';
import { UserMapper } from './user.mapper';

export class RiderMapper {
  static toDomain(
    raw: PrismaRider & {
      affiliationRequests?: PrismaAffiliationRequest[];
      user?: PrismaUser;
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
    );
  }
}
