import { Status } from '../enums/status.enum';
import { RiderEntity } from './rider.entity';
import { StableEntity } from './stable.entity';
export class SlotRequestEntity {
  private _id: string;
  private _stableId: string;
  private _riderId: string;
  private _message: string;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _preferredStartDate: Date;
  private _preferredEndDate: Date;

  private _rider?: RiderEntity;
  private _stable?: StableEntity;

  constructor(
    id: string,
    stableId: string,
    riderId: string,
    message: string,
    status: Status,
    createdAt: Date,
    updatedAt: Date,
    preferredStartDate: Date,
    preferredEndDate: Date,
    rider?: RiderEntity,
    stable?: StableEntity,
  ) {
    this._id = id;
    this._stableId = stableId;
    this._riderId = riderId;
    this._message = message;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._preferredStartDate = preferredStartDate;
    this._preferredEndDate = preferredEndDate;
    this._rider = rider;
    this._stable = stable;
  }

  get id(): string {
    return this._id;
  }

  get stableId(): string {
    return this._stableId;
  }

  get riderId(): string {
    return this._riderId;
  }

  get message(): string {
    return this._message;
  }

  get status(): Status {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get preferredStartDate(): Date {
    return this._preferredStartDate;
  }

  get preferredEndDate(): Date {
    return this._preferredEndDate;
  }

  get rider(): RiderEntity | undefined {
    return this._rider;
  }

  get stable(): StableEntity | undefined {
    return this._stable;
  }

  set status(status: Status) {
    this._updatedAt = new Date();
    this._status = status;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      stableId: this._stableId,
      riderId: this._riderId,
      message: this._message,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      preferredStartDate: this._preferredStartDate,
      preferredEndDate: this._preferredEndDate,
      rider: this._rider?.toJSON(),
      stable: this._stable?.toJSON(),
    };
  }

  static create(slotRequest: {
    stableId: string;
    riderId: string;
    message: string;
    preferredStartDate: Date;
    preferredEndDate: Date;
  }): SlotRequestEntity {
    return new SlotRequestEntity(
      '',
      slotRequest.stableId,
      slotRequest.riderId,
      slotRequest.message,
      Status.PENDING,
      new Date(),
      new Date(),
      slotRequest.preferredStartDate,
      slotRequest.preferredEndDate,
    );
  }
}
