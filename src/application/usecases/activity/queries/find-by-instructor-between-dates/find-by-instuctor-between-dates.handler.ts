import { Inject, Injectable } from '@nestjs/common';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { FindActivitiesByInstructorIdBetweenDatesQuery } from './find-by-instuctor-between-dates.query';

@Injectable()
export class FindActivitiesByInstructorIdBetweenDatesHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(query: FindActivitiesByInstructorIdBetweenDatesQuery) {
    const startOfWeek = new Date(query.date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 1, 0);
    // end of week is saturday at 23:59:59
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 0);
    const activities =
      await this.activityRepository.findActivitiesByInstructorIdBetweenDates(
        query.instructorId,
        startOfWeek,
        endOfWeek,
      );
    return activities.map((activity) => activity.toJson());
  }
}
