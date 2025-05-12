import { Injectable } from '@nestjs/common';
import { ActivityParticipantEntity } from 'src/domain/entities/activity-participant.entity';
import { Status } from 'src/domain/enums/status.enum';
import { IActivityParticipantRepository } from 'src/domain/interfaces/activity-participant.repository';
import { PrismaService } from '../config/prisma.service';
import { ActivityParticipantMapper } from '../mappers/activity-participant.mapper';

@Injectable()
export class ActivityParticipantRepository
  implements IActivityParticipantRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    participant: ActivityParticipantEntity,
  ): Promise<ActivityParticipantEntity> {
    const createdParticipant = await this.prisma.activityParticipant.create({
      data: {
        activityId: participant.activityId,
        riderId: participant.riderId,
        status: participant.status,
      },
    });

    return ActivityParticipantMapper.toDomain(createdParticipant);
  }

  async findByRiderId(data: {
    riderId: string;
    type: 'past' | 'waiting-response' | 'validated';
  }): Promise<ActivityParticipantEntity[]> {
    if (data.type === 'validated') {
      const now = new Date();
      const todayMidnight = new Date(
        new Date().setDate(new Date().getDate() - 1),
      );
      todayMidnight.setHours(23, 59, 59, 999);

      const participants = await this.prisma.activityParticipant.findMany({
        where: {
          riderId: data.riderId,
          status: Status.APPROVED,
          activity: {
            date: { gt: todayMidnight },
            startDate: { gt: now },
          },
        },
        include: {
          activity: true,
        },
      });

      return participants.map((participant) =>
        ActivityParticipantMapper.toDomain(participant),
      );
    }

    if (data.type === 'past') {
      const now = new Date();
      const participants = await this.prisma.activityParticipant.findMany({
        where: {
          riderId: data.riderId,
          activity: {
            date: { lt: now },
            startDate: { lt: now },
          },
        },
        include: {
          activity: true,
        },
      });

      return participants.map((participant) =>
        ActivityParticipantMapper.toDomain(participant),
      );
    }

    if (data.type === 'waiting-response') {
      const now = new Date();
      const participants = await this.prisma.activityParticipant.findMany({
        where: {
          riderId: data.riderId,
          status: Status.PENDING,
          activity: {
            date: { gt: now },
            startDate: { gt: now },
          },
        },
        include: {
          activity: true,
        },
      });

      return participants.map((participant) =>
        ActivityParticipantMapper.toDomain(participant),
      );
    }

    return [];
  }

  async findById(id: string): Promise<ActivityParticipantEntity | null> {
    const participant = await this.prisma.activityParticipant.findFirst({
      where: { id },
      include: {
        rider: {
          include: {
            user: true,
          },
        },
      },
    });

    return participant ? ActivityParticipantMapper.toDomain(participant) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.activityParticipant.delete({
      where: { id },
    });
  }
}
