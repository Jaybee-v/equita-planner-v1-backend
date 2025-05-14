import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { riderLevelTransformer } from 'src/domain/utils/rider-level-transformer';
import { UpdateRiderLevelCommand } from './update-rider-level.command';

@Injectable()
export class UpdateRiderLevelHandler {
  constructor(
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: UpdateRiderLevelCommand): Promise<RiderEntity> {
    const { riderId, level, requestedBy } = command;

    const stable = await this.stableRepository.findByUserId(requestedBy);

    if (!stable) {
      throw new BadRequestException("Cette action n'est pas autorisée");
    }

    const updatedRider = await this.riderRepository.updateRiderLevel({
      id: riderId,
      level: level,
    });
    const riderNotification = NotificationEntity.create({
      userId: updatedRider.userId,
      title: `${stable.name} vient de valider votre diplome `,
      message: `Votre ${riderLevelTransformer(level)} vient d'être validé.`,
      status: NotificationStatus.UNREAD,
      type: NotificationType.SUCCESS,
      sendBy: NotificationSender.SYSTEM,
    });
    await this.notificationRepository.create(riderNotification);

    const stableNotification = NotificationEntity.create({
      userId: stable.userId,
      title: `Vous avez validé un Galop`,
      message: `Vous avez validé le ${riderLevelTransformer(level)} de ${updatedRider.name}`,
      status: NotificationStatus.UNREAD,
      type: NotificationType.SUCCESS,
      sendBy: NotificationSender.SYSTEM,
    });
    await this.notificationRepository.create(stableNotification);
    return updatedRider;
  }
}
