import { Client, Events, GatewayIntentBits } from 'discord.js'
import { z } from 'zod'
import { fromThrowable } from 'neverthrow'
import { commands } from './commands/index.js'

class UnknownError extends Error {
  constructor(error: unknown) {
    const cause = error instanceof Error ? error : undefined
    const message = error instanceof Error ? error.message : 'Unknown'
    super(message, { cause })
    this.name = 'UnknownError'
  }
}

const loadEnvironmentVariables = fromThrowable(
  () =>
    z
      .object({
        TOKEN: z.string().min(1),
      })
      .parse(process.env),
  (e) => (e instanceof z.ZodError ? e : new UnknownError(e))
)

const initializeClient = (token: string) =>
  new Promise<Client<true>>((resolve, reject) => {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds],
    })

    client.once(Events.ClientReady, resolve)
    client.on(Events.Error, reject)

    client.login(token)
  })

const commandRegistry = new Map(
  Object.values(commands).map((command) => [command.data.name, command])
)

const setupClient = (client: Client<true>) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return
    }

    const command = commandRegistry.get(interaction.commandName)
    if (!command) {
      return
    }

    await command.execute(interaction)
  })

  return client
}

loadEnvironmentVariables()
  .asyncMap((env) => initializeClient(env.TOKEN))
  .map((client) => setupClient(client))
  .match(
    () => console.log('Client setup complete'),
    (err) => console.error(err)
  )
