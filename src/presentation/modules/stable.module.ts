import { forwardRef, Module } from '@nestjs/common';
import { CreateStableHandler } from 'src/application/usecases/stable/commands/create-stable/create-stable.handler';
import { DeleteImageHandler } from 'src/application/usecases/stable/commands/delete-image/delete-image.handler';
import { FileUploadHandler } from 'src/application/usecases/stable/commands/file-upload/file-upload.handler';
import { UpdateImagesHandler } from 'src/application/usecases/stable/commands/update-images/update-images.handler';
import { FindStablesByGeolocHandler } from 'src/application/usecases/stable/queries/find-by-geoloc/find-by-geoloc.handler';
import { FindStableBySlugHandler } from 'src/application/usecases/stable/queries/find-by-slug/find-by-slug.handler';
import { FindCitiesHandler } from 'src/application/usecases/stable/queries/find-cities/find-cities.handler';
import { GetStableStatsHandler } from 'src/application/usecases/stable/queries/get-stats/get-stats.handler';
import { PrismaService } from 'src/infrastructure/config/prisma.service';
import { StableRepository } from 'src/infrastructure/persistence/stable.repository';
import { GeoCodeService } from 'src/infrastructure/services/geo-code.service';
import { MulterService } from 'src/infrastructure/services/multer.service';
import { StableController } from '../controllers/stable.controller';
import { ActivityModule } from './activity.module';
import { AffiliationRequestModule } from './affiliation-request.module';
import { NotificationModule } from './notification.module';

@Module({
  imports: [
    forwardRef(() => NotificationModule),
    forwardRef(() => AffiliationRequestModule),
    forwardRef(() => ActivityModule),
  ],
  controllers: [StableController],
  providers: [
    { provide: 'IStableRepository', useClass: StableRepository },
    CreateStableHandler,
    FindStablesByGeolocHandler,
    FindCitiesHandler,
    FindStableBySlugHandler,
    UpdateImagesHandler,
    GetStableStatsHandler,
    DeleteImageHandler,
    { provide: 'IGeoCodeService', useClass: GeoCodeService },
    FileUploadHandler,
    { provide: 'IMulterService', useClass: MulterService },
    PrismaService,
  ],
  exports: ['IStableRepository'],
})
export class StableModule {}
