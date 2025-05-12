import { Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { PrismaService } from '../config/prisma.service';
import { ActivityMapper } from '../mappers/activity.mapper';

@Injectable()
export class ActivityRepository implements IActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(activity: ActivityEntity): Promise<ActivityEntity> {
    const createdActivity = await this.prisma.activity.create({
      data: {
        stableId: activity.stableId,
        title: activity.title,
        description: activity.description,
        date: activity.date,
        startDate: activity.startDate,
        endDate: activity.endDate,
        type: activity.type,
        visibility: activity.visibility,
        requiredLevel: activity.requiredLevel,
        maxParticipants: activity.maxParticipants,
        createdBy: activity.createdBy,
        createdFromRequestId: activity.createdFromRequestId,
        validationParticipantOption: activity.validationParticipantOption,
        openToMoreLevel: activity.openToMoreLevel,
        openToPublic: activity.openToPublic,
        instructorId: activity.instructorId,
      },
    });

    return ActivityMapper.toDomain(createdActivity);
  }

  async findActivityById(id: string): Promise<ActivityEntity | null> {
    const activity = await this.prisma.activity.findFirst({
      where: { id },
      include: {
        participants: true,
        instructor: true,
      },
    });

    return activity
      ? ActivityMapper.toDomain({
          ...activity,
          instructor: activity.instructor ?? undefined,
        })
      : null;
  }

  async findActivityByIdWithAllData(
    id: string,
  ): Promise<ActivityEntity | null> {
    const activity = await this.prisma.activity.findFirst({
      where: { id },
      include: {
        participants: {
          include: {
            rider: true,
          },
        },
        instructor: true,
      },
    });
    return activity
      ? ActivityMapper.toDomain({
          ...activity,
          instructor: activity.instructor ?? undefined,
        })
      : null;
  }

  async findActivitiesByStableIdAndDay(stableId: string, day: string) {
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);
    console.log(day);
    console.log(typeof day);
    const activities = await this.prisma.activity.findMany({
      where: {
        stableId,
        date: { gte: new Date(startOfDay), lte: new Date(endOfDay) },
      },
      include: {
        instructor: true,
      },
    });

    return activities.map((activity) =>
      ActivityMapper.toDomain({
        ...activity,
        instructor: activity.instructor ?? undefined,
      }),
    );
  }

  async findActivitiesByStableIdBetweenDates(
    stableId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityEntity[]> {
    console.log(startDate, endDate);
    const activities = await this.prisma.activity.findMany({
      where: {
        stableId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        instructor: true,
      },
    });
    return activities.map((activity) =>
      ActivityMapper.toDomain({
        ...activity,
        instructor: activity.instructor ?? undefined,
      }),
    );
  }

  async findActivitiesByInstructorIdBetweenDates(
    instructorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityEntity[]> {
    const activities = await this.prisma.activity.findMany({
      where: { instructorId, date: { gte: startDate, lte: endDate } },
      include: {
        stable: true,
      },
    });
    return activities.map((activity) =>
      ActivityMapper.toDomain({
        ...activity,
        stable: activity.stable ?? undefined,
      }),
    );
  }

  async findActivitiesByStableIdBetweenDatesWithFilters(
    stableId: string,
    startDate: Date,
    endDate: Date,
    filters: { search?: string; requiredLevel?: RiderLevel },
  ): Promise<ActivityEntity[]> {
    let allowedLevels: RiderLevel[] | undefined = undefined;

    if (filters.requiredLevel && filters.requiredLevel !== RiderLevel.ALL) {
      // const orderedLevels = riderLevelOrder.filter(
      // (lvl) => lvl !== RiderLevel.ALL,
      // );
      // const index = orderedLevels.indexOf(filters.requiredLevel);
      // if (index >= 0) {
      allowedLevels = [filters.requiredLevel];
      // }
    }

    const search = filters.search?.toLowerCase();

    const activities = await this.prisma.activity.findMany({
      where: {
        stableId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(allowedLevels && {
          requiredLevel: {
            in: allowedLevels,
          },
        }),
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
      include: {
        participants: true,
        instructor: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return activities.map((activity) =>
      ActivityMapper.toDomain({
        ...activity,
        instructor: activity.instructor ?? undefined,
      }),
    );
  }
}
