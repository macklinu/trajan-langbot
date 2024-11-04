import { Client, Events, GatewayIntentBits } from 'discord.js'
import { buildCommandMap } from './commands/index.js'
import { loadEnvironmentVariables } from './environment.js'
import { getLogger } from './logger.js'

const logger = getLogger('bot')

const initializeClient = (token: string) =>
  new Promise<Client<true>>((resolve, reject) => {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    })

    client.once(Events.ClientReady, resolve)
    client.on(Events.Error, reject)

    client.login(token)
  })

const setupClient = (client: Client<true>) => {
  const commandMap = buildCommandMap()

  client.on(Events.InteractionCreate, async (interaction) => {
    logger.info({ interaction }, 'Interaction received')
    if (!interaction.isChatInputCommand()) {
      return
    }

    const command = commandMap.get(interaction.commandName)
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
    () => logger.info('Client setup complete'),
    (err) => logger.error(err)
  )
