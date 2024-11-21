import { Inject, Injectable } from '@nestjs/common';
import {
  eq,
  and,
  not,
  desc,
  countDistinct,
  ilike,
  inArray,
  asc,
  gt,
} from 'drizzle-orm';
import { GenericQueryDto } from 'src/common/dto/offset-query.dto';
import { OffsetPaginatedResponse } from 'src/common/pagination/offset.pagination';
import { DatabaseService, DRIZZLE } from 'src/database';
import { User } from './models';
import { Conversation } from 'src/chat/models/conversation.model';
import { Participant } from 'src/chat/models/participant.model';
import { Message } from 'src/chat/models';
import { CursorQueryDto } from 'src/common/dto/cursor-query.dto';
import { CursorPagiantedResponse } from 'src/common/pagination/cursor.pagination';
import { DEFAULT_PAGE_SIZE } from 'src/common/constants';
import { userSelect } from 'src/common/query/user.query';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DatabaseService) {}

  async getUsers(queries: CursorQueryDto) {
    const limit = (queries.limit || DEFAULT_PAGE_SIZE) + 1;

    const data = await Promise.all([
      await this.db
        .select({
          ...userSelect,
          messageCount: countDistinct(Message.id),
          participationsCount: countDistinct(Participant.id),
        })
        .from(User)
        .where(queries.cursor ? gt(User.id, queries.cursor) : undefined)
        .leftJoin(Participant, eq(Participant.user_id, User.id))
        .limit(limit)
        .leftJoin(Message, eq(Message.participant_id, Participant.id))
        .orderBy(asc(User.id))
        .groupBy(User.id),
    ]);
    const pagination = new CursorPagiantedResponse(data, queries);
    return pagination.getPaginatedResponse();
  }

  async getUserSuggestions(currentUserId: number, queries: GenericQueryDto) {
    const searchQuery = (queries.q || '').trim();
    const offset = queries.offset ?? 0;
    const limit = queries.limit ?? 6;

    const usersWithSharedConversations = this.db
      .select({ id: Participant.user_id })
      .from(Participant)
      .where(
        and(
          inArray(
            Participant.conversation_id,
            this.db
              .select({ id: Conversation.id })
              .from(Conversation)
              .innerJoin(
                Participant,
                eq(Conversation.id, Participant.conversation_id),
              )
              .where(eq(Participant.user_id, currentUserId)),
          ),
          not(eq(Participant.user_id, currentUserId)),
        ),
      );

    const results = await this.db
      .select(userSelect)
      .from(User)
      .where(
        and(
          searchQuery ? ilike(User.username, `%${searchQuery}%`) : undefined,
          not(eq(User.id, currentUserId)),
          not(inArray(User.id, usersWithSharedConversations)),
        ),
      )
      .orderBy(desc(User.created_at))
      .offset(offset)
      .limit(limit);

    const count = await this.db.$count(
      User,
      and(
        searchQuery ? ilike(User.username, `%${searchQuery}%`) : undefined,
        not(eq(User.id, currentUserId)),
        not(inArray(User.id, usersWithSharedConversations)),
      ),
    );

    const pagination = new OffsetPaginatedResponse([results, count], queries);
    return pagination.getPaginatedResponse({ pageSize: limit });
  }

  async getUsersCount() {
    return await this.db.$count(User);
  }

  async getUserById(currentUserId: number) {
    return (
      await this.db
        .select(userSelect)
        .from(User)
        .where(eq(User.id, currentUserId))
        .limit(1)
    )[0];
  }
}
