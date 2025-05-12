import { SetMetadata } from '@nestjs/common';

export const IS_STABLE_KEY = 'isStable';
export const Stable = () => SetMetadata(IS_STABLE_KEY, true);
