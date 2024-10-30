import { http, HttpResponse } from 'msw'
import schedule from './schedule-2024-2025.json'
import boxScore from './box-score-summary-0022400114.json'
import todaysScoreboard from './todays-scoreboard-2024-10-30.json'
import { z } from 'zod'

export const handlers = [
  http.get(
    `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/:year/league/00_full_schedule.json`,
    ({ params }) => {
      const { year } = z
        .object({
          year: z.coerce.number(),
        })
        .parse(params)

      switch (year) {
        case 2024:
          return HttpResponse.json(schedule)
        default:
          return HttpResponse.json({ lscd: [] })
      }
    }
  ),
  http.get('https://stats.nba.com/stats/boxscoresummaryv3', () =>
    HttpResponse.json(boxScore)
  ),
  http.get(
    'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json',
    () => HttpResponse.json(todaysScoreboard)
  ),
]
