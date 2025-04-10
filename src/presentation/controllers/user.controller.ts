import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { CreateUserHandler } from 'src/application/usecases/user/commands/create-user/create-user.handler';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FiltersExceptions } from '../filters/exceptions.filter';

@Controller('users')
@UseFilters(FiltersExceptions)
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserHandler) {}

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    const command = this.createUserUseCase.execute(userDto);
    return command;
  }
}
