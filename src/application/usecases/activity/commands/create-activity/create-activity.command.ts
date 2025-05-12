import { ActivityType } from 'src/domain/enums/activity-type.enum';
import { ActivityVisibility } from 'src/domain/enums/activity-visibility.enum';
import { CreatedByOption } from 'src/domain/enums/created-by-option.enum';
import { RiderLevel } from 'src/domain/enums/rider-level.enum';
import { ValidationOption } from 'src/domain/enums/validation-option.enum';

export class CreateActivityCommand {
  constructor(
    public readonly stableId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly type: ActivityType,
    public readonly visibility: ActivityVisibility,
    public readonly requiredLevel: RiderLevel,
    public readonly maxParticipants: number,
    public readonly createdBy: CreatedByOption,
    public readonly createdFromRequestId: string,
    public readonly validationParticipantOption: ValidationOption,
    public readonly openToMoreLevel: boolean,
    public readonly instructorId: string | null,
  ) {}
}
