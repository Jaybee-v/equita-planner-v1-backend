import { CreateInstructorCommand } from 'src/application/usecases/instructor/commands/create-instructor/create-instructor.command';
import { CreateUserCommand } from 'src/application/usecases/user/commands/create-user/create-user.command';

export class CreateStableInstructorCommand {
  constructor(
    public readonly instructor: CreateInstructorCommand,
    public readonly user: CreateUserCommand,
    public readonly requestedBy: string,
  ) {}
}
