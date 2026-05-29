import { describe, expect, it, vi } from 'vitest'
import { gameReducer } from './gameReducer'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import {
  createPathInitialState,
  PATH_SOLUTION,
} from '@/test/utils/pathLevel'
import { createRingInitialState } from '@/test/utils/ringLevel'
import { createCalibratedGeneratedGameState } from '@/game/createGameStateFromMesa'
import { findValidArrangement } from '@/game/arrangementSolver'
import type { GameAction } from './types'

describe('gameReducer', () => {
  it('selectCard sets selectedCardId', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [card] })

    const next = gameReducer(state, { type: 'selectCard', cardId: 'c1' })

    expect(next.selectedCardId).toBe('c1')
  })

  it('deselectCard clears selectedCardId', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = gameReducer(
      makeState(1, 1, [makeCell(0, 0)], { hand: [card] }),
      { type: 'selectCard', cardId: 'c1' },
    )

    const next = gameReducer(state, { type: 'deselectCard' })

    expect(next.selectedCardId).toBeNull()
  })

  it('placeCard delegates to applyMove', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [card] })

    const next = gameReducer(state, {
      type: 'placeCard',
      move: { cardId: 'c1', row: 0, col: 0 },
    })

    expect(next.cells[0]!.cardId).toBe('c1')
    expect(next.hand).toEqual([])
    expect(next.placedCards.c1).toBe(card)
  })

  it('resetGame returns the initial M11 path state', () => {
    const modified = gameReducer(createPathInitialState(), {
      type: 'placeCard',
      move: PATH_SOLUTION[0]!,
    })

    const next = gameReducer(modified, { type: 'resetGame' })

    expect(next).toEqual(createPathInitialState())
  })

  it('reDeal returns hand cards to the pool and decrements redealsLeft', () => {
    const hand = [
      makeCard('h1', 'red', 'blue'),
      makeCard('h2', 'green', 'yellow'),
      makeCard('h3', 'blue', 'green'),
    ]
    const deck = [makeCard('d1', 'yellow', 'red'), makeCard('d2', 'red', 'green')]
    const state = { ...makeState(1, 1, [makeCell(0, 0)], { hand, deck }), redealsLeft: 4 }
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const next = gameReducer(state, { type: 'reDeal' })

    expect(next.hand.map(card => card.id)).toEqual(['d2', 'h1', 'h2'])
    expect(next.deck.map(card => card.id)).toEqual(['h3', 'd1'])
    expect(next.redealsLeft).toBe(3)
    randomSpy.mockRestore()
  })

  it('swapCard swaps cards on the board while playing', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'blue', 'yellow')
    const state = makeState(
      1,
      2,
      [makeCell(0, 0, { cardId: 'left' }), makeCell(0, 1, { cardId: 'right' })],
      { placedCards: { left, right }, selectedCardId: 'left' },
    )

    const next = gameReducer(state, {
      type: 'swapCard',
      move: { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } },
    })

    expect(next.cells[0]!.cardId).toBe('right')
    expect(next.cells[1]!.cardId).toBe('left')
    expect(next.selectedCardId).toBeNull()
  })

  it('swapCard is ignored when game is already won or lost', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'blue', 'yellow')
    const wonState = makeState(
      1,
      2,
      [makeCell(0, 0, { cardId: 'left' }), makeCell(0, 1, { cardId: 'right' })],
      { placedCards: { left, right }, status: 'won' },
    )
    const lostState = makeState(
      1,
      2,
      [makeCell(0, 0, { cardId: 'left' }), makeCell(0, 1, { cardId: 'right' })],
      { placedCards: { left, right }, status: 'lost' },
    )

    expect(gameReducer(wonState, {
      type: 'swapCard',
      move: { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } },
    })).toBe(wonState)
    expect(gameReducer(lostState, {
      type: 'swapCard',
      move: { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } },
    })).toBe(lostState)
  })

  it('returns the current state for an unknown action', () => {
    const state = createPathInitialState()

    const next = gameReducer(state, { type: 'unknown' } as GameAction)

    expect(next).toBe(state)
  })

  describe('changeLevel', () => {
    it('changeLevel to path returns a fresh path state', () => {
      const modified = gameReducer(createRingInitialState(), {
        type: 'selectCard',
        cardId: 'ring-p0',
      })

      const next = gameReducer(modified, { type: 'changeLevel', level: 'path' })

      expect(next).toEqual(createPathInitialState())
    })

    it('changeLevel to ring returns a fresh ring state', () => {
      const modified = gameReducer(createPathInitialState(), {
        type: 'placeCard',
        move: PATH_SOLUTION[0]!,
      })

      const next = gameReducer(modified, { type: 'changeLevel', level: 'ring' })

      expect(next).toEqual(createRingInitialState())
    })

    it('changeLevel to generated uses difficultyTarget for calibrated mesas', () => {
      const next = gameReducer(createPathInitialState(), {
        type: 'changeLevel',
        level: 'generated',
        difficultyTarget: 5,
      })

      const expected = createCalibratedGeneratedGameState(5, { seed: 42, pinnedCount: 1 })
      expect(next).toEqual(expected)

      const topology = {
        rows: next.rows,
        cols: next.cols,
        cells: next.cells.map(({ row, col, state }) => ({ row, col, state })),
      }
      expect(findValidArrangement(topology, [...next.hand, ...next.deck])).not.toBeNull()
    })

    it('changeLevel to generated defaults to difficulty 3', () => {
      const withDefault = gameReducer(createPathInitialState(), {
        type: 'changeLevel',
        level: 'generated',
      })
      const withExplicit = gameReducer(createPathInitialState(), {
        type: 'changeLevel',
        level: 'generated',
        difficultyTarget: 3,
      })

      expect(withDefault).toEqual(withExplicit)
    })

    it('changeLevel clears in-progress play from the previous table', () => {
      const midGame = gameReducer(createPathInitialState(), {
        type: 'placeCard',
        move: PATH_SOLUTION[0]!,
      })

      const next = gameReducer(midGame, { type: 'changeLevel', level: 'ring' })

      expect(next.cells.every((cell) => cell.cardId === null)).toBe(true)
      expect(next.placedCards).toEqual({})
      expect(next.selectedCardId).toBeNull()
      expect(next.status).toBe('playing')
      expect(next.redealsLeft).toBe(4)
    })
  })
})
