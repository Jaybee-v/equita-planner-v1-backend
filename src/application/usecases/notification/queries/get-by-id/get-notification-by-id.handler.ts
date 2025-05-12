import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { GetNotificationByIdQuery } from './get-by-id.query';

@Injectable()
export class GetNotificationByIdHandler {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(query: GetNotificationByIdQuery): Promise<{
    notification: Record<string, NotificationEntity>;
    rider: RiderEntity | null;
    stable: StableEntity | null;
  }> {
    const notification = await this.notificationRepository.findById(query.id);
    console.log(notification);
    if (!notification) {
      throw new NotFoundException('Aucune notification trouvée');
    }

    const type = notification.type;
    const rider: RiderEntity | null = null;
    const stable: StableEntity | null = null;

    // if (
    // type === NotificationType.AFFILIATION_REQUEST &&
    // notification.targetId
    // ) {
    // if (query.role === UserRole.RIDER) {
    // stable = await this.stableRepository.findById(notification.targetId);
    // }
    // if (query.role === UserRole.STABLE) {
    // rider = await this.riderRepository.findById(notification.targetId);
    // }
    // }

    return { notification: notification.toJson(), rider, stable };
  }
}
