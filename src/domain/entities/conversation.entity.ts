import { RiderEntity } from './rider.entity';
import { StableEntity } from './stable.entity';

export class ConversationEntity {
  private _id: string;
  private _stableId: string;
  private _riderId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private _stable?: StableEntity;
  private _rider?: RiderEntity;

  constructor(
    id: string,
    stableId: string,
    riderId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    stable?: StableEntity,
    rider?: RiderEntity,
  ) {
    this._id = id;
    this._stableId = stableId;
    this._riderId = riderId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._stable = stable;
    this._rider = rider;
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

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      stableId: this._stableId,
      riderId: this._riderId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      stable: this._stable?.toJSON(),
      rider: this._rider?.toJSON(),
    };
  }

  public static create(data: {
    stableId: string;
    riderId: string;
  }): ConversationEntity {
    return new ConversationEntity('', data.stableId, data.riderId);
  }
}
