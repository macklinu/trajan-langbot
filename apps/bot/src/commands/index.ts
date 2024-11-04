import * as pistons from './pistons.js'

const commands = () => [pistons]

export const buildCommandMap = () =>
  new Map(commands().map((command) => [command.data.name, command]))

export const commandsJson = () =>
  commands().map((command) => command.data.toJSON())
