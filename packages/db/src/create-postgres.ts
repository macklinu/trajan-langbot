import postgres from 'postgres'
import { noop } from './noop'

export const createPostgres = (connectionString: string): postgres.Sql =>
  postgres(connectionString, {
    transform: postgres.camel,
    onnotice: noop,
  })
