import { PriceEntity } from '../entities/price.entity';

export interface IPriceRepository {
  create(price: PriceEntity): Promise<PriceEntity>;
}
