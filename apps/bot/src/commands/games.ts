import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

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
