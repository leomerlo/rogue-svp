import { describe, expect, it } from 'vitest'
import { countValidArrangements } from '@/game/arrangementSolver'
import { AUTHORED_CARD_DEFS, AUTHORED_DECK, shuffleAuthoredDeck } from '@/game/authoredDeck'
import { getTopology, TOPOLOGY_COUNT } from '@/game/topologies'

describe('AUTHORED_DECK', () => {
  it('defines the original 67-card RSVP set', () => {
    expect(AUTHORED_CARD_DEFS).toHaveLength(67)
    expect(AUTHORED_DECK).toHaveLength(67)
    expect(AUTHORED_DECK.filter((c) => c.colorA === 'wild')).toHaveLength(3)
  })

  it('shuffles deterministically for the same seed', () => {
    expect(shuffleAuthoredDeck(42).map((c) => c.id)).toEqual(
      shuffleAuthoredDeck(42).map((c) => c.id),
    )
  })

  it('has at least one valid arrangement for each authored topology', () => {
    for (let i = 0; i < TOPOLOGY_COUNT; i++) {
      const topology = getTopology(i)
      const { count } = countValidArrangements(topology, AUTHORED_DECK)

      expect(count, `topology ${i} should be solvable with AUTHORED_DECK`).toBeGreaterThanOrEqual(1)
    }
  })
})
