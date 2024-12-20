import { pino } from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export const getLogger = (name: string) => logger.child({ name })