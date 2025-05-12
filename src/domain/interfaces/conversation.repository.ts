import { ConversationEntity } from '../entities/conversation.entity';

export interface IConversationRepository {
  create(conversation: ConversationEntity): Promise<ConversationEntity>;
}
