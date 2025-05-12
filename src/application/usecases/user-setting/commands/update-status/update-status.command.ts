export class UpdateStatusCommand {
  constructor(
    public readonly id: string,
    public readonly type: 'allstableNotifications' | 'emailNotifications',
    public readonly requestedBy: string,
  ) {}
}
