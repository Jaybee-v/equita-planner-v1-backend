import {
  Notification as PrismaNotification,
  Rider as PrismaRider,
  User as PrismaUser,
  UserSetting as PrismaUserSetting,
} from '@prisma/client';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { NotificationMapper } from './notification.mapper';
import { RiderMapper } from './rider.mapper';
import { UserSettingMapper } from './user-setting.mapper';
export class UserMapper {
  static toDomain(
    raw: PrismaUser & {
      notifications?: PrismaNotification[];
      rider?: PrismaRider;
      userSetting?: PrismaUserSetting;
    },
  ): UserEntity {
    return new UserEntity(
      raw.id,
      raw.email,
      raw.password,
      raw.role as UserRole,
      raw.isVerified,
      raw.lastSeen,
      raw.isIndependentInstructor,
      raw.createdAt,
      raw.updatedAt,
      raw.mustChangePassword,
      raw.notifications?.map((notification) =>
        NotificationMapper.toDomain(notification),
      ),
      raw.rider ? RiderMapper.toDomain(raw.rider) : undefined,
      raw.invitedBy ? raw.invitedBy : undefined,
      raw.userSetting ? UserSettingMapper.toDomain(raw.userSetting) : undefined,
    );
  }
}
