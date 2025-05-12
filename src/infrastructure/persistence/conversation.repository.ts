import { Injectable } from '@nestjs/common';
import { ConversationEntity } from 'src/domain/entities/conversation.entity';
import { IConversationRepository } from 'src/domain/interfaces/conversation.repository';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(conversation: ConversationEntity): Promise<ConversationEntity> {
    const createdConversation = await this.prisma.conversation.create({
      data: {
        stableId: conversation.stableId,
        riderId: conversation.riderId,
      },
    });

    return new ConversationEntity(
      createdConversation.id,
      createdConversation.stableId,
      createdConversation.riderId,
      createdConversation.createdAt,
      createdConversation.updatedAt,
    );
  }
}
