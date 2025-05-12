import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateRiderHandler } from 'src/application/usecases/rider/commands/create-rider/create-rider.handler';
import { FindRiderByIdHandler } from 'src/application/usecases/rider/queries/find-by-id/find-by-id.handler';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Rider } from '../decorators/rider.decorator';
import { CreateRiderDto } from '../dtos/create-rider.dto';

@Controller('riders')
export class RiderController {
  constructor(
    private readonly createRiderUseCase: CreateRiderHandler,
    private readonly findByIdUseCase: FindRiderByIdHandler,
  ) {}

  @Rider()
  @HttpCode(201)
  @Post()
  async createRider(
    @Body() body: CreateRiderDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    console.log(body);
    if (body.userId !== req.user.sub) {
      throw new ForbiddenException();
    }

    const rider = await this.createRiderUseCase.execute(body);
    return rider;
  }

  @HttpCode(200)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    if (req.user.role === UserRole.RIDER) {
      throw new ForbiddenException(
        'Vous ne pouvez pas acceder à cette ressource',
      );
    }
    const rider = await this.findByIdUseCase.execute({
      id,
    });
    return rider;
  }
}
