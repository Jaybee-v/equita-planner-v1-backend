import { Gender } from 'src/domain/enums/gender.enum';

export class CreateInstructorCommand {
  constructor(
    public readonly userId: string,
    public readonly isIndependent: boolean,
    public readonly name: string,
    public readonly familyName: string,
    public readonly gender: Gender,
    public readonly phone: string,
    public readonly stableId: string | null,
    public readonly color: string | null,
  ) {}
}
