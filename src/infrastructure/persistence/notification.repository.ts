import { Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/domain/entities/notifications.entity';
import { NotificationStatus } from 'src/domain/enums/notification-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type';
import { INotificationRepository } from 'src/domain/interfaces/notification.repository';
import { PrismaService } from '../config/prisma.service';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    const createdNotification = await this.prisma.notification.create({
      data: {
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        status: notification.status,
        type: notification.type,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        sendBy: notification.sendBy,
        watchedAt: notification.watchedAt,
        senderId: notification.senderId,
      },
    });
    return NotificationMapper.toDomain(createdNotification);
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const notification = await this.prisma.notification.findFirst({
      where: { id },
    });
    return notification ? NotificationMapper.toDomain(notification) : null;
  }

  async updateStatusToRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { status: NotificationStatus.READ, watchedAt: new Date() },
    });
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
    type: string,
  ): Promise<NotificationEntity[]> {
    if (type === '') {
      const notifications = await this.prisma.notification.findMany({
        where: { userId },

        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      return notifications.map((notification) => {
        return NotificationMapper.toDomain(notification);
      });
    } else {
      const notifications = await this.prisma.notification.findMany({
        where: { userId, type: type as NotificationType },

        skip: (page - 1) * limit,
        take: limit,
      });
      return notifications.map((notification) => {
        return NotificationMapper.toDomain(notification);
      });
    }
  }

  async getTotalCountByUserId(userId: string): Promise<number> {
    const count = await this.prisma.notification.count({
      where: { userId },
    });
    return count;
  }
}
