import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IStableRepository } from 'src/domain/interfaces/stable.repository';
import { UpdateImagesQuery } from './update-images.query';

@Injectable()
export class UpdateImagesHandler {
  constructor(
    @Inject('IStableRepository')
    private readonly stableRepository: IStableRepository,
  ) {}

  async execute(query: UpdateImagesQuery): Promise<void> {
    const stable = await this.stableRepository.findById(query.stableId);
    if (!stable) {
      throw new NotFoundException('Stable not found');
    }

    if (stable.userId !== query.userId) {
      throw new ForbiddenException('You are not allowed to update this stable');
    }

    stable.logoUrl = query.logoUrl ?? stable.logoUrl;
    stable.picture1 = query.picture1 ?? stable.picture1;
    stable.picture2 = query.picture2 ?? stable.picture2;
    stable.picture3 = query.picture3 ?? stable.picture3;

    await this.stableRepository.updateImages(stable);
  }
}
