import { describe, expect, it } from 'vitest'
import { countValidArrangements } from '@/game/arrangementSolver'
import { AUTHORED_DECK } from '@/game/authoredDeck'
import { getTopology, TOPOLOGY_COUNT } from '@/game/topologies'

describe('authored topologies', () => {
  it('defines exactly 6 topologies on a 3×6 grid', () => {
    expect(TOPOLOGY_COUNT).toBe(6)
    for (let i = 0; i < TOPOLOGY_COUNT; i++) {
      const topology = getTopology(i)
      expect(topology.rows).toBe(3)
      expect(topology.cols).toBe(6)
      expect(topology.cells).toHaveLength(18)
    }
  })

  it('throws for an out-of-range index', () => {
    expect(() => getTopology(-1)).toThrow()
    expect(() => getTopology(6)).toThrow()
  })

  it('has at least one valid arrangement with the authored deck', () => {
    for (let i = 0; i < TOPOLOGY_COUNT; i++) {
      const topology = getTopology(i)
      expect(topology.pinnedCount).toBeGreaterThanOrEqual(0)
      const { count } = countValidArrangements(topology, AUTHORED_DECK)

      expect(count, `topology ${i} should be solvable with AUTHORED_DECK`).toBeGreaterThanOrEqual(1)
    }
  })
})
