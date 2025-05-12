import { Inject, Injectable } from '@nestjs/common';
import { SlotRequestEntity } from 'src/domain/entities/slot-request.entity';
import { ISlotRequestRepository } from 'src/domain/interfaces/slot-request.repository';
import { FindByRiderIdAndStatusQuery } from './find-by-rider-id-and-status.query';

@Injectable()
export class FindSlotsRequestByRiderIdAndStatusHandler {
  constructor(
    @Inject('ISlotRequestRepository')
    private readonly slotRequestRepository: ISlotRequestRepository,
  ) {}

  async execute(query: FindByRiderIdAndStatusQuery): Promise<{
    slotRequests: Record<string, SlotRequestEntity>[];
    count: number;
  }> {
    const slotRequests =
      await this.slotRequestRepository.findByRiderIdAndStatus(
        query.riderId,
        query.status,
        query.page,
        query.limit,
      );

    const count = await this.slotRequestRepository.countByRiderIdAndStatus(
      query.riderId,
      query.status,
    );

    return { slotRequests: slotRequests.map((slot) => slot.toJSON()), count };
  }
}
