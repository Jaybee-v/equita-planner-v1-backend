import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateActivityParticipantHandler } from 'src/application/usecases/activity-participant/commands/create-activity-participant/create-activity-participant.handler';
import { DeleteActivityParticipantHandler } from 'src/application/usecases/activity-participant/commands/delete-activity-participant/delete-activity-participant.handler';
import { FindActivityParticipantsByRiderIdHandler } from 'src/application/usecases/activity-participant/queries/find-by-rider-id/find-by-rider-id.handler';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Rider } from '../decorators/rider.decorator';
import { CreateActivityParticipantDto } from '../dtos/create-activity-participant.dto';

@Controller('activity-participant')
export class ActivityParticipantController {
  constructor(
    private readonly createActivityParticipantUseCase: CreateActivityParticipantHandler,
    private readonly deleteActivityParticipantUseCase: DeleteActivityParticipantHandler,
    private readonly findActivityParticipantsByRiderIdUseCase: FindActivityParticipantsByRiderIdHandler,
  ) {}

  @Rider()
  @HttpCode(201)
  @Post()
  async createActivityParticipant(
    @Body() body: CreateActivityParticipantDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.createActivityParticipantUseCase.execute({
      ...body,
      requestedBy: req.user.sub,
    });
  }

  @Rider()
  @HttpCode(200)
  @Get('/rider/:id')
  async findActivityParticipantsByRiderId(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.findActivityParticipantsByRiderIdUseCase.execute({
      riderId: id,
      requestedBy: req.user.sub,
    });
  }

  @Rider()
  @HttpCode(200)
  @Delete('/rider/:id')
  async deleteActivityParticipant(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    await this.deleteActivityParticipantUseCase.execute({
      id,
      requestedBy: req.user.sub,
    });

    return {
      success: true,
      message: 'Participant deleted successfully',
    };
  }
}
