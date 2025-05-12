import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { FindNotificationsByUserIdQuery } from './find-by-user-id.query';

@Injectable()
export class FindNotificationsByUserIdHandler {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(query: FindNotificationsByUserIdQuery): Promise<{
    notifications: Record<string, NotificationEntity>[];
    totalCount: number;
  }> {
    const totalCount = await this.notificationRepository.getTotalCountByUserId(
      query.userId,
    );
    const notifications = await this.notificationRepository.findByUserId(
      query.userId,
      query.page,
      query.limit,
      query.type,
    );
    return {
      notifications: notifications.map((notification) => notification.toJson()),
      totalCount,
    };
  }
}
