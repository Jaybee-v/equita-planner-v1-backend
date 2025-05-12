import { UserRole } from 'src/domain/enums/user-role.enum';

export class FindByStableIdAndWeekQuery {
  constructor(
    public readonly stableId: string,
    public readonly date: Date,
    public readonly requestedBy: string,
    public readonly role: UserRole,
  ) {}
}
