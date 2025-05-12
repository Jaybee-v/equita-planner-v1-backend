import { Module } from '@nestjs/common';
import { CreateActivityParticipantHandler } from 'src/application/usecases/activity-participant/commands/create-activity-participant/create-activity-participant.handler';
import { DeleteActivityParticipantHandler } from 'src/application/usecases/activity-participant/commands/delete-activity-participant/delete-activity-participant.handler';
import { FindActivityParticipantsByRiderIdHandler } from 'src/application/usecases/activity-participant/queries/find-by-rider-id/find-by-rider-id.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { ActivityParticipantRepository } from 'src/infrastructure/persistence/activity-participant.repository';
import { ActivityParticipantController } from '../controllers/activity-participant.controller';
import { ActivityModule } from './activity.module';
import { AffiliationRequestModule } from './affiliation-request.module';
import { NotificationModule } from './notification.module';
import { RiderModule } from './rider.module';
import { StableModule } from './stable.module';

@Module({
  imports: [
    ActivityModule,
    RiderModule,
    AffiliationRequestModule,
    NotificationModule,
    StableModule,
  ],
  controllers: [ActivityParticipantController],
  providers: [
    {
      provide: 'IActivityParticipantRepository',
      useClass: ActivityParticipantRepository,
    },
    CreateActivityParticipantHandler,
    DeleteActivityParticipantHandler,
    FindActivityParticipantsByRiderIdHandler,
    PrismaService,
  ],
  exports: ['IActivityParticipantRepository', CreateActivityParticipantHandler],
})
export class ActivityParticipantModule {}
