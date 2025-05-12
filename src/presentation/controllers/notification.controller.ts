import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateNotificationStatusToReadHandler } from 'src/application/usecases/notification/commands/update-status-to-read/update-status-to-read.handler';
import { FindNotificationsByUserIdHandler } from 'src/application/usecases/notification/queries/find-by-user-id/find-by-user-id.handler';
import { GetNotificationByIdHandler } from 'src/application/usecases/notification/queries/get-by-id/get-notification-by-id.handler';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly findNotificationByIdUseCase: GetNotificationByIdHandler,
    private readonly updateNotificationStatusToReadUseCase: UpdateNotificationStatusToReadHandler,
    private readonly findNotificationsByUserIdUseCase: FindNotificationsByUserIdHandler,
  ) {}

  @HttpCode(200)
  @Get('stable/all')
  async findNotificationsByUserId(
    @Query('page') page: string,
    @Query('type') type: string,
    @Query('limit') limit: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.findNotificationsByUserIdUseCase.execute({
      userId: req.user.sub,
      page: parseInt(page),
      limit: parseInt(limit),
      type,
    });
  }

  @HttpCode(200)
  @Get(':id')
  async getNotification(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    console.log(id);
    return this.findNotificationByIdUseCase.execute({
      id,
      userId: req.user.sub,
      role: req.user.role,
    });
  }

  @HttpCode(200)
  @Put(':id/read')
  async updateNotificationStatusToRead(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    return this.updateNotificationStatusToReadUseCase.execute({
      id,
      userId: req.user.sub,
      role: req.user.role,
    });
  }
}
