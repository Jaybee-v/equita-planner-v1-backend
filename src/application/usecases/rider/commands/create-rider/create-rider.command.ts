import { Gender } from 'src/domain/enums/gender.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';

export class CreateRiderCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly familyName: string,
    public readonly level: RiderLevel,
    public readonly gender: Gender,
  ) {}
}
