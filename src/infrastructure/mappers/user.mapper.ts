import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from 'src/domain/entities/user.entity';

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity(
      raw.id,
      raw.email,
      raw.password,
      raw.lastSeen,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
