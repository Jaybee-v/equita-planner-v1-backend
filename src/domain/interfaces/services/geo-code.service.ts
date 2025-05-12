export interface IGeoCodeService {
  geocodeAddress(address: string): Promise<{
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    zipcode: string;
    street: string;
    region: string;
    department: string;
  }>;
}
