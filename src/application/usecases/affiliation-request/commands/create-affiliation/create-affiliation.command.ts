export class CreateAffiliationCommand {
  constructor(
    public readonly riderId: string,
    public readonly stableId: string,
    public readonly creatorId: string,
  ) {}
}
