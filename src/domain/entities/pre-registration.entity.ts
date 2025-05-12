export class PreRegistrationEntity {
  private _id: string;
  private _email: string;
  private _createdAt: Date;

  constructor(id: string, email: string, createdAt: Date) {
    this._id = id;
    this._email = email;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      email: this._email,
      createdAt: this._createdAt,
    };
  }

  static create(email: string): PreRegistrationEntity {
    return new PreRegistrationEntity('', email, new Date());
  }
}
