import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { FindActivityByIdQuery } from './find-by-id.query';

@Injectable()
export class FindActivityByIdHandler {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(
    query: FindActivityByIdQuery,
  ): Promise<Record<string, ActivityEntity>> {
    const activity = await this.activityRepository.findActivityById(query.id);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    if (query.role === UserRole.STABLE) {
      const stable = await this.stableRepository.findByUserId(
        query.requestedBy,
      );
      if (!stable) {
        throw new NotFoundException('Stable not found');
      }
      if (stable.id === activity.stableId) {
        const activityWithAllData =
          await this.activityRepository.findActivityByIdWithAllData(query.id);
        console.log('activityWithAllData', activityWithAllData);
        if (!activityWithAllData) {
          throw new NotFoundException('Activity not found');
        }
        return activityWithAllData.toJson();
      }
    }

    return activity.toJson();
  }
}
