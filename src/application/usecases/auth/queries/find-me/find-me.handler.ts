import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InstructorEntity } from 'src/domain/entities/instructor.entity';
import { RiderEntity } from 'src/domain/entities/rider.entity';
import { StableEntity } from 'src/domain/entities/stable.entity';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IInstructorRepository } from 'src/domain/interfaces/instructor.repository';
import { IRiderRepository } from 'src/domain/interfaces/rider.repository';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { FindMeQuery } from './find-me.query';

@Injectable()
export class FindMeHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
    @Inject('IInstructorRepository')
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async execute(query: FindMeQuery): Promise<{
    rider: RiderEntity | null;
    stable: StableEntity | null;
    instructor: InstructorEntity | null;
    user: UserEntity;
  }> {
    const user = await this.userRepository.findById(query.userId);
    console.log(user);
    if (!user) {
      throw new NotFoundException('Aucun utilisateur trouvé');
    }

    if (user.role === UserRole.RIDER) {
      const rider = await this.riderRepository.findByUserId(user.id);

      return { rider, stable: null, user, instructor: null };
    }

    if (user.role === UserRole.STABLE) {
      const stable = await this.stableRepository.findByUserIdWithAllData(
        user.id,
      );

      return { rider: null, stable, user, instructor: null };
    }

    if (user.role === UserRole.INSTRUCTOR) {
      const instructor = await this.instructorRepository.findByUserId(user.id);

      return { rider: null, stable: null, user, instructor };
    }

    if (user.role === UserRole.GUEST) {
      return { user, rider: null, stable: null, instructor: null };
    }

    throw new NotFoundException('Aucun utilisateur trouvé');
  }
}
