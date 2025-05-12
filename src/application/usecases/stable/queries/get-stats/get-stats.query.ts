export class GetStableStatsQuery {
  constructor(
    public readonly period: 'week' | 'month' | 'year',
    public readonly stableId: string,
    public readonly requestedBy: string,
  ) {}
}
