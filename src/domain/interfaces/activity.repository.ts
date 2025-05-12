import { ActivityEntity } from '../entities/activity.entity';
import { RiderLevel } from '../enums/rider-level.enum';

export interface IActivityRepository {
  create(activity: ActivityEntity): Promise<ActivityEntity>;
  findActivityById(id: string): Promise<ActivityEntity | null>;
  findActivityByIdWithAllData(id: string): Promise<ActivityEntity | null>;
  findActivitiesByStableIdAndDay(
    stableId: string,
    day: string,
  ): Promise<ActivityEntity[]>;
  findActivitiesByStableIdBetweenDates(
    stableId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityEntity[]>;
  findActivitiesByInstructorIdBetweenDates(
    instructorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityEntity[]>;
  findActivitiesByStableIdBetweenDatesWithFilters(
    stableId: string,
    startDate: Date,
    endDate: Date,
    filters: {
      search: string;
      requiredLevel: RiderLevel;
    },
  ): Promise<ActivityEntity[]>;
}
