import { Module } from '@nestjs/common';
import { CreateAffiliationHandler } from 'src/application/usecases/affiliation-request/commands/create-affiliation/create-affiliation.handler';
import { UpdateAffiliationRequestStatusHandler } from 'src/application/usecases/affiliation-request/commands/update-status/update-status.handler';
import { FindAffiliationByStableIdHandler } from 'src/application/usecases/affiliation-request/queries/find-by-stable-id.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { AffiliationRequestRepository } from 'src/infrastructure/persistence/affiliation-request.repository';
import { AffiliationRequestController } from '../controllers/affiliation-request.controller';
import { EmailModule } from './email.module';
import { NotificationModule } from './notification.module';
import { RiderModule } from './rider.module';
import { StableModule } from './stable.module';

@Module({
  imports: [RiderModule, StableModule, NotificationModule, EmailModule],
  controllers: [AffiliationRequestController],
  providers: [
    {
      provide: 'IAffiliationRequestRepository',
      useClass: AffiliationRequestRepository,
    },
    CreateAffiliationHandler,
    UpdateAffiliationRequestStatusHandler,
    FindAffiliationByStableIdHandler,
    PrismaService,
  ],
  exports: ['IAffiliationRequestRepository'],
})
export class AffiliationRequestModule {}
