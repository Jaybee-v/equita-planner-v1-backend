import { Status } from '../enums/status.enum';
import { RiderEntity } from './rider.entity';
import { StableEntity } from './stable.entity';

export class AffiliationRequestEntity {
  private _id: string;
  private _riderId: string;
  private _stableId: string;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _stable?: StableEntity;
  private _rider?: RiderEntity;
  constructor(
    id: string,
    riderId: string,
    stableId: string,
    status: Status = Status.PENDING,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    stable?: StableEntity,
    rider?: RiderEntity,
  ) {
    this._id = id;
    this._riderId = riderId;
    this._stableId = stableId;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._stable = stable;
    this._rider = rider;
  }

  get id(): string {
    return this._id;
  }

  get riderId(): string {
    return this._riderId;
  }

  get stableId(): string {
    return this._stableId;
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

  get stable(): StableEntity | undefined {
    return this._stable;
  }

  get rider(): RiderEntity | undefined {
    return this._rider;
  }

  set status(status: Status) {
    this._status = status;
    this._updatedAt = new Date();
  }

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      riderId: this._riderId,
      stableId: this._stableId,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      stable: this._stable?.toJSON(),
      rider: this._rider?.toJSON(),
    };
  }

  public static create(
    riderId: string,
    stableId: string,
  ): AffiliationRequestEntity {
    return new AffiliationRequestEntity('', riderId, stableId);
  }
}
