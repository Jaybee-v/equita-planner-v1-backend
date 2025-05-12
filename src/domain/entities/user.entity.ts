import { UserRole } from '../enums/user-role.enum';
import { NotificationEntity } from './notifications.entity';
import { RiderEntity } from './rider.entity';
import { UserSettingEntity } from './user-setting.entity';

export class UserEntity {
  private _id: string;
  private _email: string;
  private _password: string;
  private _role: UserRole;
  private _isVerified: boolean;
  private _lastSeen: Date | null;
  private _isIndependentInstructor: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _mustChangePassword: boolean;

  private _notifications: NotificationEntity[];
  private _rider?: RiderEntity;
  private _invitedBy?: string;
  private _userSetting?: UserSettingEntity;

  constructor(
    id: string,
    email: string,
    password: string,
    role: UserRole,
    isVerified: boolean = false,
    lastSeen: Date | null = null,
    isIndependentInstructor: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    mustChangePassword: boolean = false,
    notifications: NotificationEntity[] = [],
    rider?: RiderEntity,
    invitedBy?: string,
    userSetting?: UserSettingEntity,
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._role = role;
    this._isVerified = isVerified;
    this._lastSeen = lastSeen;
    this._isIndependentInstructor = isIndependentInstructor;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._mustChangePassword = mustChangePassword;
    this._notifications = notifications;
    this._rider = rider;
    this._invitedBy = invitedBy;
    this._userSetting = userSetting;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  get lastSeen(): Date | null {
    return this._lastSeen;
  }

  get isIndependentInstructor(): boolean {
    return this._isIndependentInstructor;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get mustChangePassword(): boolean {
    return this._mustChangePassword;
  }

  get notifications(): NotificationEntity[] {
    return this._notifications;
  }

  get rider(): RiderEntity | undefined {
    return this._rider;
  }

  get invitedBy(): string | undefined {
    return this._invitedBy;
  }

  get userSetting(): UserSettingEntity | undefined {
    return this._userSetting;
  }

  // Setters
  set email(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    this._email = email;
    this._updatedAt = new Date();
  }

  set password(password: string) {
    if (!this.isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long');
    }
    this._password = password;
    this._updatedAt = new Date();
  }

  set mustChangePassword(mustChangePassword: boolean) {
    this._mustChangePassword = mustChangePassword;
    this._updatedAt = new Date();
  }

  // Methods
  public updateLastSeen(): void {
    this._lastSeen = new Date();
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      email: this._email,
      lastSeen: this._lastSeen,
      role: this._role,
      isVerified: this._isVerified,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      mustChangePassword: this._mustChangePassword,
      notifications: this._notifications.map((notification) =>
        notification.toJson(),
      ),
      rider: this._rider?.toJSON(),
      invitedBy: this._invitedBy,
      userSetting: this._userSetting?.toJson(),
      isIndependentInstructor: this._isIndependentInstructor,
    };
  }

  // Validation methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  // Static factory method
  public static create(data: {
    email: string;
    password: string;
    role: UserRole;
    isIndependentInstructor: boolean;
    invitedBy?: string;
    mustChangePassword?: boolean;
  }): UserEntity {
    return new UserEntity(
      '',
      data.email,
      data.password,
      data.role,
      false,
      null,
      data.isIndependentInstructor,
      new Date(),
      new Date(),
      data.mustChangePassword ?? false,
      [],
      undefined,
      data.invitedBy,
      undefined,
    );
  }
}
