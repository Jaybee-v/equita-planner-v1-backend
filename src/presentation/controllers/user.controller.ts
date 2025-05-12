import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateStatusCommand } from 'src/application/usecases/user-setting/commands/update-status/update-status.command';
import { UpdateUserSettingStatusHandler } from 'src/application/usecases/user-setting/commands/update-status/update-status.handler';
import { CreateUserHandler } from 'src/application/usecases/user/commands/create-user/create-user.handler';
import { UpdateUserRoleHandler } from 'src/application/usecases/user/commands/update-user-role/update-user-role.handler';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FiltersExceptions } from '../filters/exceptions.filter';

@Controller('users')
@UseFilters(FiltersExceptions)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserHandler,
    private readonly updateUserSettingsStatusUseCase: UpdateUserSettingStatusHandler,
    private readonly updateUserRoleUseCase: UpdateUserRoleHandler,
  ) {}

  @Public()
  @HttpCode(201)
  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    const command = this.createUserUseCase.execute(userDto);
    return command;
  }

  @HttpCode(200)
  @Patch(':id/status')
  async updateUserSettingStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusCommand,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    if (
      body.type !== 'allstableNotifications' &&
      body.type !== 'emailNotifications'
    ) {
      throw new BadRequestException(
        "Ce que vous essayez de faire n'est pas possible",
      );
    }

    const command = await this.updateUserSettingsStatusUseCase.execute({
      id: id,
      type: body.type,
      requestedBy: req.user.sub,
    });

    if (command) {
      if (body.type === 'allstableNotifications') {
        return {
          message: 'Notifications des versions stables mises à jour',
        };
      } else {
        return {
          message: 'Notifications par email mises à jour',
        };
      }
    }
    return {
      message: 'Erreur lors de la mise à jour des notifications',
    };
  }

  @HttpCode(200)
  @Patch(':id/role')
  async updateGuestRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    await this.updateUserRoleUseCase.execute({
      userId: id,
      role: body.role,
      requestedBy: req.user.sub,
    });

    return {
      message: 'Rôle mis à jour',
      status: 200,
    };
  }
}
