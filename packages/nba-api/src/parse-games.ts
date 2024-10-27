import { z } from 'zod'
import { parse, isValid } from 'date-fns'

const TeamSchema = z
  .object({
    /** Team ID */
    tid: z.number(),
    /** Team record at the time of game start or finish if game is completed. */
    re: z.string().regex(/^\d+-\d+$/),
    /** Team abbreviation. */
    ta: z.string(),
    /** Team name. */
    tn: z.string(),
    /** Team city. */
    tc: z.string(),
    /** Score of game if game is in progress. Will default to 0. */
    s: z.coerce.number().optional().default(0),
  })
  .transform((team) => ({
    teamId: team.tid,
    abbreviation: team.ta,
    city: team.tc,
    name: team.tn,
    record: team.re,
    score: team.s,
  }))

export const GameStatus = {
  Scheduled: '1',
  InProgress: '2',
  Final: '3',
} as const

const GameSchema = z
  .object({
    /** Game ID. */
    gid: z.string(),
    /** Game code (some alternative identifier). */
    gcode: z.string(),
    /** Not sure. */
    seri: z.string(),
    /** Not sure. */
    is: z.number(),
    /** Game date in UTC timezone. */
    gdtutc: z.string().date(),
    /** Game time (HH:mm) in UTC timezone. */
    utctm: z
      .string()
      .refine((time) => isValid(parse(time, 'HH:mm', new Date()))),
    /** Game postponed status? (guessing) */
    ppdst: z.string(),
    /** Game sequence (not sure what it's used for). */
    seq: z.number(),
    /** Arena name. */
    an: z.string(),
    /** Arena city. */
    ac: z.string(),
    /** Arena state. */
    as: z.string(),
    /** Game status. */
    st: z.enum([GameStatus.Scheduled, GameStatus.InProgress, GameStatus.Final]),
    /** Game status text. */
    stt: z.string(),
    /** Visitor team. */
    v: TeamSchema,
    /** Home team. */
    h: TeamSchema,
  })
  .transform((game) => ({
    gameId: game.gid,
    gameCode: game.gcode,
    series: game.seri,
    gameDate: game.gdtutc,
    gameTime: game.utctm,
    gameStatus: game.st,
    gameStatusText: game.stt,
    visitor: game.v,
    home: game.h,
    arena: {
      name: game.an,
      city: game.ac,
      state: game.as,
    },
  }))

const ScheduleSchema = z.object({
  lscd: z.array(
    z.object({
      mscd: z.object({
        mon: z.string(),
        g: z.array(GameSchema),
      }),
    })
  ),
})

export function parseGames(data: unknown) {
  const schedule = ScheduleSchema.parse(data)
  return schedule.lscd.flatMap((months) => months.mscd.g)
}
