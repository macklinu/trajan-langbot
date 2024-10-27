import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/index.js'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
