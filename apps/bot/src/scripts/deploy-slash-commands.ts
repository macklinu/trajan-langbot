import { REST, Routes } from 'discord.js'
import { loadEnvironmentVariables } from '../environment.js'
import { commandsJson } from '../commands/index.js'
import { getLogger } from '../logger.js'

const logger = getLogger('deploy-slash-commands')

loadEnvironmentVariables()
  .asyncMap(async (env) => {
    logger.info('Started refreshing application (/) commands')

    return new REST()
      .setToken(env.TOKEN)
      .put(
        Routes.applicationGuildCommands(
          env.DISCORD_CLIENT_ID,
          env.DISCORD_GUILD_ID
        ),
        { body: commandsJson() }
      )
  })
  .match(
    () => {
      logger.info('Successfully reloaded application (/) commands')
    },
    (error) => {
      logger.error(error, 'Failed to reload application (/) commands')
    }
  )
