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
    expect(state.cells.every((c) => c.state !== 'free' || c.cardId === null)).toBe(true)
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
    expect(freeSeats(topology).length).toBe(arrangement!.size)
  })

  it('is deterministic for pinned seats with the same seed', () => {
    const params = { rows: 4, cols: 4, seed: 42, pinnedCount: 2 }
    const a = createGeneratedGameState(params)
    const b = createGeneratedGameState(params)

    const pinnedA = a.cells.filter((c) => c.state === 'pinned')
    const pinnedB = b.cells.filter((c) => c.state === 'pinned')

    expect(pinnedA.map((c) => [c.row, c.col])).toEqual(pinnedB.map((c) => [c.row, c.col]))
    expect(pinnedA.map((c) => c.cardId)).toEqual(pinnedB.map((c) => c.cardId))
  })

  it('places pinned cards in placedCards and excludes them from hand and deck', () => {
    const state = createGeneratedGameState({ rows: 4, cols: 4, seed: 7, pinnedCount: 2 })
    const pinned = state.cells.filter((c) => c.state === 'pinned')

    expect(pinned).toHaveLength(2)
    for (const cell of pinned) {
      expect(cell.cardId).not.toBeNull()
      expect(state.placedCards[cell.cardId!]).toBeDefined()
    }

    const poolIds = new Set([...state.hand, ...state.deck].map((c) => c.id))
    for (const cell of pinned) {
      expect(poolIds.has(cell.cardId!)).toBe(false)
    }
  })

  it('keeps correct deck size when pins are present', () => {
    const state = createGeneratedGameState({ rows: 4, cols: 4, seed: 11, pinnedCount: 3 })
    const freeCount = state.cells.filter((c) => c.state === 'free').length

    expect(state.hand.length + state.deck.length).toBe(freeCount + 6)
  })

  it('supports a solver-found winning placement with pinned cells', () => {
    const state = createGeneratedGameState({ rows: 4, cols: 4, seed: 9, pinnedCount: 2 })
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
  })
})
