import { SlotRequestEntity } from '../entities/slot-request.entity';
import { Status } from '../enums/status.enum';

export interface ISlotRequestRepository {
  create(slotRequest: SlotRequestEntity): Promise<SlotRequestEntity>;
  findById(id: string): Promise<SlotRequestEntity | null>;
  update(slotRequest: SlotRequestEntity): Promise<SlotRequestEntity>;
  findByRiderIdAndStatus(
    riderId: string,
    status: Status,
    page: number,
    limit: number,
  ): Promise<SlotRequestEntity[]>;
  countByRiderIdAndStatus(riderId: string, status: Status): Promise<number>;
}
