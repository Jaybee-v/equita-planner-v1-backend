export class FindByStableIdAndDayQuery {
  constructor(
    public readonly stableId: string,
    public readonly day: string,
  ) {}
}
