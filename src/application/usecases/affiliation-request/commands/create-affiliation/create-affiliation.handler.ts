import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AffiliationRequestEntity } from 'src/domain/entities/affiliation-request.entity';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { CreateAffiliationCommand } from './create-affiliation.command';

@Injectable()
export class CreateAffiliationHandler {
  constructor(
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: CreateAffiliationCommand): Promise<void> {
    const { riderId, stableId, creatorId } = command;

    const rider = await this.riderRepository.findByUserId(creatorId);

    if (!rider) {
      throw new NotFoundException("Aucun cavalier n'a été trouvé");
    }

    if (rider.id !== riderId) {
      throw new BadRequestException(
        "Vous n'êtes pas autorisé à créer une demande d'affiliation pour un autre cavalier",
      );
    }

    const stable = await this.stableRepository.findById(stableId);

    if (!stable) {
      throw new NotFoundException("Aucun centre équestre n'a été trouvé");
    }

    const checkIsAlreadyAffiliated =
      await this.affiliationRequestRepository.findByRiderId(riderId);

    if (checkIsAlreadyAffiliated.length > 0) {
      throw new BadRequestException(
        'Vous êtes déjà affilié à un centre équestre',
      );
    }
    const affiliationRequest = AffiliationRequestEntity.create(
      riderId,
      stableId,
    );

    const notification = NotificationEntity.create({
      userId: stable.userId,
      title: `Nouvelle demande d'affiliation`,
      message: `${rider.name} ${rider.familyName} souhaite rejoindre votre club`,
      status: NotificationStatus.UNREAD,
      type: NotificationType.AFFILIATION_REQUEST,
      sendBy: NotificationSender.RIDER,
      senderId: rider.id,
    });
    await this.notificationRepository.create(notification);

    await this.affiliationRequestRepository.create(affiliationRequest);
  }
}
