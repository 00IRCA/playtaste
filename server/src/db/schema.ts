import { pgTable, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const lists = pgTable('lists', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const listGames = pgTable(
  'list_games',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    listId: integer('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    igdbGameId: integer('igdb_game_id').notNull(),
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (t) => [unique().on(t.listId, t.igdbGameId)],
);
