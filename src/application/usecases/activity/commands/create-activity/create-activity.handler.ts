import { Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { IInstructorRepository } from 'src/domain/interfaces/instructor.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { CreateActivityCommand } from './create-activity.command';

@Injectable()
export class CreateActivityHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IInstructorRepository')
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute(command: CreateActivityCommand): Promise<ActivityEntity> {
    const stable = await this.stableRepository.findById(command.stableId);

    if (!stable) {
      throw new Error('Stable not found');
    }

    const newActivity = ActivityEntity.create({
      stableId: command.stableId,
      title: command.title,
      description: command.description,
      date: command.date,
      startDate: command.startDate,
      endDate: command.endDate,
      type: command.type,
      visibility: command.visibility,
      requiredLevel: command.requiredLevel,
      maxParticipants: command.maxParticipants,
      createdBy: command.createdBy,
      createdFromRequestId: command.createdFromRequestId,
      validationParticipantOption: command.validationParticipantOption,
      openToMoreLevel: command.openToMoreLevel,
      instructorId: command.instructorId,
    });

    const createdActivity = await this.activityRepository.create(newActivity);

    const affiliations = await this.affiliationRequestRepository.findByStableId(
      {
        stableId: command.stableId,
        page: 1,
        limit: 100,
      },
    );

    for (const affiliation of affiliations) {
      if (affiliation.rider && affiliation.rider.user) {
        const notification = NotificationEntity.create({
          userId: affiliation.rider.user.id,
          title: 'Nouvelle activité proposée',
          message: `${stable.name} vient de créer une activité le ${new Date(
            newActivity.date,
          ).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}`,
          status: NotificationStatus.UNREAD,
          type: NotificationType.FROM_STABLE,
          sendBy: NotificationSender.STABLE,
          senderId: stable.id,
        });

        await this.notificationRepository.create(notification);
      }

      if (createdActivity.instructorId) {
        const instructor = await this.instructorRepository.findById(
          createdActivity.instructorId,
        );

        if (!instructor) {
          continue;
        }

        const notification = NotificationEntity.create({
          userId: instructor.userId,
          title: 'Nouvelle activitié',
          message: `${stable.name} vient de vous attribuer une activité le ${new Date(
            newActivity.date,
          ).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })} de ${new Date(newActivity.startDate).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })} à ${new Date(newActivity.endDate).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          status: NotificationStatus.UNREAD,
          type: NotificationType.FROM_STABLE,
          sendBy: NotificationSender.STABLE,
          senderId: stable.id,
        });

        await this.notificationRepository.create(notification);
      }
    }

    return createdActivity;
  }
}
