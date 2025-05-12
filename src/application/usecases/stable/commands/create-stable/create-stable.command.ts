export class CreateStableCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly street: string,
    public readonly numStreet: number,
    public readonly zip: string,
    public readonly city: string,
    public readonly country: string,
    public readonly phone: string,
    public readonly website: string,
  ) {}
}
