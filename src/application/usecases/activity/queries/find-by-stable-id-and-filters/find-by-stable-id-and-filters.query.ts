import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';

export class FindByStableIdAndFiltersQuery {
  constructor(
    public readonly stableId: string,
    public readonly date: Date,
    public readonly requestedBy: string,
    public readonly role: UserRole,
    public readonly search?: string,
    public readonly requiredLevel?: RiderLevel,
  ) {}
}
