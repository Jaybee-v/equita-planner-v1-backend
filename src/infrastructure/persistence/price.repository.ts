import { Injectable } from '@nestjs/common';
import { PriceEntity } from 'src/domain/entities/price.entity';
import { IPriceRepository } from 'src/domain/interfaces/price.repository';
import { PrismaService } from '../config/prisma.service';
import { PriceMapper } from '../mappers/price.mapper';

@Injectable()
export class PriceRepository implements IPriceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(price: PriceEntity): Promise<PriceEntity> {
    const createdPrice = await this.prisma.price.create({
      data: {
        stableId: price.stableId,
        label: price.label,
        description: price.description,
        price: price.price,
      },
    });

    return PriceMapper.toDomain(createdPrice);
  }
}
