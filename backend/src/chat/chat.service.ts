import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { aliasedTable, exists, getTableColumns, lt, ne } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { and, eq, desc } from 'drizzle-orm';
import { DEFAULT_PAGE_SIZE } from 'src/common/constants';
import { GenericQueryDto } from 'src/common/dto/offset-query.dto';
import { DatabaseService, DRIZZLE } from 'src/database';
import { Conversation } from './models/conversation.model';
import { Participant } from './models/participant.model';
import { User } from 'src/user/models';
import { Message } from './models/message.model';
import { OffsetPaginatedResponse } from 'src/common/pagination/offset.pagination';
import { CursorQueryDto } from 'src/common/dto/cursor-query.dto';
import { CursorPagiantedResponse } from 'src/common/pagination/cursor.pagination';
import {
  conversationOrderBy,
  lastMessageSelect,
  messageParticipantSelect,
  participantsSelect,
  unreadCountSelect,
} from 'src/common/query/conversation.query';
import { UpdateSeenDto } from './dto/update-seen.dto';

@Injectable()
export class ChatService {
  constructor(@Inject(DRIZZLE) private readonly db: DatabaseService) {}

  genericConversationQuery(currentUserId: number) {
    return this.db
      .select({
        id: Conversation.id,
        created_at: Conversation.created_at,
        participants: participantsSelect(),
        unread_count: unreadCountSelect(currentUserId),
        last_message: lastMessageSelect(),
      })
      .from(Conversation)
      .leftJoin(
        Participant,
        and(
          eq(Participant.conversation_id, Conversation.id),
          ne(Participant.user_id, currentUserId),
        ),
      )
      .leftJoin(User, eq(User.id, Participant.user_id))
      .leftJoin(Message, eq(Message.id, Participant.last_read_message_id))
      .groupBy(Conversation.id, User.id);
  }

  async getActiveConversations(
    currentUserId: number,
    queries: GenericQueryDto,
  ) {
    const offset = queries.offset ?? 0;
    const limit = queries.limit ?? DEFAULT_PAGE_SIZE;
    const AllParticipants = aliasedTable(Participant, 'all_participants');

    const [conversations, totalCount] = await Promise.all([
      this.genericConversationQuery(currentUserId)
        .orderBy(conversationOrderBy())
        .leftJoin(
          AllParticipants,
          eq(AllParticipants.conversation_id, Conversation.id),
        )
        .where(eq(AllParticipants.user_id, currentUserId))
        .limit(limit)
        .offset(offset),

      this.db
        .select({ count: count() })
        .from(Conversation)
        .leftJoin(
          AllParticipants,
          eq(AllParticipants.conversation_id, Conversation.id),
        )
        .where(eq(AllParticipants.user_id, currentUserId)),
    ]);

    const pagination = new OffsetPaginatedResponse(
      [conversations, totalCount[0].count],
      queries,
    );
    return pagination.getPaginatedResponse();
  }

  async startConversation(currentUserId: number, other_user_id: number) {
    const participantIds = [currentUserId, other_user_id];
    const createdConversation = await this.db.transaction(async (tx) => {
      const newConversation = await tx
        .insert(Conversation)
        .values({})
        .returning();

      await tx.insert(Participant).values(
        participantIds.map((id) => ({
          user_id: id,
          conversation_id: newConversation[0].id,
        })),
      );

      return newConversation[0];
    });

    return createdConversation;
  }

  async getMessages(
    currentUserId: number,
    conversation_id: number,
    queries: CursorQueryDto,
  ) {
    const limit = (queries.limit ?? DEFAULT_PAGE_SIZE) + 1;

    const messages = await this.db
      .select({
        ...getTableColumns(Message),
        participant: messageParticipantSelect(),
      })
      .from(Message)
      .where(
        and(
          exists(
            this.db
              .select({ id: Participant.id })
              .from(Participant)
              .where(eq(Participant.user_id, currentUserId)),
          ),
          eq(Message.conversation_id, conversation_id),
          queries.cursor ? lt(Message.id, queries.cursor) : undefined,
        ),
      )
      .leftJoin(Participant, eq(Participant.id, Message.participant_id))
      .leftJoin(User, eq(User.id, Participant.user_id))
      .orderBy(desc(Message.id))
      .limit(limit)
      .$dynamic();

    const pagination = new CursorPagiantedResponse([messages], queries);

    return pagination.getPaginatedResponse();
  }

  async createMessage(message: {
    content: string;
    conversation_id: number;
    participant_id: number;
  }) {
    const createdMessage = (
      await this.db.insert(Message).values(message).returning()
    )[0];
    return createdMessage;
  }

  async updateSeen(currentUserId: number, updateSeenDto: UpdateSeenDto) {
    const updatedParticipant = await this.db
      .update(Participant)
      .set({ last_read_message_id: updateSeenDto.message_id })
      .where(
        and(
          eq(Participant.conversation_id, updateSeenDto.conversation_id),
          eq(Participant.user_id, currentUserId),
        ),
      )
      .returning();
    if (!updatedParticipant.length)
      throw new BadRequestException('Invalid seen update');
    return updatedParticipant[0];
  }

  async getParticipantsByConversation(
    conversation_id: number,
  ): Promise<(typeof Participant.$inferSelect)[]> {
    return await this.db.query.Participant.findMany({
      with: {
        user: {
          columns: {
            id: true,
            avatar: true,
            username: true,
            created_at: true,
          },
        },
      },
      where: eq(Participant.conversation_id, conversation_id),
    });
  }
}
