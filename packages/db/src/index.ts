import { Sql } from 'postgres'
import { z } from 'zod'
import { createPostgres } from './create-postgres.js'

const TeamSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  teamId: z.number().positive(),
  name: z.string().min(1),
  city: z.string().min(1),
  abbreviation: z.string().min(1),
})

const CreateTeamSchema = TeamSchema.omit({
  createdAt: true,
  updatedAt: true,
})

export class Database {
  private sql: Sql

  constructor(connectionString: string) {
    this.sql = createPostgres(connectionString)
  }

  async createTeam({
    teamId,
    name,
    city,
    abbreviation,
  }: z.infer<typeof CreateTeamSchema>) {
    const [row] = await this.sql`
      INSERT INTO
        teams (team_id, name, city, abbreviation)
      VALUES
        (
          ${teamId},
          ${name},
          ${city},
          ${abbreviation}
        )
      RETURNING
        *
    `

    return TeamSchema.parse(row)
  }

  async upsertGames(
    games: {
      gameId: string
      gameDate: string
      gameTime: string
      gameStatus: string
      visitor: {
        teamId: number
        abbreviation: string
        city: string
        name: string
        record: string
        score: number
      }
      home: {
        teamId: number
        abbreviation: string
        city: string
        name: string
        record: string
        score: number
      }
      [key: string]: unknown
    }[]
  ) {
    return this.sql.begin(async (sql) => {
      return Promise.all(
        games.flatMap((game) => [
          sql`
            INSERT INTO
              teams (team_id, name, city, abbreviation)
            VALUES
              (
                ${game.visitor.teamId},
                ${game.visitor.name},
                ${game.visitor.city},
                ${game.visitor.abbreviation}
              )
            ON CONFLICT (team_id) DO NOTHING
            RETURNING
              *
          `,
          sql`
            INSERT INTO
              teams (team_id, name, city, abbreviation)
            VALUES
              (
                ${game.home.teamId},
                ${game.home.name},
                ${game.home.city},
                ${game.home.abbreviation}
              )
            ON CONFLICT (team_id) DO NOTHING
            RETURNING
              *
          `,
          sql`
            INSERT INTO
              games (
                game_id,
                game_status,
                home_team_id,
                visitor_team_id
              )
            VALUES
              (
                ${game.gameId},
                ${game.gameStatus},
                ${game.home.teamId},
                ${game.visitor.teamId}
              )
            ON CONFLICT (game_id) DO NOTHING
            RETURNING
              *
          `,
          sql`
            INSERT INTO
              team_game_metadata (game_id, team_id, record, score)
            VALUES
              (
                ${game.gameId},
                ${game.visitor.teamId},
                ${game.visitor.record},
                ${game.visitor.score}
              )
            ON CONFLICT (game_id, team_id) DO
            UPDATE
            SET
              record = EXCLUDED.record,
              score = EXCLUDED.score
          `,
          sql`
            INSERT INTO
              team_game_metadata (game_id, team_id, record, score)
            VALUES
              (
                ${game.gameId},
                ${game.home.teamId},
                ${game.home.record},
                ${game.home.score}
              )
            ON CONFLICT (game_id, team_id) DO
            UPDATE
            SET
              record = EXCLUDED.record,
              score = EXCLUDED.score
          `,
        ])
      )
    })
  }

  getTeams() {
    return this.sql`
      SELECT
        *
      FROM
        teams;
    `
  }
}

export * from './migrator.js'
