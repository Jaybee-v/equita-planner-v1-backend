import { UserRole } from 'src/domain/enums/user-role.enum';

export class UpdateNotificationStatusToReadCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
