import { Module } from '@nestjs/common';
import { CreateSlotRequestHandler } from 'src/application/usecases/slot-request/commands/create-slot-request/create-slot-request.handler';
import { UpdateSlotRequestStatusHandler } from 'src/application/usecases/slot-request/commands/update-status/update-status.handler';
import { FindSlotsRequestByRiderIdAndStatusHandler } from 'src/application/usecases/slot-request/queries/find-by-rider-id-and-status/find-by-rider-id-and-status.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { SlotRequestRepository } from 'src/infrastructure/persistence/slot-request.repository';
import { SlotRequestController } from '../controllers/slot-request.controller';
import { ActivityParticipantModule } from './activity-participant.module';
import { ActivityModule } from './activity.module';
import { NotificationModule } from './notification.module';
import { RiderModule } from './rider.module';
import { StableModule } from './stable.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    RiderModule,
    StableModule,
    NotificationModule,
    ActivityModule,
    ActivityParticipantModule,
  ],
  controllers: [SlotRequestController],
  providers: [
    CreateSlotRequestHandler,
    UpdateSlotRequestStatusHandler,
    FindSlotsRequestByRiderIdAndStatusHandler,
    { provide: 'ISlotRequestRepository', useClass: SlotRequestRepository },
    PrismaService,
  ],
  exports: ['ISlotRequestRepository'],
})
export class SlotRequestModule {}
