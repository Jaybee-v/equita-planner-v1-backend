export class FindActivityParticipantsByRiderIdQuery {
  constructor(
    public readonly riderId: string,
    public readonly requestedBy: string,
  ) {}
}
