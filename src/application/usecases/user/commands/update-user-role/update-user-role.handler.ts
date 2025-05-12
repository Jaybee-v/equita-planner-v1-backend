import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSettingEntity } from 'src/domain/entities/user-setting.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IUserSettingRepository } from 'src/domain/interfaces/user-setting.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { UpdateUserRoleCommand } from './update-user-role.command';

@Injectable()
export class UpdateUserRoleHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IUserSettingRepository')
    private readonly userSettingRepository: IUserSettingRepository,
  ) {}

  async execute(command: UpdateUserRoleCommand): Promise<void> {
    const { userId, requestedBy, role } = command;

    if (requestedBy !== userId) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour effectuer cette action",
      );
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('Aucun utilisateur trouvé');
    }

    if (user.role !== UserRole.GUEST) {
      throw new BadRequestException(
        'Vous ne pouvez pas changer votre rôle, vous êtes déjà un utilisateur',
      );
    }

    await this.userRepository.updateUserRole(role, userId);
    const settings = UserSettingEntity.create({
      userId: userId,
      allStableNotifications: true,
      emailNotifications: true,
      pushNotifications: true,
    });

    await this.userSettingRepository.create(settings);
  }
}
