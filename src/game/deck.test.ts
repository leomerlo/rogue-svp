import { describe, expect, it } from 'vitest'
import { findValidArrangement } from '@/game/arrangementSolver'
import { generateDeck } from '@/game/deck'
import { buildSolutionCards, freeSeats } from '@/game/solutionAssignment'
import { generateTopology } from '@/game/topology'

function countWilds(cards: { colorA: string }[]) {
  return cards.filter((c) => c.colorA === 'wild').length
}

describe('generateDeck', () => {
  it('is deterministic for the same topology and seed', () => {
    const topology = generateTopology({ rows: 4, cols: 4, seed: 42 })
    const a = generateDeck(topology, { seed: 99 })
    const b = generateDeck(topology, { seed: 99 })

    expect(a.cards).toEqual(b.cards)
  })

  it('produces deck size seats + 6 by default', () => {
    const topology = generateTopology({ rows: 4, cols: 4, seed: 1 })
    const deck = generateDeck(topology, { seed: 2 })
    const seats = freeSeats(topology).length

    expect(deck.cards).toHaveLength(seats + 6)
  })

  it('respects custom bufferSize', () => {
    const topology = generateTopology({ rows: 3, cols: 3, targetFreeSeats: 6, seed: 3 })
    const deck = generateDeck(topology, { seed: 4, bufferSize: 4 })
    const seats = freeSeats(topology).length

    expect(deck.cards).toHaveLength(seats + 4)
  })

  it('includes exactly one wild by default', () => {
    const topology = generateTopology({ rows: 4, cols: 4, seed: 5 })
    const deck = generateDeck(topology, { seed: 6 })

    expect(countWilds(deck.cards)).toBe(1)
  })

  it('excludes given solution card ids and shrinks the deck', () => {
    const topology = generateTopology({ rows: 4, cols: 4, seed: 10 })
    const seats = freeSeats(topology).length
    const excluded = buildSolutionCards(topology, 11).slice(0, 2).map((c) => c.id)

    const deck = generateDeck(topology, { seed: 11, excludeCardIds: excluded })

    expect(deck.cards).toHaveLength(seats + 6 - excluded.length)
    for (const id of excluded) {
      expect(deck.cards.some((c) => c.id === id)).toBe(false)
    }
  })

  it('has a solver-verified arrangement for many generated pairs', () => {
    for (let i = 0; i < 30; i++) {
      const topology = generateTopology({ rows: 4, cols: 4, seed: i })
      const deck = generateDeck(topology, { seed: i + 1000 })
      const arrangement = findValidArrangement(topology, deck.cards)

      expect(arrangement).not.toBeNull()
      expect(arrangement!.size).toBe(freeSeats(topology).length)
    }
  })
})
