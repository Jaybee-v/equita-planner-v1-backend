import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateInstructorHandler } from 'src/application/usecases/instructor/commands/create-instructor/create-instructor.handler';
import { CreateStableInstructorHandler } from 'src/application/usecases/stable/commands/create-instructor/create-instructor.handler';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { JwtUserPayload } from 'src/domain/types/jwt-user-payload';
import { Stable } from '../decorators/stable.decorator';
import { CreateInstructorDto } from '../dtos/create-instructor.dto';

@Controller('instructors')
export class InstructorController {
  constructor(
    private readonly createInstructorHandler: CreateInstructorHandler,
    private readonly createStableInstructorHandler: CreateStableInstructorHandler,
  ) {}

  @Stable()
  @HttpCode(201)
  @Post('stable')
  async createInstructor(
    @Body() command: CreateInstructorDto,
    @Req() req: Request & { user: JwtUserPayload },
  ) {
    console.log('A LENTREE', command);
    const instructor = await this.createStableInstructorHandler.execute({
      instructor: {
        ...command,
      },
      user: {
        email: command.email,
        password: 'ecuries2025',
        role: UserRole.INSTRUCTOR,
        isIndependentInstructor: false,
      },
      requestedBy: req.user.sub,
    });
    return instructor;
  }
}
