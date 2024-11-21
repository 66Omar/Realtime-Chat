import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { Participant } from './participant.model';
import { Conversation } from './conversation.model';
import { relations } from 'drizzle-orm';

export const Message = pgTable('messages', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ minValue: 400000 }),
  participant_id: integer('participant_id').references(() => Participant.id, {
    onDelete: 'cascade',
  }),
  conversation_id: integer('conversation_id').references(
    () => Conversation.id,
    { onDelete: 'cascade' },
  ),

  content: text('content').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const messageRelations = relations(Message, ({ one, many }) => ({
  participant: one(Participant, {
    references: [Participant.id],
    fields: [Message.participant_id],
    relationName: 'participant_messages',
  }),
  conversation: one(Conversation, {
    references: [Conversation.id],
    fields: [Message.conversation_id],
    relationName: 'conversation_messages',
  }),
}));
