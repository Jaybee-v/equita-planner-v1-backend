import { ActivityType } from '../enums/activity-type.enum';
import { ActivityVisibility } from '../enums/activity-visibility.enum';
import { CreatedByOption } from '../enums/created-by-option.enum';
import { RiderLevel } from '../enums/rider-level.enum';
import { ValidationOption } from '../enums/validation-option.enum';
import { ActivityParticipantEntity } from './activity-participant.entity';
import { InstructorEntity } from './instructor.entity';
import { StableEntity } from './stable.entity';

export class ActivityEntity {
  private _id: string;
  private _stableId: string;
  private _title: string;
  private _description: string;
  private _date: Date;
  private _startDate: Date;
  private _endDate: Date;
  private _type: ActivityType;
  private _visibility: ActivityVisibility;
  private _requiredLevel: RiderLevel;
  private _maxParticipants: number;
  private _createdBy: CreatedByOption;
  private _createdFromRequestId: string;
  private _validationParticipantOption: ValidationOption;
  private _instructorId: string | null;
  private _openToMoreLevel: boolean;
  private _openToPublic: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _participants?: ActivityParticipantEntity[];
  private _instructor?: InstructorEntity;
  private _stable?: StableEntity;
  constructor(
    id: string,
    stableId: string,
    title: string,
    description: string,
    date: Date,
    startDate: Date,
    endDate: Date,
    type: ActivityType,
    visibility: ActivityVisibility,
    requiredLevel: RiderLevel,
    maxParticipants: number,
    createdBy: CreatedByOption,
    createdFromRequestId: string,
    validationParticipantOption: ValidationOption,
    instructorId: string | null = null,
    openToMoreLevel: boolean,
    openToPublic: boolean = false,
    createdAt: Date,
    updatedAt: Date,
    participants?: ActivityParticipantEntity[],
    instructor?: InstructorEntity,
    stable?: StableEntity,
  ) {
    this._id = id;
    this._stableId = stableId;
    this._title = title;
    this._description = description;
    this._date = date;
    this._startDate = startDate;
    this._endDate = endDate;
    this._type = type;
    this._visibility = visibility;
    this._requiredLevel = requiredLevel;
    this._maxParticipants = maxParticipants;
    this._createdBy = createdBy;
    this._createdFromRequestId = createdFromRequestId;
    this._validationParticipantOption = validationParticipantOption;
    this._instructorId = instructorId;
    this._openToMoreLevel = openToMoreLevel;
    this._openToPublic = openToPublic;
    this._participants = participants;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._instructor = instructor;
    this._stable = stable;
  }

  get id(): string {
    return this._id;
  }

  get stableId(): string {
    return this._stableId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get date(): Date {
    return this._date;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get type(): ActivityType {
    return this._type;
  }

  get visibility(): ActivityVisibility {
    return this._visibility;
  }

  get requiredLevel(): RiderLevel {
    return this._requiredLevel;
  }

  get maxParticipants(): number {
    return this._maxParticipants;
  }

  get createdBy(): CreatedByOption {
    return this._createdBy;
  }

  get createdFromRequestId(): string {
    return this._createdFromRequestId;
  }

  get validationParticipantOption(): ValidationOption {
    return this._validationParticipantOption;
  }

  get instructorId(): string | null {
    return this._instructorId;
  }

  get participants(): ActivityParticipantEntity[] | undefined {
    return this._participants;
  }

  get openToMoreLevel(): boolean {
    return this._openToMoreLevel;
  }

  get openToPublic(): boolean {
    return this._openToPublic;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get instructor(): InstructorEntity | undefined {
    return this._instructor;
  }

  get stable(): StableEntity | undefined {
    return this._stable;
  }

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      stableId: this._stableId,
      title: this._title,
      description: this._description,
      date: this._date,
      startDate: this._startDate,
      endDate: this._endDate,
      type: this._type,
      visibility: this._visibility,
      requiredLevel: this._requiredLevel,
      maxParticipants: this._maxParticipants,
      createdBy: this._createdBy,
      createdFromRequestId: this._createdFromRequestId,
      validationParticipantOption: this._validationParticipantOption,
      instructorId: this._instructorId,
      participants: this._participants?.map((participant) =>
        participant.toJson(),
      ),
      openToMoreLevel: this._openToMoreLevel,
      openToPublic: this._openToPublic,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      instructor: this._instructor?.toJSON(),
      stable: this._stable?.toJSON(),
    };
  }

  public static create(data: {
    stableId: string;
    title: string;
    description: string;
    date: Date;
    startDate: Date;
    endDate: Date;
    type: ActivityType;
    visibility: ActivityVisibility;
    requiredLevel: RiderLevel;
    maxParticipants: number;
    createdBy: CreatedByOption;
    createdFromRequestId: string;
    validationParticipantOption: ValidationOption;
    openToMoreLevel: boolean;
    instructorId: string | null;
  }): ActivityEntity {
    return new ActivityEntity(
      '',
      data.stableId,
      data.title,
      data.description,
      data.date,
      data.startDate,
      data.endDate,
      data.type,
      data.visibility,
      data.requiredLevel,
      data.maxParticipants,
      data.createdBy,
      data.createdFromRequestId,
      data.validationParticipantOption,
      data.instructorId,
      data.openToMoreLevel,
      false,
      new Date(),
      new Date(),
    );
  }
}
