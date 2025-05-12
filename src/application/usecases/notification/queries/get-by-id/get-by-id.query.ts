import { UserRole } from 'src/domain/enums/user-role.enum';

export class GetNotificationByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
