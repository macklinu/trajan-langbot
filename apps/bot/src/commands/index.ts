import * as games from './games.js'
import * as ping from './ping.js'

export const commands = () => [games, ping]

export const commandsJson = () =>
  commands().map((command) => command.data.toJSON())
