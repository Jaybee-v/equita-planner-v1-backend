import { Injectable } from '@nestjs/common';
import { SlotRequestEntity } from 'src/domain/entities/slot-request.entity';
import { Status } from 'src/domain/enums/status.enum';
import { ISlotRequestRepository } from 'src/domain/interfaces/slot-request.repository';
import { PrismaService } from '../config/prisma.service';
import { SlotRequestMapper } from '../mappers/slot-request.mapper';
@Injectable()
export class SlotRequestRepository implements ISlotRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(slotRequest: SlotRequestEntity): Promise<SlotRequestEntity> {
    const createdSlotRequest = await this.prisma.slotRequest.create({
      data: {
        stableId: slotRequest.stableId,
        riderId: slotRequest.riderId,
        message: slotRequest.message,
        status: slotRequest.status,
        preferredStartDate: slotRequest.preferredStartDate,
        preferredEndDate: slotRequest.preferredEndDate,
      },
    });

    return SlotRequestMapper.toDomain(createdSlotRequest);
  }

  async findById(id: string): Promise<SlotRequestEntity | null> {
    const slotRequest = await this.prisma.slotRequest.findFirst({
      where: { id },
      include: {
        rider: true,
        stable: true,
      },
    });
    return slotRequest ? SlotRequestMapper.toDomain(slotRequest) : null;
  }

  async update(slotRequest: SlotRequestEntity): Promise<SlotRequestEntity> {
    const updatedSlotRequest = await this.prisma.slotRequest.update({
      where: { id: slotRequest.id },
      data: {
        status: slotRequest.status,
        updatedAt: new Date(),
      },
    });
    return SlotRequestMapper.toDomain(updatedSlotRequest);
  }

  async findByRiderIdAndStatus(
    riderId: string,
    status: Status,
    page: number,
    limit: number,
  ): Promise<SlotRequestEntity[]> {
    const slotRequests = await this.prisma.slotRequest.findMany({
      where: { riderId, status },
      include: {
        rider: true,
        stable: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return slotRequests.map((slotRequest) =>
      SlotRequestMapper.toDomain(slotRequest),
    );
  }

  async countByRiderIdAndStatus(
    riderId: string,
    status: Status,
  ): Promise<number> {
    const count = await this.prisma.slotRequest.count({
      where: { riderId, status },
    });
    return count;
  }
}
