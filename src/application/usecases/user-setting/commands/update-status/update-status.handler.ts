import { ForbiddenException, Inject } from '@nestjs/common';
import { IUserSettingRepository } from 'src/domain/interfaces/user-setting.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { UpdateStatusCommand } from './update-status.command';

export class UpdateUserSettingStatusHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IUserSettingRepository')
    private readonly userSettingRepository: IUserSettingRepository,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<boolean> {
    const user = await this.userRepository.findById(command.requestedBy);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const userSetting = user.userSetting;
    if (!userSetting) {
      throw new ForbiddenException('User setting not found');
    }
    if (userSetting.id !== command.id) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour modifier ce paramètre",
      );
    }
    let status = true;
    if (command.type === 'allstableNotifications') {
      status = !userSetting.allStableNotifications;
    } else {
      status = !userSetting.emailNotifications;
    }

    return this.userSettingRepository.updateStatus(
      command.id,
      status,
      command.type,
    );
  }
}
