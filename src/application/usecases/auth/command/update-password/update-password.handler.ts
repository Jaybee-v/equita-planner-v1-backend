import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { UpdatePasswordQuery } from './update-password.query';

@Injectable()
export class UpdatePasswordHandler {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: UpdatePasswordQuery): Promise<void> {
    console.log(query);
    if (query.userId !== query.handledBy) {
      throw new ForbiddenException(
        'You are not allowed to update this password',
      );
    }

    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const checkLastPassword = await this.authService.comparePassword(
      query.password,
      user.password,
    );

    if (checkLastPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    const hashedPassword = await this.authService.hashPassword(query.password);

    await this.userRepository.updateUserPassword(hashedPassword, query.userId);
    if (user.mustChangePassword) {
      await this.userRepository.updateUserMustChangePassword(
        false,
        query.userId,
      );
    }
  }
}
