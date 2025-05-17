import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreatePriceHandler } from 'src/application/usecases/price/commands/create-price/create-price.handler';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Stable } from '../decorators/stable.decorator';
import { CreatePriceDto } from '../dtos/create-price.dto';

@Controller('prices')
export class PriceController {
  constructor(private readonly createPriceUseCase: CreatePriceHandler) {}

  @Stable()
  @HttpCode(201)
  @Post()
  async createPrice(
    @Body() command: CreatePriceDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    const result = await this.createPriceUseCase.execute({
      ...command,
      requestedBy: req.user.sub,
    });
    return {
      message: 'Votre tarif a été enregistré avec succès',
      status: 201,
      data: result,
    };
  }
}
