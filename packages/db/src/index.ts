import { drizzle } from 'drizzle-orm/libsql/node'
import * as schema from './schema.js'

export class Client {
  private db: ReturnType<typeof drizzle>

  constructor(url: string) {
    this.db = drizzle({ connection: { url }, schema })
  }
}
