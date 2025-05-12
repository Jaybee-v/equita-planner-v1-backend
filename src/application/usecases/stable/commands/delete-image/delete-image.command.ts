export class DeleteImageCommand {
  constructor(
    public readonly stableId: string,
    public readonly imageUrl: string,
    public readonly userId: string,
  ) {}
}
