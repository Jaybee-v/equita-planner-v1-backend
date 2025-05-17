import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PriceEntity } from 'src/domain/entities/price.entity';
import { IPriceRepository } from 'src/domain/interfaces/price.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { CreatePriceCommand } from './create-price.command';

@Injectable()
export class CreatePriceHandler {
  constructor(
    @Inject('IPriceRepository')
    private readonly priceRepository: IPriceRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: CreatePriceCommand): Promise<PriceEntity> {
    const stable = await this.stableRepository.findById(command.stableId);
    if (!stable) {
      throw new BadRequestException('Aucun établissement trouvé');
    }
    if (stable.userId !== command.requestedBy) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à créer un prix pour cet établissement",
      );
    }
    const price = PriceEntity.create(command);
    return await this.priceRepository.create(price);
  }
}
