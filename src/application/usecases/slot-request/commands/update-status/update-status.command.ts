import { Status } from '@prisma/client';

export class UpdateStatusCommand {
  constructor(
    public readonly slotRequestId: string,
    public readonly status: Status,
    public requestedBy: string,
  ) {}
}
