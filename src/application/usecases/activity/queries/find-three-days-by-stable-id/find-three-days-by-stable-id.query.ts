export class FindThreeDaysActivitiesByStableIdCommand {
  constructor(
    public readonly stableId: string,
    public readonly requestedBy: string,
    public readonly date: Date,
  ) {}
}
