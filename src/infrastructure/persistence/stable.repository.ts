import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { Status } from 'src/domain/enums/status.enum';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { PrismaService } from '../config/prisma.service';
import { StableMapper } from '../mappers/stable.mapper';

@Injectable()
export class StableRepository implements IStableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(stable: StableEntity): Promise<StableEntity> {
    try {
      const raw = await this.prisma.stable.create({
        data: {
          userId: stable.userId,
          name: stable.name,
          street: stable.street,
          numStreet: stable.numStreet,
          zip: stable.zip,
          city: stable.city,
          country: stable.country,
          latitude: stable.latitude,
          longitude: stable.longitude,
          phone: stable.phone,
          website: stable.website,
          logoUrl: stable.logoUrl,
          picture1: stable.picture1,
          picture2: stable.picture2,
          picture3: stable.picture3,
          slug: stable.slug,
        },
      });
      return StableMapper.toDomain(raw);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Vous êtes déjà enregistré en tant que centre équestre',
          );
        }
      }
      throw new Error('Failed to create stable');
    }
  }

  async findBySlug(slug: string): Promise<StableEntity | null> {
    const raw = await this.prisma.stable.findUnique({
      where: { slug },
    });
    return raw ? StableMapper.toDomain(raw) : null;
  }

  async findByUserId(userId: string): Promise<StableEntity | null> {
    const raw = await this.prisma.stable.findFirst({
      where: { userId },
    });
    return raw ? StableMapper.toDomain(raw) : null;
  }

  async findByUserIdWithAllData(userId: string): Promise<StableEntity | null> {
    const raw = await this.prisma.stable.findFirst({
      where: { userId },
      include: {
        affiliationRequests: {
          where: {
            status: Status.PENDING,
          },
          include: {
            rider: true,
          },
        },
        slotRequests: {
          where: {
            status: Status.PENDING,
          },
          include: {
            rider: true,
          },
        },
        instructors: true,
      },
    });
    return raw ? StableMapper.toDomain(raw) : null;
  }

  async findById(id: string): Promise<StableEntity | null> {
    const raw = await this.prisma.stable.findUnique({
      where: { id },
    });
    return raw ? StableMapper.toDomain(raw) : null;
  }

  async findByGeoLocation(
    latitude: number,
    longitude: number,
  ): Promise<StableEntity[]> {
    const radiusInKm = 50;

    // Approximation : 1° latitude ≈ 111 km
    const degreeOffset = radiusInKm / 111;

    const stables = await this.prisma.stable.findMany({
      where: {
        latitude: {
          gte: latitude - degreeOffset,
          lte: latitude + degreeOffset,
        },
        longitude: {
          gte: longitude - degreeOffset,
          lte: longitude + degreeOffset,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Filtrage plus précis avec la formule de Haversine
    const filtered = stables.filter((stable) => {
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371; // Rayon de la Terre en km

      const dLat = toRad(stable.latitude! - latitude);
      const dLon = toRad(stable.longitude! - longitude);

      const lat1 = toRad(latitude);
      const lat2 = toRad(stable.latitude!);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusInKm;
    });

    return filtered.map((stable) => StableMapper.toDomain(stable));
  }

  async findCities(search: string): Promise<string[]> {
    if (search.length < 3) return [];

    const cities = await this.prisma.stable.findMany({
      where: {
        city: {
          contains: search,
        },
      },
      select: {
        city: true,
      },
      distinct: ['city'],
      take: 10,
    });

    return cities.map((entry) => entry.city);
  }

  async updateImages(stable: StableEntity): Promise<StableEntity> {
    const raw = await this.prisma.stable.update({
      where: { id: stable.id },
      data: {
        logoUrl: stable.logoUrl,
        picture1: stable.picture1,
        picture2: stable.picture2,
        picture3: stable.picture3,
      },
    });
    return StableMapper.toDomain(raw);
  }

  async update(stable: StableEntity): Promise<StableEntity> {
    const raw = await this.prisma.stable.update({
      where: { id: stable.id },
      data: {
        name: stable.name,
        street: stable.street,
        numStreet: stable.numStreet,
        zip: stable.zip,
        city: stable.city,
        country: stable.country,
        latitude: stable.latitude,
        longitude: stable.longitude,
        phone: stable.phone,
        website: stable.website,
        logoUrl: stable.logoUrl,
        picture1: stable.picture1,
        picture2: stable.picture2,
        picture3: stable.picture3,
        userId: stable.userId,
        createdAt: stable.createdAt,
        updatedAt: new Date(),
      },
    });
    return StableMapper.toDomain(raw);
  }
}
