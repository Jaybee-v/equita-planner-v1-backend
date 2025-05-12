import { Gender } from '../enums/gender.enum';
import { RiderLevel } from '../enums/rider-level.enum';
import { AffiliationRequestEntity } from './affiliation-request.entity';
import { UserEntity } from './user.entity';

export class RiderEntity {
  private _id: string;
  private _userId: string;
  private _name: string;
  private _familyName: string;
  private _level: RiderLevel;
  private _gender: Gender;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _imageUrl: string;

  private _affiliationRequests?: AffiliationRequestEntity[];
  private _user?: UserEntity;

  constructor(
    id: string = '',
    userId: string,
    name: string,
    familyName: string,
    level: RiderLevel,
    gender: Gender = Gender.N,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    imageUrl: string,
    affiliationRequests?: AffiliationRequestEntity[],
    user?: UserEntity,
  ) {
    this._id = id;
    this._userId = userId;
    this._name = name;
    this._familyName = familyName;
    this._level = level;
    this._gender = gender;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._imageUrl = imageUrl;
    this._affiliationRequests = affiliationRequests;
    this._user = user;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get familyName(): string {
    return this._familyName;
  }

  get level(): RiderLevel {
    return this._level;
  }

  get gender(): Gender {
    return this._gender;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get affiliationRequests(): AffiliationRequestEntity[] | undefined {
    return this._affiliationRequests;
  }

  get user(): UserEntity | undefined {
    return this._user;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      name: this._name,
      familyName: this._familyName,
      level: this._level,
      gender: this._gender,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      imageUrl: this._imageUrl,
      affiliationRequests: this._affiliationRequests?.map((affiliation) =>
        affiliation.toJson(),
      ),
      user: this._user?.toJSON(),
    };
  }

  public static create(
    userId: string,
    name: string,
    familyName: string,
    level: RiderLevel,
    gender: Gender,
    imageUrl: string | null,
  ): RiderEntity {
    return new RiderEntity(
      '',
      userId,
      name,
      familyName,
      level,
      gender,
      new Date(),
      new Date(),
      imageUrl ?? '',
      [],
      undefined,
    );
  }
}
