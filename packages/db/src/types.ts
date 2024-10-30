import { z } from 'zod'

export const GameIdSchema = z.string().brand('GameId')
export type GameId = z.infer<typeof GameIdSchema>

export const TeamIdSchema = z.string().brand('TeamId')
export type TeamId = z.infer<typeof TeamIdSchema>
