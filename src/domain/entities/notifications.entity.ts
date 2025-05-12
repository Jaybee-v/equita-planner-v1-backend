import { NotificationSender } from '../enums/notification-sender.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type';
import { UserEntity } from './user.entity';

export class NotificationEntity {
  private _id: string;
  private _userId: string;
  private _title: string;
  private _message: string;
  private _status: NotificationStatus;
  private _type: NotificationType;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _watchedAt?: Date;
  private _sendBy: NotificationSender;
  private _senderId?: string;
  private _user?: UserEntity;
  constructor(
    id: string,
    userId: string,
    title: string,
    message: string,
    status: NotificationStatus,
    type: NotificationType,
    createdAt: Date,
    updatedAt: Date,
    sendBy: NotificationSender,
    watchedAt?: Date,
    senderId?: string,
    user?: UserEntity,
  ) {
    this._id = id;
    this._userId = userId;
    this._title = title;
    this._message = message;
    this._status = status;
    this._type = type;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._watchedAt = watchedAt;
    this._user = user;
    this._sendBy = sendBy;
    this._senderId = senderId;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get status(): NotificationStatus {
    return this._status;
  }

  get type(): NotificationType {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get watchedAt(): Date | undefined {
    return this._watchedAt;
  }

  get user(): UserEntity | undefined {
    return this._user;
  }

  get sendBy(): NotificationSender {
    return this._sendBy;
  }

  get senderId(): string | undefined {
    return this._senderId;
  }

  set watchedAt(watchedAt: Date | undefined) {
    this._watchedAt = watchedAt;
    this._updatedAt = new Date();
  }

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title,
      message: this._message,
      status: this._status,
      type: this._type,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      watchedAt: this._watchedAt,
      user: this._user?.toJSON(),
      sendBy: this._sendBy,
      senderId: this._senderId,
    };
  }

  public static create(data: {
    userId: string;
    title: string;
    message: string;
    status: NotificationStatus;
    type: NotificationType;
    sendBy: NotificationSender;
    senderId?: string;
  }): NotificationEntity {
    return new NotificationEntity(
      '',
      data.userId,
      data.title,
      data.message,
      data.status,
      data.type,
      new Date(),
      new Date(),
      data.sendBy,
      undefined,
      data.senderId,
    );
  }
}
