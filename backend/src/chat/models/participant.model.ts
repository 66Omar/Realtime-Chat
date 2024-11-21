import { AnyPgColumn, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { User } from 'src/user/models';
import { Conversation } from './conversation.model';
import { Message } from './message.model';
import { relations } from 'drizzle-orm';

export const Participant = pgTable('participants', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ minValue: 300000 }),
  user_id: integer('user_id')
    .references(() => User.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  conversation_id: integer('conversation_id')
    .references(() => Conversation.id, { onDelete: 'cascade' })
    .notNull(),
  last_read_message_id: integer('last_message_id').references(
    (): AnyPgColumn => Message.id,
    {
      onDelete: 'set null',
    },
  ),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const participantRelations = relations(Participant, ({ one, many }) => ({
  user: one(User, {
    references: [User.id],
    fields: [Participant.user_id],
    relationName: 'user_participations',
  }),
  conversation: one(Conversation, {
    references: [Conversation.id],
    fields: [Participant.conversation_id],
    relationName: 'conversation_participants',
  }),
  last_read_message: one(Message, {
    references: [Message.id],
    fields: [Participant.last_read_message_id],
    relationName: 'participant_last_read_message',
  }),
}));
