import { test, expect, beforeEach, inject, afterEach } from 'vitest'
import { Database } from './index.js'
import { Migrator } from './migrator.js'
import { createPostgres } from './create-postgres.js'

const database = () => new Database(inject('connectionString'))
const postgres = () => createPostgres(inject('connectionString'))
const migrator = () => new Migrator(inject('connectionString'))
const resetDatabase = () =>
  postgres().begin(async (sql) => {
    await sql`TRUNCATE TABLE team_game_metadata;`

    await sql`DELETE FROM games;`

    await sql`DELETE FROM teams;`
  })

const timestamps = () => ({
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
})

beforeEach(async () => {
  await migrator().applyMigrations()
})

afterEach(async () => {
  await resetDatabase()
})

test('createTeam', async () => {
  const team = {
    teamId: 1,
    name: 'Golden State Warriors',
    city: 'San Francisco',
    abbreviation: 'GSW',
  }

  const createdTeam = await database().createTeam(team)

  expect(createdTeam).toEqual({
    ...timestamps(),
    ...team,
  })
})

test('upsertGames ensures game, team, and game_team_metadata are created', async () => {
  const sql = postgres()

  await database().upsertGames([
    {
      arena: {
        city: 'Detroit',
        name: 'Little Caesars Arena',
        state: 'MI',
      },
      gameCode: '20250101/ORLDET',
      gameDate: '2025-01-02',
      gameId: '0022400455',
      gameStatus: '1',
      gameStatusText: '7:00 pm ET',
      gameTime: '00:00',
      home: {
        abbreviation: 'DET',
        city: 'Detroit',
        name: 'Pistons',
        teamId: 1610612765,
        record: '0-2',
        score: 0,
      },
      series: '',
      visitor: {
        abbreviation: 'ORL',
        city: 'Orlando',
        name: 'Magic',
        teamId: 1610612753,
        record: '2-0',
        score: 0,
      },
    },
  ])

  await expect(sql`
    SELECT
      *
    FROM
      teams;
  `).resolves.toEqual([
    {
      ...timestamps(),
      abbreviation: 'ORL',
      city: 'Orlando',
      name: 'Magic',
      teamId: 1610612753,
    },
    {
      ...timestamps(),
      abbreviation: 'DET',
      city: 'Detroit',
      name: 'Pistons',
      teamId: 1610612765,
    },
  ])

  await expect(sql`
    SELECT
      *
    FROM
      games;
  `).resolves.toEqual([
    {
      ...timestamps(),
      gameId: '0022400455',
      gameStatus: '1',
      homeTeamId: 1610612765,
      visitorTeamId: 1610612753,
    },
  ])

  await expect(sql`
    SELECT
      *
    FROM
      team_game_metadata
  `).resolves.toEqual([
    {
      ...timestamps(),
      gameId: '0022400455',
      record: '2-0',
      score: 0,
      teamId: 1610612753,
    },
    {
      ...timestamps(),
      gameId: '0022400455',
      record: '0-2',
      score: 0,
      teamId: 1610612765,
    },
  ])
})
