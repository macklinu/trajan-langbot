import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getTodaysScoreboard } from '@trajan/nba-api'
import { PISTONS_TEAM_ID } from '../pistons.js'

export const data = new SlashCommandBuilder()
  .setName('schedule')
  .setDescription('All things related to the Pistons schedule')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('next')
      .setDescription('Get the next game on the schedule')
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('today').setDescription("Get today's game")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('sync')
      .setDescription('Sync the schedule with the NBA API (mods only)')
  )

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand().toLowerCase()

  switch (subcommand) {
    case 'next': {
      break
    }
    case 'today': {
      const { scoreboard } = await getTodaysScoreboard()
      const pistonsGame = scoreboard.games.find(
        (game) =>
          game.homeTeam.teamId === PISTONS_TEAM_ID ||
          game.awayTeam.teamId === PISTONS_TEAM_ID
      )

      if (!pistonsGame) {
        await interaction.reply('No Pistons game today')
      } else {
        const opposingTeam =
          pistonsGame.homeTeam.teamId === PISTONS_TEAM_ID
            ? pistonsGame.awayTeam
            : pistonsGame.homeTeam

        await interaction.reply(
          `The Pistons are playing the ${opposingTeam.teamName} today`
        )
      }
      break
    }
    case 'sync': {
      break
    }
    default: {
      break
    }
  }
}
