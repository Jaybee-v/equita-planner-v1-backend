import { SetMetadata } from '@nestjs/common';

export const IS_RIDER_KEY = 'isRider';
export const Rider = () => SetMetadata(IS_RIDER_KEY, true);
