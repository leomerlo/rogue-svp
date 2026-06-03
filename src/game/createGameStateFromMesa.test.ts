import { describe, expect, it } from 'vitest'
import { findValidArrangement } from '@/game/arrangementSolver'
import { shuffleAuthoredDeck } from '@/game/authoredDeck'
import { createGameStateFromMesa } from '@/game/createGameStateFromMesa'
import { isSolved } from '@/game/helpers'
import { getTopology } from '@/game/topologies'
import { seatKey } from '@/game/solutionAssignment'
import { makeState, topologyFromGameState } from '@/test/utils/factories'

describe('createGameStateFromMesa', () => {
  it('builds playable state from an authored topology', () => {
    const topology = getTopology(2)
    const state = createGameStateFromMesa(topology, shuffleAuthoredDeck(7), { deckSeed: 7 })
    const topologyFromState = topologyFromGameState(state)

    expect(state.status).toBe('playing')
    expect(state.hand).toHaveLength(3)
    expect(findValidArrangement(topologyFromState, [...state.hand, ...state.deck])).not.toBeNull()
  })

  it('is deterministic for the same topology and seed', () => {
    const topology = getTopology(1)
    const deck = shuffleAuthoredDeck(99)
    const a = createGameStateFromMesa(topology, deck, { deckSeed: 99 })
    const b = createGameStateFromMesa(topology, deck, { deckSeed: 99 })

    expect(a.cells).toEqual(b.cells)
    expect(a.hand).toEqual(b.hand)
    expect(a.deck).toEqual(b.deck)
  })

  it('supports solver-found winning placement with pinned cells', () => {
    const topology = getTopology(4)
    const state = createGameStateFromMesa(topology, shuffleAuthoredDeck(11), {
      deckSeed: 11,
      pinnedCount: 2,
    })
    const allCards = [...state.hand, ...state.deck]
    const topologyFromState = topologyFromGameState(state)

    const fixedBySeat = new Map(
      state.cells
        .filter((c) => c.state === 'pinned')
        .map((c) => [seatKey(c.row, c.col), state.placedCards[c.cardId!]!] as const),
    )
    const arrangement = findValidArrangement(topologyFromState, allCards, fixedBySeat)
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
