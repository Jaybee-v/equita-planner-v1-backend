import { UserRole } from 'src/domain/enums/user-role.enum';

export class FindActivityByIdQuery {
  constructor(
    public readonly id: string,
    public readonly requestedBy: string,
    public readonly role: UserRole,
  ) {}
}
