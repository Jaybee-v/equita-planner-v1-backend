import { Status } from 'src/domain/enums/status.enum';

export class UpdateStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: Status,
    public readonly userId: string,
  ) {}
}
