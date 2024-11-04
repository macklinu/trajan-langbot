import ky from 'ky'
import { z } from 'zod'
import { Game, parseGames } from './parse-games.js'

const yearSchema = () =>
  z
    .number()
    .int()
    .min(2020)
    .max(new Date().getFullYear() + 1)

export const getSchedule = async (
  options: {
    year?: number
  } = {}
): Promise<Game[]> => {
  const optionsSchema = z.object({
    year: yearSchema().optional().default(new Date().getFullYear()),
  })

  const { year } = optionsSchema.parse(options)

  const json = await ky
    .get(
      `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/${year}/league/00_full_schedule.json`
    )
    .json()

  return parseGames(json)
}

export const getGameBoxScore = (options: {
  gameId: string
}): Promise<unknown> => {
  return ky
    .get(
      `https://stats.nba.com/stats/boxscoresummaryv3?GameID=${options.gameId}&LeagueID=00`,
      {
        headers: {
          referer: 'https://www.nba.com/',
        },
      }
    )
    .json()
}

export const getTodaysScoreboard = () => {
  return ky
    .get(
      'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json'
    )
    .json()
    .then((data) =>
      z
        .object({
          scoreboard: z.object({
            gameDate: z.string(),
            games: z.array(
              z
                .object({
                  gameId: z.string(),
                  homeTeam: z.object({
                    teamId: z.number(),
                    teamName: z.string(),
                    teamTricode: z.string(),
                    wins: z.number(),
                    losses: z.number(),
                  }),
                  awayTeam: z.object({
                    teamId: z.number(),
                    teamName: z.string(),
                    teamTricode: z.string(),
                    wins: z.number(),
                    losses: z.number(),
                  }),
                })
                .passthrough()
            ),
          }),
        })
        .parse(data)
    )
}
