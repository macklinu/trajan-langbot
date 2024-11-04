import type { GlobalSetupContext } from 'vitest/node'
import { createConsola } from 'consola'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

export default async function setup({ provide }: GlobalSetupContext) {
  const consola = createConsola({
    // @ts-expect-error
    fancy: true,
    formatOptions: {
      date: false,
    },
    level: 4,
  })

  consola.info('Starting postgresql test container')

  const container = await new PostgreSqlContainer('postgres:17.0')
    .withUsername('postgres')
    .withPassword(crypto.randomUUID())
    .withDatabase('test_db')
    .start()

  consola.success('Postgresql test container started')

  provide('connectionString', container.getConnectionUri())

  return async function teardown() {
    consola.info('Stopping postgresql test container')

    await container.stop()

    consola.success('Postgresql test container stopped')
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    connectionString: string
  }
}
