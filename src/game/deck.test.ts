import { describe, expect, it } from 'vitest'
import { findValidArrangement } from '@/game/arrangementSolver'
import { generateDeck } from '@/game/deck'
import { buildSolutionCards, freeSeats } from '@/game/solutionAssignment'
import { getTopology, TOPOLOGY_COUNT } from '@/game/topologies'

function countWilds(cards: { colorA: string }[]) {
  return cards.filter((c) => c.colorA === 'wild').length
}

describe('generateDeck', () => {
  it('is deterministic for the same topology and seed', () => {
    const topology = getTopology(0)
    const a = generateDeck(topology, { seed: 99 })
    const b = generateDeck(topology, { seed: 99 })

    expect(a.cards).toEqual(b.cards)
  })

  it('produces deck size seats + bufferSize from topology deckParams', () => {
    const topology = getTopology(0)
    const deck = generateDeck(topology, { seed: 2 })
    const seats = freeSeats(topology).length

    expect(deck.cards).toHaveLength(seats + topology.deckParams.bufferSize)
  })

  it('respects custom bufferSize override', () => {
    const topology = getTopology(1)
    const deck = generateDeck(topology, { seed: 4, bufferSize: 4 })
    const seats = freeSeats(topology).length

    expect(deck.cards).toHaveLength(seats + 4)
  })

  it('uses topology wildCount by default', () => {
    const topology = getTopology(0)
    const deck = generateDeck(topology, { seed: 6 })

    expect(countWilds(deck.cards)).toBe(topology.deckParams.wildCount)
  })

  it('excludes given solution card ids and shrinks the deck', () => {
    const topology = getTopology(2)
    const seats = freeSeats(topology).length
    const excluded = buildSolutionCards(topology, 11).slice(0, 2).map((c) => c.id)

    const deck = generateDeck(topology, { seed: 11, excludeCardIds: excluded })

    expect(deck.cards).toHaveLength(seats + topology.deckParams.bufferSize - excluded.length)
    for (const id of excluded) {
      expect(deck.cards.some((c) => c.id === id)).toBe(false)
    }
  })

  it('has a solver-verified arrangement for each authored topology', () => {
    for (let i = 0; i < TOPOLOGY_COUNT; i++) {
      const topology = getTopology(i)
      const deck = generateDeck(topology, { seed: i + 1000 })
      const arrangement = findValidArrangement(topology, deck.cards)

      expect(arrangement).not.toBeNull()
      expect(arrangement!.size).toBe(freeSeats(topology).length)
    }
  })
})
