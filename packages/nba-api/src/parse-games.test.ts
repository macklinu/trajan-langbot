import { test, expect } from 'vitest'
import schedule from './mocks/schedule-2024-2025.json'
import { GameStatus, parseGames } from './parse-games'

test('can parse 2024-2025 schedule', () => {
  expect(parseGames(schedule)).toEqual(expect.any(Array))
})

test('handles scheduled games', () => {
  const game = parseGames(schedule).find(
    (game) => game.gameStatus === GameStatus.Scheduled
  )

  expect(game).toEqual({
    arena: {
      city: 'Detroit',
      name: 'Little Caesars Arena',
      state: 'MI',
    },
    gameCode: '20250101/ORLDET',
    gameDate: '2025-01-02',
    gameId: '0022400455',
    gameStatus: '1',
    gameStatusText: '7:00 pm ET',
    gameTime: '00:00',
    home: {
      abbreviation: 'DET',
      city: 'Detroit',
      name: 'Pistons',
      teamId: 1610612765,
      record: '0-2',
      score: 0,
    },
    series: '',
    visitor: {
      abbreviation: 'ORL',
      city: 'Orlando',
      name: 'Magic',
      teamId: 1610612753,
      record: '2-0',
      score: 0,
    },
  })
})

test('handles in-progress games', () => {
  const game = parseGames(schedule).find(
    (game) => game.gameStatus === GameStatus.InProgress
  )

  expect(game).toEqual({
    gameId: '0022400084',
    gameCode: '20241025/GSWUTA',
    series: '',
    gameDate: '2024-10-26',
    gameTime: '01:30',
    gameStatus: '2',
    gameStatusText: '3rd Qtr',
    visitor: {
      teamId: 1610612744,
      abbreviation: 'GSW',
      city: 'Golden State',
      name: 'Warriors',
      record: '1-0',
      score: 88,
    },
    home: {
      teamId: 1610612762,
      abbreviation: 'UTA',
      city: 'Utah',
      name: 'Jazz',
      record: '0-1',
      score: 60,
    },
    arena: { name: 'Delta Center', city: 'Salt Lake City', state: 'UT' },
  })
})

test('handles final games', () => {
  const game = parseGames(schedule).find(
    (game) => game.gameStatus === GameStatus.Final
  )

  expect(game).toEqual({
    gameId: '0012400001',
    gameCode: '20241004/BOSDEN',
    series: '',
    gameDate: '2024-10-04',
    gameTime: '16:00',
    gameStatus: '3',
    gameStatusText: 'Final',
    visitor: {
      teamId: 1610612738,
      abbreviation: 'BOS',
      city: 'Boston',
      name: 'Celtics',
      record: '1-0',
      score: 107,
    },
    home: {
      teamId: 1610612743,
      abbreviation: 'DEN',
      city: 'Denver',
      name: 'Nuggets',
      record: '0-1',
      score: 103,
    },
    arena: { name: 'Etihad Arena', city: 'Abu Dhabi', state: '' },
  })
})
