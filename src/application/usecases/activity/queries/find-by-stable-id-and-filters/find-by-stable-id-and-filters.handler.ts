import { Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { FindByStableIdAndFiltersQuery } from './find-by-stable-id-and-filters.query';

@Injectable()
export class FindByStableIdAndFiltersHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
  ) {}

  async execute(
    query: FindByStableIdAndFiltersQuery,
  ): Promise<Record<string, ActivityEntity>[]> {
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
      const startOfWeek = new Date(query.date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 1, 0);

      // end of week is saturday at 23:59:59
      const endOfWeek = new Date(startOfWeek);
      if (query.date) {
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 0);
        console.log(startOfWeek, endOfWeek);
      }

      const activities =
        await this.activityRepository.findActivitiesByStableIdBetweenDatesWithFilters(
          query.stableId,
          startOfWeek,
          endOfWeek,
          {
            search: query.search || '',
            requiredLevel: query.requiredLevel || RiderLevel.ALL,
          },
        );
      return activities.map((activity) => activity.toJson());
    }
    return [];
  }
}
