import { NotificationEntity } from '../entities/notifications.entity';

export interface INotificationRepository {
  create(notification: NotificationEntity): Promise<NotificationEntity>;
  findById(id: string): Promise<NotificationEntity | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
    type: string,
  ): Promise<NotificationEntity[]>;
  getTotalCountByUserId(userId: string): Promise<number>;
  updateStatusToRead(id: string): Promise<void>;
}
