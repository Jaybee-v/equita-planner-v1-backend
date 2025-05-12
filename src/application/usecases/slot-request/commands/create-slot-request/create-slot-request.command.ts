export class CreateSlotRequestCommand {
  constructor(
    public readonly stableId: string,
    public readonly riderId: string,
    public readonly message: string,
    public readonly requestedBy: string,
    public readonly preferredStartDate: Date,
    public readonly preferredEndDate: Date,
  ) {}
}
