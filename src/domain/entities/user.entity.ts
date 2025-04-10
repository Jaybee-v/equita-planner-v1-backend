export class UserEntity {
  private _id: string;
  private _email: string;
  private _password: string;
  private _lastSeen: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    lastSeen: Date | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._lastSeen = lastSeen;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
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

  get lastSeen(): Date | null {
    return this._lastSeen;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
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
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
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
  public static create(email: string, password: string): UserEntity {
    return new UserEntity('', email, password);
  }
}
