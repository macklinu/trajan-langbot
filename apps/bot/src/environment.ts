import { fromThrowable } from 'neverthrow'
import { z } from 'zod'
import { UnknownError } from './errors'

const EnvironmentSchema = z.object({
  /** Discord bot token */
  TOKEN: z.string().min(1),
  /** Discord client ID */
  DISCORD_CLIENT_ID: z.string().min(1),
  /** Discord guild ID */
  DISCORD_GUILD_ID: z.string().min(1),
})

export const loadEnvironmentVariables = fromThrowable(
  () => EnvironmentSchema.parse(process.env),
  (e) => (e instanceof z.ZodError ? e : new UnknownError(e))
)
