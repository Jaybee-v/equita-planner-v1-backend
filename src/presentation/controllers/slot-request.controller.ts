import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { CreateSlotRequestHandler } from 'src/application/usecases/slot-request/commands/create-slot-request/create-slot-request.handler';
import { UpdateSlotRequestStatusHandler } from 'src/application/usecases/slot-request/commands/update-status/update-status.handler';
import { FindSlotsRequestByRiderIdAndStatusHandler } from 'src/application/usecases/slot-request/queries/find-by-rider-id-and-status/find-by-rider-id-and-status.handler';
import { Status } from 'src/domain/enums/status.enum';
import { Rider } from '../decorators/rider.decorator';
import { Stable } from '../decorators/stable.decorator';
import { CreateSlotRequestDto } from '../dtos/create-slot-request.dto';

@Controller('slot-request')
export class SlotRequestController {
  constructor(
    private readonly createSlotRequestUseCase: CreateSlotRequestHandler,
    private readonly updateSlotRequestStatusUseCase: UpdateSlotRequestStatusHandler,
    private readonly findByRiderIdAndStatusUseCase: FindSlotsRequestByRiderIdAndStatusHandler,
  ) {}

  @Rider()
  @HttpCode(201)
  @Post()
  async create(
    @Body() body: CreateSlotRequestDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    try {
      const slotRequest = await this.createSlotRequestUseCase.execute({
        stableId: body.stableId,
        riderId: body.riderId,
        message: body.message,
        requestedBy: req.user.sub as string,
        preferredStartDate: new Date(body.preferredStartDate),
        preferredEndDate: new Date(body.preferredEndDate),
      });

      return {
        message: 'Slot request created successfully',
        data: slotRequest,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Stable()
  @HttpCode(200)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: Status },
    @Req() req: Request & { user: JwtPayload },
  ) {
    await this.updateSlotRequestStatusUseCase.execute({
      slotRequestId: id,
      status: body.status,
      requestedBy: req.user.sub as string,
    });

    if (body.status === Status.APPROVED) {
      return {
        message: 'Le demande a été acceptée',
      };
    }

    if (body.status === Status.REJECTED) {
      return {
        message: 'Le demande a été refusée',
      };
    }

    return {
      message: 'Slot request status updated successfully',
    };
  }

  @Rider()
  @HttpCode(200)
  @Get('rider/:riderId')
  async getSlotRequests(@Param('riderId') riderId: string) {
    const pendingRequest = await this.findByRiderIdAndStatusUseCase.execute({
      riderId,
      status: Status.PENDING,
      page: 1,
      limit: 3,
    });

    const approvedRequest = await this.findByRiderIdAndStatusUseCase.execute({
      riderId,
      status: Status.APPROVED,
      page: 1,
      limit: 3,
    });

    const rejectedRequest = await this.findByRiderIdAndStatusUseCase.execute({
      riderId,
      status: Status.REJECTED,
      page: 1,
      limit: 3,
    });

    return {
      pendingRequest,
      approvedRequest,
      rejectedRequest,
    };
  }

  @Rider()
  @HttpCode(200)
  @Get('rider/:riderId/status/:status')
  async getSlotRequestsByStatus(
    @Param('riderId') riderId: string,
    @Param('status') status: Status,
    @Query('page') page: string,
  ) {
    const slotRequests = await this.findByRiderIdAndStatusUseCase.execute({
      riderId,
      status: status,
      page: parseInt(page),
      limit: 3,
    });
    console.log(slotRequests);

    return {
      slotRequests: slotRequests.slotRequests,
      count: slotRequests.count,
    };
  }
}
