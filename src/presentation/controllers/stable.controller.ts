import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateStableHandler } from 'src/application/usecases/stable/commands/create-stable/create-stable.handler';
import { DeleteImageHandler } from 'src/application/usecases/stable/commands/delete-image/delete-image.handler';
import { FileUploadHandler } from 'src/application/usecases/stable/commands/file-upload/file-upload.handler';
import { UpdateImagesHandler } from 'src/application/usecases/stable/commands/update-images/update-images.handler';
import { FindStablesByGeolocHandler } from 'src/application/usecases/stable/queries/find-by-geoloc/find-by-geoloc.handler';
import { FindStableBySlugHandler } from 'src/application/usecases/stable/queries/find-by-slug/find-by-slug.handler';
import { FindCitiesHandler } from 'src/application/usecases/stable/queries/find-cities/find-cities.handler';
import { GetStableStatsHandler } from 'src/application/usecases/stable/queries/get-stats/get-stats.handler';
import { ImportFileType } from 'src/domain/enums/import-file-type.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Public } from '../decorators/public.decorator';
import { Stable } from '../decorators/stable.decorator';
import { CreateStableDto } from '../dtos/create-stable.dto';
import { UploadImageDto } from '../dtos/upload-image.dto';

@Controller('stables')
export class StableController {
  constructor(
    private readonly createStableUseCase: CreateStableHandler,
    private readonly findStablesByGeolocUseCase: FindStablesByGeolocHandler,
    private readonly findCitiesUseCase: FindCitiesHandler,
    private readonly fileUploadUseCase: FileUploadHandler,
    private readonly updateImagesUseCase: UpdateImagesHandler,
    private readonly deleteImageUseCase: DeleteImageHandler,
    private readonly findStableBySlugUseCase: FindStableBySlugHandler,
    private readonly getStatsUseCase: GetStableStatsHandler,
  ) {}

  @Stable()
  @HttpCode(201)
  @Post()
  async createStable(
    @Body() body: CreateStableDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    try {
      console.log(req.user);
      console.log(body);
      if (req.user.sub !== body.userId || req.user.role !== UserRole.STABLE) {
        throw new BadRequestException(
          "Vous n'avez pas les droits pour créer un centre équestre pour cet utilisateur",
        );
      }

      return this.createStableUseCase.execute(body);
    } catch (error) {
      console.log(error);
    }
  }

  @Stable()
  @HttpCode(201)
  @Post('upload-image')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'picture1', maxCount: 1 },
      { name: 'picture2', maxCount: 1 },
      { name: 'picture3', maxCount: 1 },
    ]),
  )
  async uploadImage(
    @Body() body: UploadImageDto,
    @UploadedFiles()
    files: {
      logo: Express.Multer.File[];
      picture1: Express.Multer.File[];
      picture2: Express.Multer.File[];
      picture3: Express.Multer.File[];
    },
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    try {
      console.log(files);

      console.log(body);
      console.log(req.user);

      const { logo, picture1, picture2, picture3 } = files;
      console.log(logo, picture1, picture2, picture3);

      let logoPath: string | null = null;
      if (logo) {
        logoPath = await this.fileUploadUseCase.execute({
          file: logo[0],
          type: ImportFileType.LOGO,
        });
      }

      let picture1Path: string | null = null;
      if (picture1) {
        picture1Path = await this.fileUploadUseCase.execute({
          file: picture1[0],
          type: ImportFileType.IMAGE,
        });
      }

      let picture2Path: string | null = null;
      if (picture2) {
        picture2Path = await this.fileUploadUseCase.execute({
          file: picture2[0],
          type: ImportFileType.IMAGE,
        });
      }

      let picture3Path: string | null = null;
      if (picture3) {
        picture3Path = await this.fileUploadUseCase.execute({
          file: picture3[0],
          type: ImportFileType.IMAGE,
        });
      }

      await this.updateImagesUseCase.execute({
        stableId: body.stableId,
        logoUrl: logoPath,
        picture1: picture1Path,
        picture2: picture2Path,
        picture3: picture3Path,
        userId: req.user.sub,
      });
      return {
        message: 'Images mises à jour avec succès',
        url: logoPath ?? picture1Path ?? picture2Path ?? picture3Path,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erreur lors de la mise à jour des images');
    }
  }

  @Stable()
  @HttpCode(200)
  @Delete('delete-image')
  async deleteImage(
    @Body() body: any,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    await this.deleteImageUseCase.execute({
      ...body,
      userId: req.user.sub,
    });
    return {
      message: 'Image supprimée avec succès',
      success: true,
    };
  }

  @Public()
  @HttpCode(200)
  @Get('by-geoloc')
  async findStablesByGeoloc(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return this.findStablesByGeolocUseCase.execute({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
  }

  @Public()
  @Get('cities')
  async findCities(@Query('search') search: string) {
    if (search.length < 3) {
      throw new BadRequestException(
        'La recherche doit contenir au moins 3 caractères',
      );
    }

    return this.findCitiesUseCase.execute({
      search,
    });
  }

  @Public()
  @Get('by-slug/:slug')
  async findStableBySlug(@Param('slug') slug: string, @Query('id') id: string) {
    return this.findStableBySlugUseCase.execute({
      slug,
      id,
    });
  }

  @Stable()
  @Get('stats/:id')
  @HttpCode(200)
  async getStats(
    @Param('id') id: string,
    @Query('period') period: 'week' | 'month' | 'year',
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    if (req.user.role !== UserRole.STABLE) {
      throw new BadRequestException(
        "Vous n'avez pas les droits pour voir les stats de ce centre équestre",
      );
    }

    return this.getStatsUseCase.execute({
      stableId: id,
      period: period ?? 'week',
      requestedBy: req.user.sub,
    });
  }
}
