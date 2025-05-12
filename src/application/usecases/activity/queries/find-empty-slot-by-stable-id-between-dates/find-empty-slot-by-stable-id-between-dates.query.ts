export class FindEmptySlotByStableIdBetweenDatesQuery {
  constructor(
    public readonly stableId: string,
    public readonly date: Date,
    public readonly period: 'day' | 'week' | 'month',
  ) {}
}
