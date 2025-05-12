import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ActivityParticipantEntity } from 'src/domain/entities/activity-participant.entity';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { RiderLevel, riderLevelOrder } from 'src/domain/enums/rider-level.enum';
import { Status } from 'src/domain/enums/status.enum';
import { ValidationOption } from 'src/domain/enums/validation-option.enum';
import { IActivityParticipantRepository } from 'src/domain/interfaces/activity-participant.repository';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { CreateActivityParticipantCommand } from './create-activity-participant.command';
@Injectable()
export class CreateActivityParticipantHandler {
  constructor(
    @Inject('IActivityParticipantRepository')
    private readonly activityParticipantRepository: IActivityParticipantRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(
    command: CreateActivityParticipantCommand,
  ): Promise<ActivityParticipantEntity> {
    const { activityId, riderId, requestedBy } = command;

    const rider = await this.riderRepository.findById(riderId);

    if (!rider) {
      throw new Error('Rider not found');
    }

    if (rider.userId !== requestedBy) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à ajouter ce participant",
      );
    }

    const activity = await this.activityRepository.findActivityById(activityId);

    if (!activity) {
      throw new Error('Activity not found');
    }

    const stable = await this.stableRepository.findById(activity.stableId);

    if (!stable) {
      throw new Error('Aucun club trouvé pour cette activité');
    }

    const affiliation =
      await this.affiliationRequestRepository.findByDifferentsUser({
        stableId: activity.stableId,
        riderId: rider.id,
      });

    if (!affiliation) {
      throw new ForbiddenException(
        'Vous devez être affilié à ce club pour participer à cette activité',
      );
    }

    if (affiliation.status === Status.PENDING) {
      throw new ForbiddenException(
        "Votre demande d'affiliation est en cours de validation",
      );
    }

    if (affiliation.status === Status.APPROVED) {
      let activityParticipant: ActivityParticipantEntity | null = null;
      if (
        activity.openToMoreLevel &&
        riderLevelOrder.indexOf(activity.requiredLevel) <
          riderLevelOrder.indexOf(rider.level) &&
        activity.requiredLevel !== RiderLevel.ALL
      ) {
        const request = ActivityParticipantEntity.create({
          activityId,
          riderId,
          status:
            activity.validationParticipantOption === ValidationOption.AUTOMATIC
              ? Status.APPROVED
              : Status.PENDING,
          createdAt: new Date(),
        });
        activityParticipant =
          await this.activityParticipantRepository.create(request);
      }
      if (activity.requiredLevel === RiderLevel.ALL) {
        const request = ActivityParticipantEntity.create({
          activityId,
          riderId,
          status:
            activity.validationParticipantOption === ValidationOption.AUTOMATIC
              ? Status.APPROVED
              : Status.PENDING,
          createdAt: new Date(),
        });
        activityParticipant =
          await this.activityParticipantRepository.create(request);
      }
      if (!activity.openToMoreLevel && rider.level === activity.requiredLevel) {
        const request = ActivityParticipantEntity.create({
          activityId,
          riderId,
          status:
            activity.validationParticipantOption === ValidationOption.AUTOMATIC
              ? Status.APPROVED
              : Status.PENDING,
          createdAt: new Date(),
        });
        activityParticipant =
          await this.activityParticipantRepository.create(request);

        return activityParticipant;
      }
      if (activityParticipant) {
        if (
          activity.validationParticipantOption === ValidationOption.AUTOMATIC
        ) {
          const notification = NotificationEntity.create({
            userId: rider.userId,
            title: 'Inscription validée',
            message: `Ton inscription à "${activity.title}" a été validée`,
            status: NotificationStatus.UNREAD,
            type: NotificationType.VALIDATION,
            sendBy: NotificationSender.STABLE,
            senderId: stable.id,
          });
          await this.notificationRepository.create(notification);
          const stableNotification = NotificationEntity.create({
            userId: stable.userId,
            title: 'Nouvelle inscription',
            message: `${rider.name} s'est inscrit à "${activity.title}" le ${new Date(
              activity.date,
            ).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })} à ${new Date(activity.startDate).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            status: NotificationStatus.READ,
            type: NotificationType.VALIDATION,
            sendBy: NotificationSender.RIDER,
            senderId: rider.id,
          });
          await this.notificationRepository.create(stableNotification);
        } else {
          const notification = NotificationEntity.create({
            userId: rider.userId,
            title: 'Inscription en attente',
            message: `Ton inscription à "${activity.title}" est en attente de validation`,
            status: NotificationStatus.UNREAD,
            type: NotificationType.INFO,
            sendBy: NotificationSender.STABLE,
            senderId: stable.id,
          });
          await this.notificationRepository.create(notification);
          const stableNotification = NotificationEntity.create({
            userId: stable.userId,
            title: 'Un cavalier est en attente',
            message: `Un cavalier est en attente de validation pour "${activity.title}"`,
            status: NotificationStatus.UNREAD,
            type: NotificationType.INFO,
            sendBy: NotificationSender.RIDER,
            senderId: rider.id,
          });
          await this.notificationRepository.create(stableNotification);
        }
        return activityParticipant;
      }
    }
    throw new ForbiddenException(
      'Vous ne pouvez pas participer à cette activité',
    );
  }
}
