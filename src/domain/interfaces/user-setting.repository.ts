import { UserSettingEntity } from '../entities/user-setting.entity';

export interface IUserSettingRepository {
  create(userSetting: UserSettingEntity): Promise<UserSettingEntity>;
  updateStatus(
    id: string,
    status: boolean,
    type: 'allstableNotifications' | 'emailNotifications',
  ): Promise<boolean>;
}
