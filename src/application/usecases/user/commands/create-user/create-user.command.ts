import { UserRole } from 'src/domain/enums/user-role.enum';

export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly isIndependentInstructor: boolean,
  ) {}
}
