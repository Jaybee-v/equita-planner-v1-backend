import { PreRegistration as PrismaPreRegistration } from '@prisma/client';
import { PreRegistrationEntity } from 'src/domain/entities/pre-registration.entity';

export class PreRegistrationMapper {
  static toDomain(raw: PrismaPreRegistration): PreRegistrationEntity {
    return new PreRegistrationEntity(raw.id, raw.email, raw.createdAt);
  }
}
