import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateActivityHandler } from 'src/application/usecases/activity/commands/create-activity/create-activity.handler';
import { SendActivityNotificationHandler } from 'src/application/usecases/activity/commands/send-notification/send-notification.handler';
import { FindActivityByIdHandler } from 'src/application/usecases/activity/queries/find-by-id/find-by-id.handler';
import { FindActivitiesByInstructorIdBetweenDatesHandler } from 'src/application/usecases/activity/queries/find-by-instructor-between-dates/find-by-instuctor-between-dates.handler';
import { FindActivitiesByStableIdAndDayHandler } from 'src/application/usecases/activity/queries/find-by-stable-id-and-day/find-by-stable-id-and-day.handler';
import { FindByStableIdAndFiltersHandler } from 'src/application/usecases/activity/queries/find-by-stable-id-and-filters/find-by-stable-id-and-filters.handler';
import { FindByStableIdAndWeekHandler } from 'src/application/usecases/activity/queries/find-by-stable-id-and-week/find-by-stable-id-and-week.handler';
import { FindEmptySlotByStableIdBetweenDatesHandler } from 'src/application/usecases/activity/queries/find-empty-slot-by-stable-id-between-dates/find-empty-slot-by-stable-id-between-dates.handler';
import { FindThreeDaysActivitiesByStableIdHandler } from 'src/application/usecases/activity/queries/find-three-days-by-stable-id/find-three-days-by-stable-id.handler';
import { CreatedByOption } from 'src/domain/enums/created-by-option.enum';
import { SelectRiderLevelRequestForNotification } from 'src/domain/enums/select-rider-level-request-for-notification';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Rider } from '../decorators/rider.decorator';
import { Stable } from '../decorators/stable.decorator';
import { CreateActivityDto } from '../dtos/create-activity.dto';
import { SearchActivitiesDto } from '../dtos/search-activities.dto';

@Controller('activities')
export class ActivityController {
  constructor(
    private readonly createActivityUseCase: CreateActivityHandler,
    private readonly findActivitiesByStableIdAndDayUseCase: FindActivitiesByStableIdAndDayHandler,
    private readonly findActivityByIdUseCase: FindActivityByIdHandler,
    private readonly findActivitiesByStableIdAndWeekUseCase: FindByStableIdAndWeekHandler,
    private readonly sendActivityNotificationUseCase: SendActivityNotificationHandler,
    private readonly findActivitiesByStableIdAndFiltersUseCase: FindByStableIdAndFiltersHandler,
    private readonly findActivitiesByInstructorIdBetweenDatesUseCase: FindActivitiesByInstructorIdBetweenDatesHandler,
    private readonly findEmptySlotsByStableIdBetweenDatesUseCase: FindEmptySlotByStableIdBetweenDatesHandler,
    private readonly findThreeDaysActivitiesByStableIdUseCase: FindThreeDaysActivitiesByStableIdHandler,
  ) {}

  @HttpCode(201)
  @Post()
  async createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    try {
      if (req.user.role === UserRole.RIDER) {
        throw new BadRequestException('Vous ne pouvez pas créer une activité');
      }
      console.log('createActivityDto');
      console.log(createActivityDto);
      return this.createActivityUseCase.execute({
        ...createActivityDto,
        createdBy: CreatedByOption.STABLE,
        createdFromRequestId: '',
      });
    } catch (error) {
      console.log(error);
    }
  }

  @HttpCode(200)
  @Get('stable/:stableId')
  async findActivitiesByStableIdAndDay(
    @Param('stableId') stableId: string,
    @Query('day') day: string,
  ) {
    return this.findActivitiesByStableIdAndDayUseCase.execute({
      stableId,
      day: day,
    });
  }

  @HttpCode(200)
  @Rider()
  @Post('stable/rider')
  async findActivitiesByStableIdAndFilters(
    @Req() req: Request & { user: JwtUserPayload },
    @Body() body: SearchActivitiesDto,
  ) {
    try {
      console.log(body);
      return this.findActivitiesByStableIdAndFiltersUseCase.execute({
        stableId: body.stableId,
        date: new Date(body.date),
        requestedBy: req.user.sub,
        role: req.user.role,
        search: body.search,
        requiredLevel: body.requiredLevel,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @HttpCode(200)
  @Get('stable/:stableId/week/:date')
  async findActivitiesByStableIdAndWeek(
    @Param('stableId') stableId: string,
    @Param('date') date: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.findActivitiesByStableIdAndWeekUseCase.execute({
      stableId,
      date: new Date(date),
      requestedBy: req.user.sub,
      role: req.user.role,
    });
  }

  @HttpCode(200)
  @Get('stable/:stableId/three-days/:date')
  async findActivitiesByStableIdForMobile(
    @Param('stableId') stableId: string,
    @Param('date') date: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.findThreeDaysActivitiesByStableIdUseCase.execute({
      stableId,
      date: new Date(date),
      requestedBy: req.user.sub,
    });
  }

  @HttpCode(200)
  @Get('stable/empty-slots/:stableId')
  async findEmptySlotsByStableId(
    @Param('stableId') stableId: string,
    @Query('date') date: string,
    @Query('period') period: 'day' | 'week' | 'month',
  ) {
    return this.findEmptySlotsByStableIdBetweenDatesUseCase.execute({
      stableId,
      date: new Date(date),
      period,
    });
  }

  @Get(':id')
  async findActivityById(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.findActivityByIdUseCase.execute({
      id,
      requestedBy: req.user.sub,
      role: req.user.role,
    });
  }

  @Stable()
  @HttpCode(200)
  @Post('stable/send-notification')
  async sendNotification(
    @Body()
    body: {
      activityId: string;
      stableId: string;
      riderLevel: SelectRiderLevelRequestForNotification;
    },
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    if (!body.activityId || !body.stableId) {
      throw new BadRequestException('Vous ne pouvez pas obtenir ceci');
    }

    return this.sendActivityNotificationUseCase.execute({
      stableId: body.stableId,
      activityId: body.activityId,
      message: 'test',
      type: 'test',
      requestedBy: req.user.sub,
      riderLevel: body.riderLevel,
    });
  }

  @Get('instructor/:instructorId')
  @HttpCode(200)
  async findActivitiesByInstructorIdBetweenDates(
    @Param('instructorId') instructorId: string,
    @Query('date') date: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    if (
      req.user.role !== UserRole.INSTRUCTOR &&
      req.user.role !== UserRole.STABLE
    ) {
      throw new BadRequestException('Vous ne pouvez pas obtenir ceci');
    }

    return this.findActivitiesByInstructorIdBetweenDatesUseCase.execute({
      date: new Date(date),
      instructorId,
    });
  }
}
