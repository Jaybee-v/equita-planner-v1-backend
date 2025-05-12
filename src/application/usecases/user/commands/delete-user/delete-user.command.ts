export class DeleteUserCommand {
  constructor(
    public readonly userId: string,
    public readonly handledBy: string,
    public readonly password: string,
  ) {}
}
