import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InstructorEntity } from 'src/domain/entities/instructor.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IInstructorRepository } from 'src/domain/interfaces/instructor.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { CreateStableInstructorCommand } from './create-instructor.command';

@Injectable()
export class CreateStableInstructorHandler {
  constructor(
    @Inject('IInstructorRepository')
    private readonly instructorRepository: IInstructorRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(
    command: CreateStableInstructorCommand,
  ): Promise<InstructorEntity> {
    if (!command.instructor.stableId) {
      throw new BadRequestException('Aucun établissement trouvé');
    }

    const stable = await this.stableRepository.findById(
      command.instructor.stableId,
    );

    if (!stable) {
      throw new BadRequestException('Aucun établissement trouvé');
    }

    if (stable.userId !== command.requestedBy) {
      throw new BadRequestException(
        "Vous n'êtes pas autorisé à créer un instructeur pour cet établissement",
      );
    }

    const hashedPassword = await bcrypt.hash(command.user.password, 10);

    const _user = UserEntity.create({
      email: command.user.email,
      password: hashedPassword,
      role: command.user.role,
      isIndependentInstructor: command.user.isIndependentInstructor,
      mustChangePassword: true,
    });

    const user = await this.userRepository.create(_user);

    const _instructor = InstructorEntity.create({
      ...command.instructor,
      userId: user.id,
    });

    const instructor = await this.instructorRepository.create(_instructor);
    return instructor;
  }
}
