import { describe, expect, it, vi } from 'vitest'
import { gameReducer } from './gameReducer'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import {
  createM11PathInitialState,
  createM11PathMidGameState,
} from '@/test/utils/createInitialState'
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
      move: { type: 'place', cardId: 'c1', row: 0, col: 0 },
    })

    expect(next.cells[0]!.cardId).toBe('c1')
    expect(next.hand).toEqual([])
    expect(next.placedCards.c1).toBe(card)
  })

  it('resetGame returns the initial M11 path state', () => {
    const midGame = createM11PathMidGameState()

    const next = gameReducer(midGame, { type: 'resetGame' })

    expect(next).toEqual(createM11PathInitialState())
  })

  it('shuffleDeck reorders the deck', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const d3 = makeCard('d3', 'blue', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)], { deck: [d1, d2, d3] })
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const next = gameReducer(state, { type: 'shuffleDeck' })

    expect(next.deck.map(card => card.id)).toEqual(['d3', 'd2', 'd1'])
    randomSpy.mockRestore()
  })

  it('returns the current state for an unknown action', () => {
    const state = createM11PathInitialState()

    const next = gameReducer(state, { type: 'unknown' } as GameAction)

    expect(next).toBe(state)
  })
})
