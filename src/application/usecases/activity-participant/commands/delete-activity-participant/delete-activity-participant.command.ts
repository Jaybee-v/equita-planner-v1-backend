export class DeleteActivityParticipantCommand {
  constructor(
    public readonly id: string,
    public readonly requestedBy: string,
  ) {}
}
