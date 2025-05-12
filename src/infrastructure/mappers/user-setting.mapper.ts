import { UserSetting as PrismaUserSetting } from '@prisma/client';
import { UserSettingEntity } from 'src/domain/entities/user-setting.entity';
export class UserSettingMapper {
  public static toDomain(data: PrismaUserSetting): UserSettingEntity {
    return new UserSettingEntity(
      data.id,
      data.userId,
      data.allStableNotifications,
      data.emailNotifications,
      data.pushNotifications,
      data.createdAt,
      data.updatedAt,
    );
  }
}
