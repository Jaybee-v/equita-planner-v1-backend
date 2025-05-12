import {
  Conversation as PrismaConversation,
  Rider as PrismaRider,
  Stable as PrismaStable,
} from '@prisma/client';
import { ConversationEntity } from 'src/domain/entities/conversation.entity';
import { RiderMapper } from './rider.mapper';
import { StableMapper } from './stable.mapper';

export class ConversationMapper {
  static toDomain(
    raw: PrismaConversation & { rider?: PrismaRider; stable?: PrismaStable },
  ): ConversationEntity {
    return new ConversationEntity(
      raw.id,
      raw.stableId,
      raw.riderId,
      raw.createdAt,
      raw.updatedAt,
      raw.stable ? StableMapper.toDomain(raw.stable) : undefined,
      raw.rider ? RiderMapper.toDomain(raw.rider) : undefined,
    );
  }
}
