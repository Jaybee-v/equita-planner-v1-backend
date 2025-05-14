import { Module } from '@nestjs/common';
import { CreateActivityHandler } from 'src/application/usecases/activity/commands/create-activity/create-activity.handler';
import { SendActivityNotificationHandler } from 'src/application/usecases/activity/commands/send-notification/send-notification.handler';
import { FindActivityByIdHandler } from 'src/application/usecases/activity/queries/find-by-id/find-by-id.handler';
import { FindActivitiesByInstructorIdBetweenDatesHandler } from 'src/application/usecases/activity/queries/find-by-instructor-between-dates/find-by-instuctor-between-dates.handler';
import { FindActivitiesByStableIdAndDayHandler } from 'src/application/usecases/activity/queries/find-by-stable-id-and-day/find-by-stable-id-and-day.handler';
import { FindByStableIdAndFiltersHandler } from 'src/application/usecases/activity/queries/find-by-stable-id-and-filters/find-by-stable-id-and-filters.handler';
import { FindByStableIdAndWeekHandler } from 'src/application/usecases/activity/queries/find-by-stable-id-and-week/find-by-stable-id-and-week.handler';
import { FindEmptySlotByStableIdBetweenDatesHandler } from 'src/application/usecases/activity/queries/find-empty-slot-by-stable-id-between-dates/find-empty-slot-by-stable-id-between-dates.handler';
import { FindThreeDaysActivitiesByStableIdHandler } from 'src/application/usecases/activity/queries/find-three-days-by-stable-id/find-three-days-by-stable-id.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { ActivityRepository } from 'src/infrastructure/persistence/activity.repository';
import { ActivityController } from '../controllers/activity.controller';
import { AffiliationRequestModule } from './affiliation-request.module';
import { InstructorModule } from './instructor.module';
import { NotificationModule } from './notification.module';
import { RiderModule } from './rider.module';
import { StableModule } from './stable.module';
@Module({
  imports: [
    StableModule,
    AffiliationRequestModule,
    RiderModule,
    NotificationModule,
    InstructorModule,
  ],
  controllers: [ActivityController],
  providers: [
    {
      provide: 'IActivityRepository',
      useClass: ActivityRepository,
    },
    CreateActivityHandler,
    FindActivitiesByStableIdAndDayHandler,
    FindActivityByIdHandler,
    FindByStableIdAndWeekHandler,
    SendActivityNotificationHandler,
    FindActivitiesByInstructorIdBetweenDatesHandler,
    FindByStableIdAndFiltersHandler,
    FindEmptySlotByStableIdBetweenDatesHandler,
    FindThreeDaysActivitiesByStableIdHandler,
    PrismaService,
  ],
  exports: [
    'IActivityRepository',
    CreateActivityHandler,
    FindActivityByIdHandler,
    FindByStableIdAndWeekHandler,
  ],
})
export class ActivityModule {}
