import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: './global-setup.ts',
    env: {
      TZ: 'UTC',
    },
  },
})
