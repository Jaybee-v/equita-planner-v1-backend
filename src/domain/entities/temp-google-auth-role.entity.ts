import { UserRole } from '../enums/user-role.enum';

export class TempGoogleAuthRoleEntity {
  private _id: number;
  private _role: UserRole;
  private _isApplied: boolean;
  private _createdAt: Date;

  constructor(id: number, role: UserRole, isApplied: boolean, createdAt: Date) {
    this._id = id;
    this._role = role;
    this._isApplied = isApplied;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get role(): UserRole {
    return this._role;
  }

  get isApplied(): boolean {
    return this._isApplied;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public static toJSON(entity: TempGoogleAuthRoleEntity): Record<string, any> {
    return {
      id: entity.id,
      role: entity.role,
      isApplied: entity.isApplied,
      createdAt: entity.createdAt,
    };
  }

  static create(role: UserRole): TempGoogleAuthRoleEntity {
    return new TempGoogleAuthRoleEntity(0, role, false, new Date());
  }
}
