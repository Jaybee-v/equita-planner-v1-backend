import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityParticipantEntity } from 'src/domain/entities/activity-participant.entity';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { ActivityType } from 'src/domain/enums/activity-type.enum';
import { ActivityVisibility } from 'src/domain/enums/activity-visibility.enum';
import { CreatedByOption } from 'src/domain/enums/created-by-option.enum';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { Status } from 'src/domain/enums/status.enum';
import { ValidationOption } from 'src/domain/enums/validation-option.enum';
import { IActivityParticipantRepository } from 'src/domain/interfaces/activity-participant.repository';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { ISlotRequestRepository } from 'src/domain/interfaces/slot-request.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { UpdateStatusCommand } from './update-status.command';

@Injectable()
export class UpdateSlotRequestStatusHandler {
  constructor(
    @Inject('ISlotRequestRepository')
    private readonly slotRequestRepository: ISlotRequestRepository,
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IActivityParticipantRepository')
    private readonly activityParticipantRepository: IActivityParticipantRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<void> {
    const { slotRequestId, status, requestedBy } = command;

    const slotRequest =
      await this.slotRequestRepository.findById(slotRequestId);

    if (!slotRequest) {
      throw new NotFoundException('Aucune demande trouvée');
    }

    if (
      slotRequest.status !== Status.PENDING ||
      !slotRequest.rider ||
      !slotRequest.stable
    ) {
      throw new BadRequestException("La demande n'est pas en attente");
    }

    const stable = await this.stableRepository.findById(slotRequest.stableId);

    if (!stable) {
      throw new NotFoundException('Aucune écurie trouvée');
    }

    if (slotRequest.stable.userId !== requestedBy) {
      throw new BadRequestException(
        "Vous n'êtes pas autorisé à modifier cette demande",
      );
    }

    slotRequest.status = status as Status;

    if (status === Status.APPROVED) {
      const newActivity = ActivityEntity.create({
        stableId: slotRequest.stableId,
        title: slotRequest.rider.name,
        description: '',
        date: slotRequest.preferredStartDate,
        startDate: slotRequest.preferredStartDate,
        endDate: slotRequest.preferredEndDate,
        type: ActivityType.PRIVATE,
        visibility: ActivityVisibility.PRIVATE,
        maxParticipants: 1,
        createdBy: CreatedByOption.SYSTEM,
        createdFromRequestId: slotRequest.id,
        validationParticipantOption: ValidationOption.AUTOMATIC,
        requiredLevel: slotRequest.rider.level,
        openToMoreLevel: false,
        instructorId: null,
        priceId: stable.prices[0].id,
      });

      const _newActivity = await this.activityRepository.create(newActivity);

      const newActivityParticipant = ActivityParticipantEntity.create({
        activityId: _newActivity.id,
        riderId: slotRequest.rider.id,
        status: Status.APPROVED,
        createdAt: new Date(),
      });

      await this.activityParticipantRepository.create(newActivityParticipant);

      await this.slotRequestRepository.update(slotRequest);

      const riderNotification = NotificationEntity.create({
        userId: slotRequest.rider.userId,
        title: 'Demande de leçon acceptée',
        message: `Votre demande de leçon pour le ${slotRequest.preferredStartDate.toLocaleDateString(
          'fr-FR',
          {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        )} (${slotRequest.preferredStartDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${slotRequest.preferredEndDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}) a été acceptée`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.VALIDATION,
        sendBy: NotificationSender.STABLE,
        senderId: slotRequest.stable.id,
      });

      await this.notificationRepository.create(riderNotification);

      const stableNotification = NotificationEntity.create({
        userId: slotRequest.stable.userId,
        title: "Leçon ajoutée à l'agenda",
        message: `${slotRequest.rider.name} a été ajouté à l'agenda ${slotRequest.preferredStartDate.toLocaleDateString(
          'fr-FR',
          {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        )} (${slotRequest.preferredStartDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${slotRequest.preferredEndDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })})`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.VALIDATION,
        sendBy: NotificationSender.RIDER,
        senderId: slotRequest.rider.id,
      });

      await this.notificationRepository.create(stableNotification);
    }

    if (status === Status.REJECTED) {
      await this.slotRequestRepository.update(slotRequest);

      const riderNotification = NotificationEntity.create({
        userId: slotRequest.rider.userId,
        title: 'Votre demande a été refusée',
        message: `Votre demande de leçon a été refusée par ${slotRequest.stable.name}`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.AFFILIATION_REQUEST_REJECTED,
        sendBy: NotificationSender.STABLE,
        senderId: slotRequest.stable.id,
      });

      await this.notificationRepository.create(riderNotification);

      const stableNotification = NotificationEntity.create({
        userId: slotRequest.stable.userId,
        title: 'Leçon refusée',
        message: `La demande de ${slotRequest.rider.name} a été refusée`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.AFFILIATION_REQUEST_REJECTED,
        sendBy: NotificationSender.RIDER,
        senderId: slotRequest.rider.id,
      });

      await this.notificationRepository.create(stableNotification);
    }
  }
}
