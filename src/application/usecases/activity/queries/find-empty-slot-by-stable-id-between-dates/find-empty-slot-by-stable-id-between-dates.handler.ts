import { Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/domain/entities/activity.entity';
import { IActivityRepository } from 'src/domain/interfaces/activity.repository';
import { FindEmptySlotByStableIdBetweenDatesQuery } from './find-empty-slot-by-stable-id-between-dates.query';

@Injectable()
export class FindEmptySlotByStableIdBetweenDatesHandler {
  private SLOT_DURATION_MINUTES = 60; // 1h
  private DAY_START_HOUR = 8;
  private DAY_END_HOUR = 20;

  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(
    query: FindEmptySlotByStableIdBetweenDatesQuery,
  ): Promise<{ start: Date; end: Date }[]> {
    const { stableId, date, period } = query;
    const _date = new Date(date);
    let startDate: Date = _date;
    let endDate: Date = _date;

    if (period === 'day') {
      startDate = new Date(_date.setHours(0, 0, 0, 0));
      endDate = new Date(_date.setHours(23, 59, 59, 999));
    } else if (period === 'week') {
      const day = _date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      startDate = new Date(_date);
      startDate.setDate(_date.getDate() + diffToMonday);
      startDate.setHours(0, 1, 0, 0); // lundi 00h01
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999); // dimanche 23h59
    } else if (period === 'month') {
      startDate = new Date(
        _date.getFullYear(),
        _date.getMonth(),
        1,
        0,
        1,
        0,
        0,
      ); // 1er du mois à 00h01
      endDate = new Date(
        _date.getFullYear(),
        _date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ); // dernier jour du mois à 23h59
    }

    const activities =
      await this.activityRepository.findActivitiesByStableIdBetweenDates(
        stableId,
        startDate,
        endDate,
      );

    const timeSlots: { start: Date; end: Date }[] = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const currentDay = new Date(d); // clone du jour

      const dayStart = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate(),
        this.DAY_START_HOUR,
        0,
        0,
        0,
      );

      const dayEnd = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate(),
        this.DAY_END_HOUR,
        0,
        0,
        0,
      );

      const dailySlots = this.generateSlots(dayStart, dayEnd);

      for (const slot of dailySlots) {
        if (this.isSlotAvailable(slot.start, slot.end, activities)) {
          timeSlots.push(slot);
        }
      }
    }

    return timeSlots;
  }

  private generateSlots(
    startDate: Date,
    endDate: Date,
  ): { start: Date; end: Date }[] {
    const slots: { start: Date; end: Date }[] = [];

    let current = new Date(startDate);
    while (current < endDate) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current);
      slotEnd.setMinutes(slotEnd.getMinutes() + this.SLOT_DURATION_MINUTES);
      const hour = slotStart.getHours();

      // Exclure les créneaux de 12h à 14h
      if (hour < 12 || hour >= 14) {
        if (slotEnd <= endDate) {
          slots.push({ start: slotStart, end: slotEnd });
        }
      }

      current = slotEnd;
    }
    return slots;
  }

  private isSlotAvailable(
    slotStart: Date,
    slotEnd: Date,
    activities: ActivityEntity[],
  ): boolean {
    return !activities.some((activity) => {
      return slotStart < activity.endDate && slotEnd > activity.startDate;
    });
  }
}
