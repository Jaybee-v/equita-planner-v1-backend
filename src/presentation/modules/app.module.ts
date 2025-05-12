import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActivityParticipantModule } from './activity-participant.module';
import { ActivityModule } from './activity.module';
import { AffiliationRequestModule } from './affiliation-request.module';
import { EmailModule } from './email.module';
import { InstructorModule } from './instructor.module';
import { NotificationModule } from './notification.module';
import { RiderModule } from './rider.module';
import { SlotRequestModule } from './slot-request.module';
import { StableModule } from './stable.module';
import { UserModule } from './user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UserModule,
    RiderModule,
    StableModule,
    InstructorModule,
    AffiliationRequestModule,
    ActivityModule,
    ActivityParticipantModule,
    SlotRequestModule,
    NotificationModule,
    EmailModule,
  ],
  controllers: [],

  exports: [],
})
export class AppModule {}
