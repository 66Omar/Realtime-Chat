import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { Participant } from 'src/chat/models/participant.model';

export const User = pgTable('users', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ minValue: 100000 }),
  username: varchar('username').notNull().unique(),
  avatar: text('avatar').notNull().default('/static/avatars/0.png'),
  description: text('description'),
  password: text('password').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const userRelations = relations(User, ({ many }) => ({
  participations: many(Participant, {
    relationName: 'user_participations',
  }),
}));
