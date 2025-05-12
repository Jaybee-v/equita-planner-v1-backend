import { UserRole } from 'src/domain/enums/user-role.enum';

export class UpdateUserRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly requestedBy: string,
  ) {}
}
