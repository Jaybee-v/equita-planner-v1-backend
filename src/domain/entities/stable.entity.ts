import { AffiliationRequestEntity } from './affiliation-request.entity';
import { InstructorEntity } from './instructor.entity';
import { PriceEntity } from './price.entity';
import { SlotRequestEntity } from './slot-request.entity';

export class StableEntity {
  private _id: string;
  private _userId: string;
  private _name: string;
  private _street: string;
  private _numStreet: number;
  private _zip: string;
  private _city: string;
  private _country: string;
  private _region: string;
  private _department: string;
  private _latitude: number;
  private _longitude: number;
  private _phone: string;
  private _website: string;
  private _logoUrl: string;
  private _picture1: string;
  private _picture2: string;
  private _picture3: string;
  private _slug: string;

  private _createdAt: Date;
  private _updatedAt: Date;

  private _affiliationRequests: AffiliationRequestEntity[];
  private _instructors: InstructorEntity[];
  private _slotRequests: SlotRequestEntity[];
  private _prices: PriceEntity[];

  constructor(
    id: string,
    userId: string,
    name: string,
    street: string,
    numStreet: number,
    zip: string,
    city: string,
    country: string,
    region: string,
    department: string,
    latitude: number,
    longitude: number,
    phone: string,
    website: string,
    logoUrl: string = '',
    picture1: string = '',
    picture2: string = '',
    picture3: string = '',
    slug: string = '',
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    affiliationRequests: AffiliationRequestEntity[] = [],
    instructors: InstructorEntity[] = [],
    slotRequests: SlotRequestEntity[] = [],
    prices: PriceEntity[] = [],
  ) {
    this._id = id;
    this._userId = userId;
    this._name = name;
    this._street = street;
    this._numStreet = numStreet;
    this._zip = zip;
    this._city = city;
    this._country = country;
    this._region = region;
    this._department = department;
    this._latitude = latitude;
    this._longitude = longitude;
    this._phone = phone;
    this._website = website;
    this._logoUrl = logoUrl;
    this._picture1 = picture1;
    this._picture2 = picture2;
    this._picture3 = picture3;
    this._slug = slug;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._affiliationRequests = affiliationRequests;
    this._instructors = instructors;
    this._slotRequests = slotRequests;
    this._prices = prices;
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

  get street(): string {
    return this._street;
  }

  get numStreet(): number {
    return this._numStreet;
  }

  get zip(): string {
    return this._zip;
  }

  get city(): string {
    return this._city;
  }

  get country(): string {
    return this._country;
  }

  get region(): string {
    return this._region;
  }

  get department(): string {
    return this._department;
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get phone(): string {
    return this._phone;
  }

  get website(): string {
    return this._website;
  }

  get logoUrl(): string {
    return this._logoUrl;
  }

  get picture1(): string {
    return this._picture1;
  }

  get picture2(): string {
    return this._picture2;
  }

  get picture3(): string {
    return this._picture3;
  }

  get slug(): string {
    return this._slug;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get affiliationRequests(): AffiliationRequestEntity[] {
    return this._affiliationRequests;
  }

  get instructors(): InstructorEntity[] {
    return this._instructors;
  }

  get slotRequests(): SlotRequestEntity[] {
    return this._slotRequests;
  }

  get prices(): PriceEntity[] {
    return this._prices;
  }

  set name(name: string) {
    this._name = name;
    this._updatedAt = new Date();
  }

  set street(street: string) {
    this._street = street;
    this._updatedAt = new Date();
  }

  set numStreet(numStreet: number) {
    this._numStreet = numStreet;
    this._updatedAt = new Date();
  }

  set zip(zip: string) {
    this._zip = zip;
    this._updatedAt = new Date();
  }

  set city(city: string) {
    this._city = city;
    this._updatedAt = new Date();
  }

  set country(country: string) {
    this._country = country;
    this._updatedAt = new Date();
  }

  set phone(phone: string) {
    this._phone = phone;
    this._updatedAt = new Date();
  }

  set website(website: string) {
    this._website = website;
    this._updatedAt = new Date();
  }

  set logoUrl(logoUrl: string) {
    this._logoUrl = logoUrl;
    this._updatedAt = new Date();
  }

  set picture1(picture1: string) {
    this._picture1 = picture1;
    this._updatedAt = new Date();
  }

  set picture2(picture2: string) {
    this._picture2 = picture2;
    this._updatedAt = new Date();
  }

  set picture3(picture3: string) {
    this._picture3 = picture3;
    this._updatedAt = new Date();
  }

  static generateSlug(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      name: this._name,
      street: this._street,
      numStreet: this._numStreet,
      zip: this._zip,
      city: this._city,
      country: this._country,
      region: this._region,
      department: this._department,
      latitude: this._latitude,
      longitude: this._longitude,
      phone: this._phone,
      website: this._website,
      logoUrl: this._logoUrl,
      picture1: this._picture1,
      picture2: this._picture2,
      picture3: this._picture3,
      slug: this._slug,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      affiliationRequests: this._affiliationRequests.map((affiliationRequest) =>
        affiliationRequest.toJson(),
      ),
      instructors: this._instructors.map((instructor) => instructor.toJSON()),
      slotRequests: this._slotRequests.map((slotRequest) =>
        slotRequest.toJSON(),
      ),
      prices: this._prices.map((price) => price.toJson()),
    };
  }

  static create(stable: {
    name: string;
    userId: string;
    street: string;
    numStreet: number;
    zip: string;
    city: string;
    country: string;
    region: string;
    department: string;
    phone: string;
    website: string;
    latitude: number;
    longitude: number;
    slug: string;
  }): StableEntity {
    return new StableEntity(
      '',
      stable.userId,
      stable.name,
      stable.street,
      stable.numStreet,
      stable.zip,
      stable.city,
      stable.country,
      stable.region,
      stable.department,
      stable.latitude,
      stable.longitude,
      stable.phone,
      stable.website,
      '',
      '',
      '',
      '',
      stable.slug,
    );
  }
}
