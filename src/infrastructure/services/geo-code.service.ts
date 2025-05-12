import { Injectable } from '@nestjs/common';
import NodeGeocoder, { Entry, Geocoder, Options } from 'node-geocoder';
import { IGeoCodeService } from 'src/domain/interfaces/services/geo-code.service';

@Injectable()
export class GeoCodeService implements IGeoCodeService {
  private geocoder: Geocoder;

  constructor() {
    const options: Options = {
      provider: 'openstreetmap',
    };

    this.geocoder = NodeGeocoder(options);
  }

  async geocodeAddress(address: string): Promise<{
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    zipcode: string;
    street: string;
    region: string;
    department: string;
  }> {
    const result: Entry[] = await this.geocoder.geocode(address);
    if (!result.length) {
      throw new Error('Adresse introuvable');
    }

    const {
      latitude,
      longitude,
      city,
      country,
      zipcode,
      streetName,
      streetNumber,
      state,
      stateCode,
    } = result[0];

    console.log(result);

    if (!city || !country || !zipcode) {
      throw new Error('Données de géocodage invalides');
    }

    return {
      latitude: latitude || 0,
      longitude: longitude || 0,
      city,
      country,
      zipcode,
      street: `${streetNumber || ''} ${streetName || ''}`.trim(),
      region: state || '',
      department: stateCode || '',
    };
  }
}
