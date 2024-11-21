import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { Message } from './message.model';
import { Participant } from './participant.model';

export const Conversation = pgTable('conversations', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ minValue: 200000 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const conversationRelations = relations(Conversation, ({ many }) => ({
  messages: many(Message, {
    relationName: 'conversation_messages',
  }),
  participants: many(Participant, {
    relationName: 'conversation_participants',
  }),
}));
