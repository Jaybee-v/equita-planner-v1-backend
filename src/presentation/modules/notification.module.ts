import { forwardRef, Module } from '@nestjs/common';
import { UpdateNotificationStatusToReadHandler } from 'src/application/usecases/notification/commands/update-status-to-read/update-status-to-read.handler';
import { FindNotificationsByUserIdHandler } from 'src/application/usecases/notification/queries/find-by-user-id/find-by-user-id.handler';
import { GetNotificationByIdHandler } from 'src/application/usecases/notification/queries/get-by-id/get-notification-by-id.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { NotificationRepository } from 'src/infrastructure/persistence/notification.repository';
import { NotificationController } from '../controllers/notification.controller';
import { RiderModule } from './rider.module';
import { StableModule } from './stable.module';

@Module({
  imports: [RiderModule, forwardRef(() => StableModule)],
  controllers: [NotificationController],
  providers: [
    GetNotificationByIdHandler,
    UpdateNotificationStatusToReadHandler,
    FindNotificationsByUserIdHandler,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    PrismaService,
  ],
  exports: ['INotificationRepository', GetNotificationByIdHandler],
})
export class NotificationModule {}
