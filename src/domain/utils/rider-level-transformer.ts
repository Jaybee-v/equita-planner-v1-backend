import { RiderLevel } from '../enums/rider-level.enum';

export const riderLevelTransformer = (level: RiderLevel) => {
  switch (level) {
    case RiderLevel.BEGINNER:
      return 'Débutant';
    case RiderLevel.GALOP_1:
      return 'Galop 1';
    case RiderLevel.GALOP_2:
      return 'Galop 2';
    case RiderLevel.GALOP_3:
      return 'Galop 3';
    case RiderLevel.GALOP_4:
      return 'Galop 4';
    case RiderLevel.GALOP_5:
      return 'Galop 5';
    case RiderLevel.GALOP_6:
      return 'Galop 6';
    case RiderLevel.GALOP_7:
      return 'Galop 7';
    case RiderLevel.ALL:
      return 'Tous niveaux';
  }
};
