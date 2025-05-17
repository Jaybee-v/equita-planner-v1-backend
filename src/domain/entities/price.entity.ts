import { StableEntity } from './stable.entity';

export class PriceEntity {
  private _id: string;
  private _stableId: string;
  private _label: string;
  private _description: string;
  private _price: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  private _stable?: StableEntity;

  constructor(
    id: string,
    stableId: string,
    label: string,
    description: string,
    price: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    stable?: StableEntity,
  ) {
    this._id = id;
    this._stableId = stableId;
    this._label = label;
    this._description = description;
    this._price = price;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._stable = stable;
  }

  get id(): string {
    return this._id;
  }

  get stableId(): string {
    return this._stableId;
  }

  get label(): string {
    return this._label;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
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

  set price(price: number) {
    this._price = price;
    this._updatedAt = new Date();
  }

  public toJson(): Record<string, any> {
    return {
      id: this._id,
      stableId: this._stableId,
      label: this._label,
      description: this._description,
      price: this._price,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      stable: this._stable?.toJSON(),
    };
  }

  public static create(data: {
    stableId: string;
    label: string;
    description: string;
    price: number;
  }): PriceEntity {
    return new PriceEntity(
      '',
      data.stableId,
      data.label,
      data.description,
      data.price,
    );
  }
}
