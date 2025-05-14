export class ResetPasswordCommand {
  constructor(
    public readonly password: string,
    public readonly requestedBy: string,
  ) {}
}
