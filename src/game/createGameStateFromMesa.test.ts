import { describe, expect, it } from 'vitest'
import { findValidArrangement } from '@/game/arrangementSolver'
import { isSolved } from '@/game/helpers'
import {
  createCalibratedGeneratedGameState,
  createGameStateFromMesa,
} from '@/game/createGameStateFromMesa'
import { seatKey } from '@/game/solutionAssignment'
import { makeState } from '@/test/utils/factories'

describe('createGameStateFromMesa', () => {
  it('builds playable state from a generated mesa', () => {
    const state = createCalibratedGeneratedGameState(3, { seed: 7, pinnedCount: 0 })
    const topology = {
      rows: state.rows,
      cols: state.cols,
      cells: state.cells.map(({ row, col, state: cellState }) => ({
        row,
        col,
        state: cellState,
      })),
    }

    expect(state.status).toBe('playing')
    expect(state.hand).toHaveLength(3)
    expect(findValidArrangement(topology, [...state.hand, ...state.deck])).not.toBeNull()
  })

  it('createCalibratedGeneratedGameState is deterministic for the same difficulty and seed', () => {
    const a = createCalibratedGeneratedGameState(2, { seed: 99, pinnedCount: 0 })
    const b = createCalibratedGeneratedGameState(2, { seed: 99, pinnedCount: 0 })

    expect(a.cells).toEqual(b.cells)
    expect(a.hand).toEqual(b.hand)
    expect(a.deck).toEqual(b.deck)
  })

  it('supports solver-found winning placement with pinned cells', () => {
    const state = createCalibratedGeneratedGameState(4, { seed: 11, pinnedCount: 2 })
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

    const fixedBySeat = new Map(
      state.cells
        .filter((c) => c.state === 'pinned')
        .map((c) => [seatKey(c.row, c.col), state.placedCards[c.cardId!]!] as const),
    )
    const arrangement = findValidArrangement(topology, allCards, fixedBySeat)
    expect(arrangement).not.toBeNull()

    const cardsById = new Map(allCards.map((c) => [c.id, c]))
    const placedCards = { ...state.placedCards }
    const cells = state.cells.map((cell) => {
      if (cell.state === 'blocked' || cell.state === 'pinned') return { ...cell }
      const cardId = arrangement!.get(seatKey(cell.row, cell.col))!
      const card = cardsById.get(cardId)!
      placedCards[cardId] = card
      return { ...cell, cardId }
    })

    const solved = makeState(state.rows, state.cols, cells, { placedCards })
    expect(isSolved(solved)).toBe(true)
    const playableSeatCount = state.cells.filter(
      (c) => c.state === 'free' || c.state === 'pinned',
    ).length
    expect(arrangement!.size).toBe(playableSeatCount)
  })
})
