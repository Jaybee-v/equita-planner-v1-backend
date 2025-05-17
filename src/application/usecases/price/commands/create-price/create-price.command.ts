export class CreatePriceCommand {
  constructor(
    public readonly stableId: string,
    public readonly label: string,
    public readonly description: string,
    public readonly price: number,
    public readonly requestedBy: string,
  ) {}
}
