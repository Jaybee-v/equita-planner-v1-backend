import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { IActivityParticipantRepository } from 'src/domain/interfaces/activity-participant.repository';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { DeleteActivityParticipantCommand } from './delete-activity-participant.command';

@Injectable()
export class DeleteActivityParticipantHandler {
  constructor(
    @Inject('IActivityParticipantRepository')
    private readonly activityParticipantRepository: IActivityParticipantRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: DeleteActivityParticipantCommand): Promise<void> {
    const { id, requestedBy } = command;

    const participant = await this.activityParticipantRepository.findById(id);
    console.log(participant);
    if (!participant || !participant.rider) {
      throw new Error('Participant not found');
    }

    if (participant.rider.userId !== requestedBy) {
      throw new ForbiddenException(
        'Vous ne pouvez pas désinscrire un autre participant',
      );
    }

    const activity = await this.activityRepository.findActivityById(
      participant.activityId,
    );
    if (!activity) {
      throw new Error('Activity not found');
    }

    const stable = await this.stableRepository.findById(activity.stableId);

    if (!stable) {
      throw new Error('Stable not found');
    }

    await this.activityParticipantRepository.delete(id);
    const notification = NotificationEntity.create({
      userId: participant.rider.userId,
      title: 'Inscription annulée',
      message: `Ton inscription à "${activity.title}" le ${new Date(
        activity.date,
      ).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })} a été annulée`,
      status: NotificationStatus.READ,
      type: NotificationType.AFFILIATION_REQUEST_REJECTED,
      sendBy: NotificationSender.SYSTEM,
    });
    await this.notificationRepository.create(notification);
    const stableNotification = NotificationEntity.create({
      userId: stable.userId,
      title: 'Inscription annulée',
      message: `${participant.rider.name} s'est désinscrit de "${activity.title}" du ${new Date(
        activity.date,
      ).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      status: NotificationStatus.READ,
      type: NotificationType.AFFILIATION_REQUEST_REJECTED,
      sendBy: NotificationSender.RIDER,
      senderId: participant.rider.id,
    });
    await this.notificationRepository.create(stableNotification);
  }
}
