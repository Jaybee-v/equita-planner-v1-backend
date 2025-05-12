import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { Status } from 'src/domain/enums/status.enum';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IAffiliationRequestRepository } from 'src/domain/interfaces/affiliation-request.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { GetStableStatsQuery } from './get-stats.query';

@Injectable()
export class GetStableStatsHandler {
  constructor(
    @Inject('IAffiliationRequestRepository')
    private readonly affiliationRequestRepository: IAffiliationRequestRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(
    query: GetStableStatsQuery,
  ): Promise<{ affiliatedRiderCount: number; activities: ActivityEntity[] }> {
    const stable = await this.stableRepository.findById(query.stableId);

    if (!stable) {
      throw new BadRequestException('Aucune écurie trouvée');
    }

    if (stable.userId !== query.requestedBy) {
      throw new BadRequestException(
        "Vous n'avez pas les droits pour voir les stats de cette écurie",
      );
    }

    const _affiliatedRiders =
      await this.affiliationRequestRepository.findByStableId({
        stableId: query.stableId,
        status: Status.APPROVED,
        page: 1,
        limit: 100,
      });
    console.log(_affiliatedRiders);
    const affiliatiedRiderCount: number = _affiliatedRiders.length;

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (query.period === 'week') {
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const diffToMonday = (day === 0 ? -6 : 1) - day;

      startDate = new Date(now);
      startDate.setDate(now.getDate() + diffToMonday);
      startDate.setHours(0, 1, 0, 0); // lundi 00h01

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999); // dimanche 23h59
    } else if (query.period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 1, 0, 0); // 1er du mois à 00h01
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ); // dernier jour du mois à 23h59
    } else if (query.period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1, 0, 1, 0, 0); // 1er janvier à 00h01
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // 31 décembre à 23h59
    } else {
      throw new Error('Période invalide');
    }

    const _activities =
      await this.activityRepository.findActivitiesByStableIdBetweenDates(
        stable.id,
        startDate,
        endDate,
      );

    return {
      affiliatedRiderCount: affiliatiedRiderCount,
      activities: _activities,
    };
  }
}
