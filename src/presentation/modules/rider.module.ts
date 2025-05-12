import { Module } from '@nestjs/common';
import { CreateRiderHandler } from 'src/application/usecases/rider/commands/create-rider/create-rider.handler';
import { FindRiderByIdHandler } from 'src/application/usecases/rider/queries/find-by-id/find-by-id.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { RiderRepository } from 'src/infrastructure/persistence/rider.repository';
import { RiderController } from '../controllers/rider.controller';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [RiderController],
  providers: [
    CreateRiderHandler,
    FindRiderByIdHandler,
    { provide: 'IRiderRepository', useClass: RiderRepository },
    PrismaService,
  ],
  exports: ['IRiderRepository'],
})
export class RiderModule {}
