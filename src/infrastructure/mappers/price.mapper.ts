import { Price as PrismaPrice } from '@prisma/client';
import { PriceEntity } from 'src/domain/entities/price.entity';

export class PriceMapper {
  static toDomain(raw: PrismaPrice): PriceEntity {
    return new PriceEntity(
      raw.id,
      raw.stableId,
      raw.label,
      raw.description || '',
      raw.price,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
