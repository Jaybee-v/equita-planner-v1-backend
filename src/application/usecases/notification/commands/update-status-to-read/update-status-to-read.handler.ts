import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { UpdateNotificationStatusToReadCommand } from './update-status-to-read.command';

@Injectable()
export class UpdateNotificationStatusToReadHandler {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: UpdateNotificationStatusToReadCommand): Promise<void> {
    const notification = await this.notificationRepository.findById(command.id);
    if (!notification) {
      throw new NotFoundException('Aucune notification trouvée');
    }

    if (command.role === UserRole.RIDER) {
      const rider = await this.riderRepository.findByUserId(command.userId);
      if (!rider) {
        throw new NotFoundException('Aucun cavalier trouvé');
      }
      if (rider.userId !== notification.userId) {
        throw new ForbiddenException(
          "Vous n'avez pas les droits pour modifier cette notification",
        );
      }
    }

    if (command.role === UserRole.STABLE) {
      const stable = await this.stableRepository.findByUserId(command.userId);
      if (!stable) {
        throw new NotFoundException('Aucun écurie trouvée');
      }
      if (stable.userId !== notification.userId) {
        throw new ForbiddenException(
          "Vous n'avez pas les droits pour modifier cette notification",
        );
      }
    }

    await this.notificationRepository.updateStatusToRead(command.id);
  }
}
