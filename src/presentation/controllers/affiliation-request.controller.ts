import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateAffiliationHandler } from 'src/application/usecases/affiliation-request/commands/create-affiliation/create-affiliation.handler';
import { UpdateAffiliationRequestStatusHandler } from 'src/application/usecases/affiliation-request/commands/update-status/update-status.handler';
import { FindAffiliationByStableIdHandler } from 'src/application/usecases/affiliation-request/queries/find-by-stable-id.handler';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Rider } from '../decorators/rider.decorator';
import { Stable } from '../decorators/stable.decorator';
import { CreateAffiliationRequestDto } from '../dtos/create-affiliation-request.dto';
import { UpdateAffiliationRequestStatusDto } from '../dtos/update-affiliation-request-status.dto';

@Controller('affiliation-requests')
export class AffiliationRequestController {
  constructor(
    private readonly createAffiliationUseCase: CreateAffiliationHandler,
    private readonly updateAffiliationRequestStatusUseCase: UpdateAffiliationRequestStatusHandler,
    private readonly findAffiliationRequestUseCase: FindAffiliationByStableIdHandler,
  ) {}

  @Rider()
  @HttpCode(201)
  @Post()
  async createAffiliationRequest(
    @Body() body: CreateAffiliationRequestDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    try {
      console.log(body);
      await this.createAffiliationUseCase.execute({
        ...body,
        creatorId: req.user.sub,
      });
      return {
        success: true,
        message: 'Ta demande a été transmise.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Stable()
  @HttpCode(200)
  @Get('stable/:stableId')
  async findAffiliationRequest(
    @Param('stableId') stableId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    const result = await this.findAffiliationRequestUseCase.execute({
      stableId,
      requestedBy: req.user.sub,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    return {
      success: true,
      message: "Les demandes d'affiliation ont été récupérées.",
      data: result,
    };
  }

  @Stable()
  @HttpCode(200)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateAffiliationRequestStatusDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    const result = await this.updateAffiliationRequestStatusUseCase.execute({
      id,
      status: body.status,
      userId: req.user.sub,
    });
    return {
      success: true,
      message: result.message,
    };
  }
}
