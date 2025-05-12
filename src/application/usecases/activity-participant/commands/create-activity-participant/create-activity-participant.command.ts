export class CreateActivityParticipantCommand {
  constructor(
    public readonly activityId: string,
    public readonly riderId: string,
    public readonly requestedBy: string,
  ) {}
}
