import { Sql } from 'postgres'
import { createPostgres } from './create-postgres.js'

export class Migrator {
  private sql: Sql

  constructor(connectionString: string) {
    this.sql = createPostgres(connectionString)
  }

  async applyMigrations() {
    await this.sql.begin((sql) => [
      sql`
        CREATE TABLE IF NOT EXISTS teams (
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          team_id INTEGER NOT NULL PRIMARY KEY,
          name TEXT NOT NULL,
          city TEXT NOT NULL,
          abbreviation TEXT NOT NULL
        )
      `,
      sql`
        CREATE TABLE IF NOT EXISTS games (
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          game_id TEXT PRIMARY KEY,
          game_status TEXT NOT NULL,
          home_team_id INTEGER NOT NULL REFERENCES teams (team_id),
          visitor_team_id INTEGER NOT NULL REFERENCES teams (team_id)
        )
      `,
      sql`
        CREATE TABLE IF NOT EXISTS team_game_metadata (
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          game_id TEXT NOT NULL REFERENCES games (game_id),
          team_id INTEGER NOT NULL REFERENCES teams (team_id),
          record TEXT NOT NULL DEFAULT '0-0',
          score INTEGER NOT NULL DEFAULT 0
        )
      `,
      sql`
        ALTER TABLE IF EXISTS team_game_metadata
        DROP CONSTRAINT IF EXISTS team_game_metadata_pkey
      `,
      sql`
        ALTER TABLE IF EXISTS team_game_metadata
        ADD CONSTRAINT team_game_metadata_pkey PRIMARY KEY (game_id, team_id)
      `,
      sql`
        CREATE INDEX IF NOT EXISTS team_game_metadata_game_id_index ON team_game_metadata (game_id)
      `,
      sql`
        CREATE INDEX IF NOT EXISTS team_game_metadata_team_id_index ON team_game_metadata (team_id)
      `,
      sql`
        CREATE INDEX IF NOT EXISTS games_home_team_id_index ON games (home_team_id)
      `,
      sql`
        CREATE INDEX IF NOT EXISTS games_visitor_team_id_index ON games (visitor_team_id)
      `,
    ])
  }
}
