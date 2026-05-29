import { describe, expect, it } from 'vitest'
import { isSolved } from '@/game/helpers'
import { findValidArrangement } from '@/game/arrangementSolver'
import { makeState } from '@/test/utils/factories'
import type { TopologyDef } from '@/game/types'
import { seatKey } from '@/game/solutionAssignment'
import { createPathInitialState } from '@/test/utils/pathLevel'
import { createRingInitialState } from '@/test/utils/ringLevel'

function pathTopology(): TopologyDef {
  return {
    rows: 1,
    cols: 6,
    cells: Array.from({ length: 6 }, (_, col) => ({ row: 0, col, state: 'free' as const })),
    deckParams: { wildCount: 1, bufferSize: 6 },
  }
}

function ringTopology(): TopologyDef {
  return {
    rows: 3,
    cols: 3,
    cells: Array.from({ length: 9 }, (_, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      return { row, col, state: row === 1 && col === 1 ? ('blocked' as const) : ('free' as const) }
    }),
    deckParams: { wildCount: 1, bufferSize: 6 },
  }
}

function allDeckCards(state: ReturnType<typeof createPathInitialState>) {
  return [...state.hand, ...state.deck, ...Object.values(state.placedCards)]
}

function stateFromArrangement(
  topology: TopologyDef,
  cards: ReturnType<typeof allDeckCards>,
  arrangement: Map<string, string>,
) {
  const cardsById = new Map(cards.map((c) => [c.id, c]))
  const placedCards: Record<string, (typeof cards)[number]> = {}
  const cells = topology.cells.map(({ row, col, state }) => {
    if (state === 'blocked') {
      return { row, col, state, cardId: null }
    }
    const cardId = arrangement.get(seatKey(row, col))!
    const card = cardsById.get(cardId)!
    placedCards[cardId] = card
    return { row, col, state, cardId }
  })

  return makeState(topology.rows, topology.cols, cells, { placedCards })
}

describe('findValidArrangement', () => {
  it('finds an arrangement for the path level deck', () => {
    const state = createPathInitialState()
    const cards = allDeckCards(state)
    const arrangement = findValidArrangement(pathTopology(), cards)

    expect(arrangement).not.toBeNull()
    expect(arrangement!.size).toBe(6)

    const solved = stateFromArrangement(pathTopology(), cards, arrangement!)
    expect(isSolved(solved)).toBe(true)
  })

  it('finds an arrangement for the ring level deck', () => {
    const state = createRingInitialState()
    const cards = allDeckCards(state)
    const arrangement = findValidArrangement(ringTopology(), cards)

    expect(arrangement).not.toBeNull()
    expect(arrangement!.size).toBe(8)

    const solved = stateFromArrangement(ringTopology(), cards, arrangement!)
    expect(isSolved(solved)).toBe(true)
  })
})
