import postgres from 'postgres'
import { noop } from './noop.js'

export const createPostgres = (connectionString: string): postgres.Sql =>
  postgres(connectionString, {
    transform: postgres.camel,
    onnotice: noop,
  })
