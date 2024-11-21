import { desc, sql } from 'drizzle-orm';
import { Conversation, Message, Participant } from 'src/chat/models';
import { User } from 'src/user/models';

export const participantsSelect = () => {
  return sql`
            array_agg(DISTINCT jsonb_build_object(
              'id', ${Participant.id},
              'user_id', ${Participant.user_id},
              'conversation_id', ${Participant.conversation_id},
              'user', jsonb_build_object(
                'id', ${User.id},
                'username', ${User.username},
                'avatar', ${User.avatar},
                'description', ${User.description},
                'created_at', ${User.created_at}::timestamptz
              )
            ))
          `.as('participants');
};

export const messageParticipantSelect = () => {
  return sql`
          jsonb_build_object(
            'id', ${Participant.id},
            'user_id', ${Participant.user_id},
            'user', jsonb_build_object(
              'id', ${User.id},
              'username', ${User.username},
              'avatar', ${User.avatar},
              'description', ${User.description}
            )
        )`.as('participant');
};

export const unreadCountSelect = (user_id: number) => {
  return sql<number>`
            COALESCE((
              SELECT COUNT(*)
              FROM ${Message}
              WHERE ${Message.conversation_id} = ${Conversation.id}
              AND ${Message.created_at} > COALESCE(
                (SELECT ${Message.created_at}
                FROM ${Message}
                WHERE ${Message.id} = (
                  SELECT ${Participant.last_read_message_id}
                  FROM ${Participant}
                  WHERE ${Participant.conversation_id} = ${Conversation.id}
                  AND ${Participant.user_id} = ${user_id}
                )),
                ${Conversation.created_at}
              )
            ), 0)
          `
    .mapWith(Number)
    .as('unread_count');
};

export const lastMessageSelect = () => {
  return sql`
        COALESCE(
          (
            SELECT jsonb_build_object(
              'id', ${Message.id},
              'content', ${Message.content},
              'created_at', ${Message.created_at},
              'participant', (
                SELECT jsonb_build_object(
                  'id', ${Participant.id},
                  'user', jsonb_build_object(
                    'id', ${User.id},
                    'username', ${User.username},
                    'avatar', ${User.avatar}
                  )
                )
                FROM ${Participant}
                LEFT JOIN ${User} ON ${User.id} = ${Participant.user_id}
                WHERE ${Participant.id} = ${Message.participant_id}
                LIMIT 1
              )
            )
            FROM ${Message}
            WHERE ${Message.conversation_id} = ${Conversation.id}
            ORDER BY ${Message.created_at} DESC
            LIMIT 1
          ),
          null
        )
      `.as('last_message');
};

export const conversationOrderBy = () => {
  return desc(sql`COALESCE(
            (SELECT ${Message.created_at}
            FROM ${Message}
            WHERE ${Message.conversation_id} = ${Conversation.id}
            ORDER BY ${Message.created_at} DESC
            LIMIT 1),
            ${Conversation.created_at}
          )`);
};
