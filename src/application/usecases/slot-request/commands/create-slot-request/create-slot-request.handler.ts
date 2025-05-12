import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { SlotRequestEntity } from 'src/domain/entities/slot-request.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { ISlotRequestRepository } from 'src/domain/interfaces/slot-request.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { CreateSlotRequestCommand } from './create-slot-request.command';

@Injectable()
export class CreateSlotRequestHandler {
  constructor(
    @Inject('ISlotRequestRepository')
    private readonly slotRequestRepository: ISlotRequestRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    command: CreateSlotRequestCommand,
  ): Promise<SlotRequestEntity | null> {
    const user = await this.userRepository.findById(command.requestedBy);

    if (!user) {
      throw new BadRequestException('Aucun utilisateur trouvé');
    }

    if (user.role === UserRole.RIDER) {
      const rider = await this.riderRepository.findById(command.riderId);
      if (!rider) {
        throw new BadRequestException('Aucun cavalier trouvé');
      }

      if (rider.userId !== command.requestedBy) {
        throw new BadRequestException(
          "Vous n'êtes pas autorisé à créer une demande de slot pour ce cavalier",
        );
      }

      const stable = await this.stableRepository.findById(command.stableId);
      if (!stable) {
        throw new BadRequestException('Aucun établissement trouvé');
      }

      const slotRequest = SlotRequestEntity.create({
        stableId: command.stableId,
        riderId: command.riderId,
        message: command.message,
        preferredStartDate: command.preferredStartDate,
        preferredEndDate: command.preferredEndDate,
      });

      const notification = NotificationEntity.create({
        userId: stable.userId,
        title: 'Nouvelle demande de leçon',
        message: `${rider.name} souhaite programmer une leçon`,
        status: NotificationStatus.UNREAD,
        type: NotificationType.INFO,
        sendBy: NotificationSender.RIDER,
        senderId: command.riderId,
      });
      await this.notificationRepository.create(notification);
      return this.slotRequestRepository.create(slotRequest);
    }

    return null;
  }
}
