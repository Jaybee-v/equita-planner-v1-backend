import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { SelectRiderLevelRequestForNotification } from 'src/domain/enums/select-rider-level-request-for-notification';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { SendActivityNotificationCommand } from './send-notification.command';

@Injectable()
export class SendActivityNotificationHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: SendActivityNotificationCommand) {
    const { stableId, activityId, message, type, requestedBy, riderLevel } =
      command;

    const stable = await this.stableRepository.findById(stableId);

    if (!stable) {
      throw new NotFoundException('Aucun établissement trouvé');
    }

    if (stable.userId !== requestedBy || stable.id !== stableId) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour envoyer une notification à cet établissement",
      );
    }

    const activity =
      await this.activityRepository.findActivityByIdWithAllData(activityId);

    if (!activity) {
      throw new NotFoundException('Aucune activité trouvée');
    }

    const _riders = await this.affiliationRequestRepository.findByStableId({
      stableId: stable.id,
      page: 1,
      limit: 100,
    });
    const riders = _riders.map((rider) => rider.rider);
    const users = riders
      .filter((r) => {
        if (riderLevel === SelectRiderLevelRequestForNotification.ALL_RIDERS) {
          return true;
        }
        if (
          riderLevel === SelectRiderLevelRequestForNotification.REQUIRED_LEVEL
        ) {
          return r?.level === activity.requiredLevel;
        }
        if (
          riderLevel ===
          SelectRiderLevelRequestForNotification.REQUIRED_LEVEL_AND_ABOVE
        ) {
          return r && r?.level >= activity.requiredLevel;
        }
        return false;
      })
      .map((rider) => rider?.user)
      .filter((user): user is UserEntity => user !== undefined)
      .map((user) => user.toJSON());
    for (let i = 0; i < users.length; i++) {
      console.log(users[i]);
      const notification = NotificationEntity.create({
        userId: users[i].id,
        title: `${stable.name} vous invite à une activité`,
        message: `Vous avez été invité à une activité`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.FROM_STABLE,
        sendBy: NotificationSender.STABLE,
        senderId: stable.id,
      });
      await this.notificationRepository.create(notification);
    }
    const notification = NotificationEntity.create({
      userId: stable.userId,
      title: `Vous avez envoyé des invitations à ${users.length} cavaliers`,
      message: ``,
      status: NotificationStatus.READ,
      type: NotificationType.SYSTEM,
      sendBy: NotificationSender.SYSTEM,
    });
    await this.notificationRepository.create(notification);
  }
}
