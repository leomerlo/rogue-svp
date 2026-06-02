import { describe, expect, it } from 'vitest'
import { isSolved } from '@/game/helpers'
import { cellKey } from '@/game/helpers'
import { makeState } from '@/test/utils/factories'
import type { Card, TopologyDef } from '@/game/types'
import { buildSolutionAssignment, freeSeats } from '@/game/solutionAssignment'

function pathTopology(): TopologyDef {
  return {
    rows: 1,
    cols: 6,
    cells: Array.from({ length: 6 }, (_, col) => ({
      row: 0,
      col,
      state: 'free' as const,
    })),
    pinnedCount: 0,
  }
}

function ringTopology(): TopologyDef {
  return {
    rows: 3,
    cols: 3,
    cells: Array.from({ length: 9 }, (_, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      return {
        row,
        col,
        state: row === 1 && col === 1 ? ('blocked' as const) : ('free' as const),
      }
    }),
    pinnedCount: 0,
  }
}

function cardsFromAssignment(topology: TopologyDef, seed: number): Card[] {
  const assignment = buildSolutionAssignment(topology, seed)!
  const seats = freeSeats(topology)

  return seats.map((seat, index) => {
    const { colorA, colorB } = assignment.get(cellKey(seat.row, seat.col))!
    return { id: `test-${seed}-${index}`, colorA, colorB }
  })
}

function stateFromSolution(topology: TopologyDef, cards: Card[]) {
  const seats = freeSeats(topology)
  const placedCards: Record<string, Card> = {}
  const cells = topology.cells.map(({ row, col, state }) => {
    if (state === 'blocked') {
      return { row, col, state, cardId: null }
    }
    const seatIndex = seats.findIndex((s) => s.row === row && s.col === col)
    const card = cards[seatIndex]!
    placedCards[card.id] = card
    return { row, col, state, cardId: card.id }
  })

  return makeState(topology.rows, topology.cols, cells, { placedCards })
}

describe('buildSolutionAssignment', () => {
  it('finds a valid assignment for the 1×6 path topology', () => {
    const assignment = buildSolutionAssignment(pathTopology(), 42)
    expect(assignment).not.toBeNull()
    expect(assignment!.size).toBe(6)
  })

  it('finds a valid assignment for the 3×3 ring topology', () => {
    const assignment = buildSolutionAssignment(ringTopology(), 7)
    expect(assignment).not.toBeNull()
    expect(assignment!.size).toBe(8)
  })

  it('produces cards that form a solved table on the path topology', () => {
    const topology = pathTopology()
    const cards = cardsFromAssignment(topology, 1)
    expect(cards).toHaveLength(6)

    const state = stateFromSolution(topology, cards)
    expect(isSolved(state)).toBe(true)
  })

  it('produces cards that form a solved table on the ring topology', () => {
    const topology = ringTopology()
    const cards = cardsFromAssignment(topology, 3)
    expect(cards).toHaveLength(8)

    const state = stateFromSolution(topology, cards)
    expect(isSolved(state)).toBe(true)
  })
})
