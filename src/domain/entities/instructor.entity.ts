import { Gender } from '../enums/gender.enum';
import { StableEntity } from './stable.entity';

export class InstructorEntity {
  private _id: string;
  private _userId: string;
  private _isIndependent: boolean;
  private _name: string;
  private _familyName: string;
  private _gender: Gender;
  private _phone: string;
  private _stableId: string | null;
  private _color: string | null;

  private _createdAt: Date;
  private _updatedAt: Date;

  private _stable?: StableEntity;

  constructor(
    id: string,
    userId: string,
    isIndependent: boolean,
    name: string,
    familyName: string,
    gender: Gender,
    phone: string,
    stableId: string | null,
    color: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    stable?: StableEntity,
  ) {
    this._id = id;
    this._userId = userId;
    this._isIndependent = isIndependent;
    this._name = name;
    this._familyName = familyName;
    this._gender = gender;
    this._phone = phone;
    this._stableId = stableId;
    this._color = color;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._stable = stable;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get isIndependent(): boolean {
    return this._isIndependent;
  }

  get name(): string {
    return this._name;
  }

  get familyName(): string {
    return this._familyName;
  }

  get gender(): Gender {
    return this._gender;
  }

  get phone(): string {
    return this._phone;
  }

  get stableId(): string | null {
    return this._stableId;
  }

  get color(): string | null {
    return this._color;
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

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      isIndependent: this._isIndependent,
      name: this._name,
      familyName: this._familyName,
      gender: this._gender,
      phone: this._phone,
      stableId: this._stableId,
      color: this._color,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      stable: this._stable?.toJSON(),
    };
  }

  public static create(data: {
    userId: string;
    isIndependent: boolean;
    name: string;
    familyName: string;
    gender: Gender;
    phone: string;
    stableId: string | null;
    color: string | null;
  }): InstructorEntity {
    return new InstructorEntity(
      '',
      data.userId,
      data.isIndependent,
      data.name,
      data.familyName,
      data.gender,
      data.phone,
      data.stableId,
      data.color,
    );
  }
}
