import { expect, test, vi } from 'vitest'
import { getSchedule, getGameBoxScore, getTodaysScoreboard } from './api'
import { z } from 'zod'

test('can get schedule for current year', async () => {
  vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

  await expect(getSchedule({ year: 2024 })).resolves.toEqual(expect.any(Array))
})

test('can get schedule for current year + 1', async () => {
  vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

  await expect(getSchedule({ year: 2025 })).resolves.toEqual(expect.any(Array))
})

test('cannot get schedule two or more years in advance', async () => {
  vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

  await expect(getSchedule({ year: 2026 })).rejects.toThrowError(
    expect.any(z.ZodError)
  )
})

test('getGameBoxScore returns an object', async () => {
  await expect(getGameBoxScore({ gameId: '0022400114' })).resolves.toEqual(
    expect.any(Object)
  )
})

test('getTodaysScoreboard returns object', async () => {
  await expect(getTodaysScoreboard()).resolves.toEqual(expect.any(Object))
})
