import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { Status } from 'src/domain/enums/status.enum';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IEmailService } from 'src/domain/interfaces/services/email.service';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { UpdateStatusCommand } from './update-status.command';

@Injectable()
export class UpdateAffiliationRequestStatusHandler {
  constructor(
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: UpdateStatusCommand) {
    const { id, status, userId } = command;

    const affiliationRequest =
      await this.affiliationRequestRepository.findById(id);

    if (!affiliationRequest) {
      throw new Error('Demande de rattachement non trouvée');
    }

    const stable = await this.stableRepository.findById(
      affiliationRequest.stableId,
    );

    if (!stable) {
      throw new Error('Aucun centre équestre lié à cette demande');
    }

    const rider = await this.riderRepository.findById(
      affiliationRequest.riderId,
    );

    if (!rider || !rider.user) {
      throw new Error('Aucun cavalier lié à cette demande');
    }

    if (
      affiliationRequest.stable?.userId !== userId &&
      affiliationRequest.rider?.userId !== userId
    ) {
      throw new Error("Vous n'avez pas les droits pour modifier cette demande");
    }

    if (command.status === Status.APPROVED) {
      await this.affiliationRequestRepository.updateStatus(id, status);
      const riderNotification = NotificationEntity.create({
        userId: rider.userId,
        title: `Affiliation validée`,
        message: `Votre demande d'affiliation à ${stable.name} a été acceptée.`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.AFFILIATION_REQUEST_APPROVED,
        sendBy: NotificationSender.STABLE,
        senderId: stable.id,
      });
      await this.notificationRepository.create(riderNotification);
      const stableNotification = NotificationEntity.create({
        userId: stable.userId,
        title: `Nouveau cavalier affilié`,
        message: `Vous avez validé la demande d'affiliation de ${rider.name} ${rider.familyName}`,
        status: NotificationStatus.READ,
        type: NotificationType.SYSTEM,
        sendBy: NotificationSender.SYSTEM,
      });
      await this.notificationRepository.create(stableNotification);
      await this.emailService.stableApprovalEmail({
        stableName: stable.name,
        name: rider.name,
        email: rider.user.email,
      });
      return {
        success: true,
        message: "Demande d'affiliation validée",
      };
    }

    if (command.status === Status.REJECTED) {
      const notification = NotificationEntity.create({
        userId: rider.userId,
        title: `Affiliation refusée`,
        message: `Votre demande d'affiliation à ${stable.name} a été refusée.`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.AFFILIATION_REQUEST_REJECTED,
        sendBy: NotificationSender.STABLE,
        senderId: stable.id,
      });
      await this.affiliationRequestRepository.delete(id);
      await this.notificationRepository.create(notification);
      return {
        success: true,
        message: "Demande d'affiliation refusée",
      };
    }

    return {
      success: false,
      message: 'Statut non valide',
    };
  }
}
