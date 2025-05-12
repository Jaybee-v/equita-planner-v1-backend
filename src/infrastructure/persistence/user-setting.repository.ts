import { Injectable } from '@nestjs/common';
import { UserSettingEntity } from 'src/domain/entities/user-setting.entity';
import { IUserSettingRepository } from 'src/domain/interfaces/user-setting.repository';
import { PrismaService } from '../config/prisma.service';
import { UserSettingMapper } from '../mappers/user-setting.mapper';
@Injectable()
export class UserSettingRepository implements IUserSettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userSetting: UserSettingEntity): Promise<UserSettingEntity> {
    const createdUserSetting = await this.prisma.userSetting.create({
      data: {
        userId: userSetting.userId,
        allStableNotifications: userSetting.allStableNotifications,
        emailNotifications: userSetting.emailNotifications,
        pushNotifications: userSetting.pushNotifications,
      },
    });

    return UserSettingMapper.toDomain(createdUserSetting);
  }

  async updateStatus(
    id: string,
    status: boolean,
    type: 'allstableNotifications' | 'emailNotifications',
  ): Promise<boolean> {
    try {
      await this.prisma.userSetting.update({
        where: { id },
        data: {
          ...(type === 'allstableNotifications'
            ? {
                allStableNotifications: status,
              }
            : {}),
          ...(type === 'emailNotifications'
            ? {
                emailNotifications: status,
              }
            : {}),
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
