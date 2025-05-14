import { RiderLevel } from 'src/domain/enums/rider-level.enum';

export class UpdateRiderLevelCommand {
  constructor(
    public readonly riderId: string,
    public readonly level: RiderLevel,
    public readonly requestedBy: string,
  ) {}
}
