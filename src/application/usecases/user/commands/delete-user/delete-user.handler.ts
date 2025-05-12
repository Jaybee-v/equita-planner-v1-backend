import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthService } from 'src/domain/interfaces/services/auth.service';
import { IUserRepository } from 'src/domain/interfaces/user.repository';
import { DeleteUserCommand } from './delete-user.command';

@Injectable()
export class DeleteUserHandler {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { userId, handledBy, password } = command;
    if (userId !== handledBy) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour supprimer cet utilisateur",
      );
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isPasswordValid = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Mot de passe incorrect');
    }

    await this.userRepository.deleteUser(userId);
  }
}
