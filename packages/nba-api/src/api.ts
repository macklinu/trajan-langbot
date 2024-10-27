import ky from 'ky'
import { z } from 'zod'
import { parseGames } from './parse-games.js'

const yearSchema = () =>
  z
    .number()
    .int()
    .min(2020)
    .max(new Date().getFullYear() + 1)

export const getSchedule = async (options: { year?: number }) => {
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
