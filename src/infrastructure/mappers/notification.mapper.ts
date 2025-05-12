import {
  Notification as PrismaNotification,
  User as PrismaUser,
} from '@prisma/client';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationSender } from 'src/domain/enums/notification-sender.enum';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { UserMapper } from './user.mapper';

export class NotificationMapper {
  static toDomain(
    raw: PrismaNotification & { user?: PrismaUser },
  ): NotificationEntity {
    return new NotificationEntity(
      raw.id,
      raw.userId,
      raw.title,
      raw.message,
      raw.status as NotificationStatus,
      raw.type as NotificationType,
      raw.createdAt,
      raw.updatedAt,
      raw.sendBy as NotificationSender,
      raw.watchedAt ? new Date(raw.watchedAt) : undefined,
      raw.senderId ?? undefined,
      raw.user ? UserMapper.toDomain(raw.user) : undefined,
    );
  }
}
