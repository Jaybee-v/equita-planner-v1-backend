import { Status } from '../enums/status.enum';
import { ActivityEntity } from './activity.entity';
import { RiderEntity } from './rider.entity';

export class ActivityParticipantEntity {
  private _id: string;
  private _activityId: string;
  private _riderId: string;
  private _status: Status;
  private _createdAt: Date;

  private _rider?: RiderEntity;

  private _activity?: ActivityEntity;
  constructor(
    id: string,
    activityId: string,
    riderId: string,
    status: Status,
    createdAt: Date,
    rider?: RiderEntity,
    activity?: ActivityEntity,
  ) {
    this._id = id;
    this._activityId = activityId;
    this._riderId = riderId;
    this._status = status;
    this._rider = rider;
    this._createdAt = createdAt;
    this._rider = rider;
    this._activity = activity;
  }

  get id(): string {
    return this._id;
  }

  get activityId(): string {
    return this._activityId;
  }

  get riderId(): string {
    return this._riderId;
  }

  get status(): Status {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get rider(): RiderEntity | undefined {
    return this._rider;
  }

  get activity(): ActivityEntity | undefined {
    return this._activity;
  }

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      activityId: this._activityId,
      riderId: this._riderId,
      status: this._status,
      createdAt: this._createdAt,
      rider: this._rider?.toJSON(),
      activity: this._activity?.toJson(),
    };
  }

  public static create(data: {
    activityId: string;
    riderId: string;
    status: Status;
    createdAt: Date;
  }): ActivityParticipantEntity {
    return new ActivityParticipantEntity(
      '',
      data.activityId,
      data.riderId,
      data.status,
      data.createdAt,
    );
  }
}
