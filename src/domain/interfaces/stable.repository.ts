import { StableEntity } from '../entities/stable.entity';

export interface IStableRepository {
  create(stable: StableEntity): Promise<StableEntity>;
  findByUserId(userId: string): Promise<StableEntity | null>;
  findByUserIdWithAllData(userId: string): Promise<StableEntity | null>;
  findById(id: string): Promise<StableEntity | null>;
  findBySlug(slug: string): Promise<StableEntity | null>;
  findByGeoLocation(
    latitude: number,
    longitude: number,
  ): Promise<StableEntity[]>;
  findCities(search: string): Promise<string[]>;
  update(stable: StableEntity): Promise<StableEntity>;
  updateImages(stable: StableEntity): Promise<StableEntity>;
}
