import { Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { FindByStableIdAndWeekQuery } from './find-by-stable-id-and-week.query';
@Injectable()
export class FindByStableIdAndWeekHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
  ) {}

  async execute(
    query: FindByStableIdAndWeekQuery,
  ): Promise<Record<string, ActivityEntity>[]> {
    const startOfWeek = new Date(query.date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 1, 0);
    // end of week is saturday at 23:59:59
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 0);
    console.log(startOfWeek, endOfWeek);
    if (query.role === UserRole.RIDER) {
      const rider = await this.riderRepository.findByUserId(query.requestedBy);
      if (!rider) {
        throw new Error('Rider not found');
      }
      const affiliationRequest =
        await this.affiliationRequestRepository.findByDifferentsUser({
          stableId: query.stableId,
          riderId: rider.id,
        });
      if (!affiliationRequest) {
        throw new Error("Vous n'êtes pas membre de ce club");
      }
    }

    const activities =
      await this.activityRepository.findActivitiesByStableIdBetweenDates(
        query.stableId,
        startOfWeek,
        endOfWeek,
      );

    return activities.map((activity) => activity.toJson());
  }
}
