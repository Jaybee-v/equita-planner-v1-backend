import { RiderEntity } from '../entities/rider.entity';

export interface IRiderRepository {
  create(rider: RiderEntity): Promise<RiderEntity>;
  findByUserId(userId: string): Promise<RiderEntity | null>;
  findById(id: string): Promise<RiderEntity | null>;
}
