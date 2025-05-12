export class UpdatePasswordQuery {
  constructor(
    public readonly password: string,
    public readonly userId: string,
    public readonly handledBy: string,
  ) {}
}
