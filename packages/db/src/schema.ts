import {
  integer,
  serial,
  timestamp,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const teamsTable = pgTable(
  'teams',
  {
    id: serial().primaryKey(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
    teamId: integer().notNull(),
    name: text().notNull(),
    city: text().notNull(),
    abbreviation: text().notNull(),
  },
  (table) => ({
    teamsTeamIdIndex: uniqueIndex('teams_team_id_index').on(table.teamId),
  })
)

export const gamesTable = pgTable(
  'games',
  {
    id: serial().primaryKey(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
    gameId: text().notNull(),
    homeTeamId: integer().notNull(),
    visitorTeamId: integer().notNull(),
  },
  (table) => ({
    gamesGameIdIndex: uniqueIndex('games_game_id_index').on(table.gameId),
  })
)
