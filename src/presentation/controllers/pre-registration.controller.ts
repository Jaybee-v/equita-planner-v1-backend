import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { PreRegistrationAlreadyExists } from 'src/application/exceptions/pre-registration.exceptions';
import { InvalidEmailAddress } from 'src/application/exceptions/user.exceptions';
import { CreatePreRegistrationHandler } from 'src/application/usecases/pre-registration/commands/create-pre-registration/create-pre-registration.handler';
import { Public } from '../decorators/public.decorator';
import { CreatePreRegistrationDto } from '../dtos/create-pre-registration.dto';

@Controller('pre-registration')
export class PreRegistrationController {
  constructor(
    private readonly createPreRegistrationUseCase: CreatePreRegistrationHandler,
  ) {}

  @Public()
  @HttpCode(201)
  @Post()
  async createPreRegistration(@Body() body: CreatePreRegistrationDto) {
    try {
      console.log(body);
      return this.createPreRegistrationUseCase.execute(body);
    } catch (error) {
      console.log(error);
      if (error instanceof InvalidEmailAddress) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof PreRegistrationAlreadyExists) {
        return {
          message: 'Email already exists',
        };
      }
      throw new InternalServerErrorException();
    }
  }
}
