import { RiderEntity } from '../entities/rider.entity';
import { RiderLevel } from '../enums/rider-level.enum';

export interface IRiderRepository {
  create(rider: RiderEntity): Promise<RiderEntity>;
  findByUserId(userId: string): Promise<RiderEntity | null>;
  findById(id: string): Promise<RiderEntity | null>;
  updateRiderLevel(paramis: {
    id: string;
    level: RiderLevel;
  }): Promise<RiderEntity>;
}
