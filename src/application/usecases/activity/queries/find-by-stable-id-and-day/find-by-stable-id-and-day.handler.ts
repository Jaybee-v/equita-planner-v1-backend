import { Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { FindByStableIdAndDayQuery } from './find-by-stable-id-and-day.query';

@Injectable()
export class FindActivitiesByStableIdAndDayHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(
    query: FindByStableIdAndDayQuery,
  ): Promise<Record<string, ActivityEntity>[]> {
    const activities =
      await this.activityRepository.findActivitiesByStableIdAndDay(
        query.stableId,
        query.day,
      );
    console.log(activities);
    return activities.map((activity) => activity.toJson());
  }
}
