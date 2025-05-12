import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { DeleteImageCommand } from './delete-image.command';

@Injectable()
export class DeleteImageHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(command: DeleteImageCommand): Promise<void> {
    const stable = await this.stableRepository.findById(command.stableId);
    if (!stable) {
      throw new NotFoundException('Stable not found');
    }

    if (stable.userId !== command.userId) {
      throw new ForbiddenException('You are not allowed to delete this image');
    }

    if (command.imageUrl === stable.logoUrl) {
      stable.logoUrl = '';
    }

    if (command.imageUrl === stable.picture1) {
      stable.picture1 = '';
    }

    if (command.imageUrl === stable.picture2) {
      stable.picture2 = '';
    }

    if (command.imageUrl === stable.picture3) {
      stable.picture3 = '';
    }

    await this.stableRepository.update(stable);
  }
}
