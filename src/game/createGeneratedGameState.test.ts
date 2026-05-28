import { describe, expect, it } from 'vitest'
import { isSolved } from '@/game/helpers'
import { findValidArrangement } from '@/game/arrangementSolver'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { freeSeats, seatKey } from '@/game/solutionAssignment'
import { makeState } from '@/test/utils/factories'

describe('createGeneratedGameState', () => {
  it('builds a playable state with correct hand and deck sizes', () => {
    const state = createGeneratedGameState({ rows: 4, cols: 4, seed: 42 })

    expect(state.rows).toBe(4)
    expect(state.cols).toBe(4)
    expect(state.cells.every((c) => c.state === 'blocked' || c.cardId === null)).toBe(true)
    expect(state.hand).toHaveLength(3)
    expect(state.redealsLeft).toBe(4)
    expect(state.status).toBe('playing')

    const freeCount = state.cells.filter((c) => c.state === 'free').length
    expect(state.hand.length + state.deck.length).toBe(freeCount + 6)
    expect(state.deck.length).toBe(freeCount + 6 - 3)
  })

  it('supports a solver-found winning placement', () => {
    const state = createGeneratedGameState({ rows: 4, cols: 4, seed: 7 })
    const allCards = [...state.hand, ...state.deck]
    const topology = {
      rows: state.rows,
      cols: state.cols,
      cells: state.cells.map(({ row, col, state: cellState }) => ({
        row,
        col,
        state: cellState,
      })),
    }

    const arrangement = findValidArrangement(topology, allCards)
    expect(arrangement).not.toBeNull()

    const cardsById = new Map(allCards.map((c) => [c.id, c]))
    const placedCards: Record<string, (typeof allCards)[number]> = {}
    const cells = state.cells.map((cell) => {
      if (cell.state === 'blocked') return { ...cell }
      const cardId = arrangement!.get(seatKey(cell.row, cell.col))!
      const card = cardsById.get(cardId)!
      placedCards[cardId] = card
      return { ...cell, cardId }
    })

    const solved = makeState(state.rows, state.cols, cells, { placedCards })
    expect(isSolved(solved)).toBe(true)
    expect(freeSeats(topology).length).toBe(arrangement!.size)
  })
})
