import { Inject, Injectable } from '@nestjs/common';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { FindThreeDaysActivitiesByStableIdCommand } from './find-three-days-by-stable-id.query';

@Injectable()
export class FindThreeDaysActivitiesByStableIdHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(command: FindThreeDaysActivitiesByStableIdCommand) {
    const { stableId, requestedBy, date } = command;

    const _date = new Date(date);
    const startDate = new Date(_date.setDate(_date.getDate() - 1));
    const endDate = new Date(_date.setDate(_date.getDate() + 1));

    const activities =
      await this.activityRepository.findActivitiesByStableIdBetweenDates(
        stableId,
        startDate,
        endDate,
      );

    return activities;
  }
}
