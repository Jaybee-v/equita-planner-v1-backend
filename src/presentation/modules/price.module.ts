import { Module } from '@nestjs/common';
import { CreatePriceHandler } from 'src/application/usecases/price/commands/create-price/create-price.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { PriceRepository } from 'src/infrastructure/persistence/price.repository';
import { PriceController } from '../controllers/price.controller';
import { StableModule } from './stable.module';

@Module({
  imports: [StableModule],
  controllers: [PriceController],
  providers: [
    CreatePriceHandler,
    {
      provide: 'IPriceRepository',
      useClass: PriceRepository,
    },
    PrismaService,
  ],
  exports: ['IPriceRepository'],
})
export class PriceModule {}
