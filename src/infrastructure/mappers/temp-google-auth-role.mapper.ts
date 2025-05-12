import { TempGoogleAuthRole as PrismaTempGoogleAuthRole } from '@prisma/client';
import { TempGoogleAuthRoleEntity } from 'src/domain/entities/temp-google-auth-role.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';

export class TempGoogleAuthRoleMapper {
  static toDomain(data: PrismaTempGoogleAuthRole): TempGoogleAuthRoleEntity {
    return new TempGoogleAuthRoleEntity(
      data.id,
      data.role as UserRole,
      data.isApplied,
      data.createdAt,
    );
  }
}
