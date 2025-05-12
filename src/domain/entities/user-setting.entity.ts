export class UserSettingEntity {
  private _id: string;
  private _userId: string;
  private _allStableNotifications: boolean;
  private _emailNotifications: boolean;
  private _pushNotifications: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    allStableNotifications: boolean = true,
    emailNotifications: boolean = true,
    pushNotifications: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._userId = userId;
    this._allStableNotifications = allStableNotifications;
    this._emailNotifications = emailNotifications;
    this._pushNotifications = pushNotifications;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get allStableNotifications(): boolean {
    return this._allStableNotifications;
  }

  get emailNotifications(): boolean {
    return this._emailNotifications;
  }

  get pushNotifications(): boolean {
    return this._pushNotifications;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      allStableNotifications: this._allStableNotifications,
      emailNotifications: this._emailNotifications,
      pushNotifications: this._pushNotifications,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public static create(data: {
    userId: string;
    allStableNotifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  }): UserSettingEntity {
    return new UserSettingEntity('', data.userId);
  }
}
