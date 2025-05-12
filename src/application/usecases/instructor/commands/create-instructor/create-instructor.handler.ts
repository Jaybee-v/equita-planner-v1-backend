import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InstructorEntity } from 'src/domain/entities/instructor.entity';
import { IInstructorRepository } from 'src/domain/interfaces/instructor.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { CreateInstructorCommand } from './create-instructor.command';

@Injectable()
export class CreateInstructorHandler {
  constructor(
    @Inject('IInstructorRepository')
    private readonly instructorRepository: IInstructorRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateInstructorCommand): Promise<InstructorEntity> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new BadRequestException("Votre compte n'existe pas");
    }
    const instructor = InstructorEntity.create(command);
    return this.instructorRepository.create(instructor);
  }
}
