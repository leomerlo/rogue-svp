import { describe, expect, it } from 'vitest'
import { getTopology, TOPOLOGY_COUNT } from '@/game/topologies'

describe('authored topologies', () => {
  it('defines exactly 12 topologies on a 6×3 grid', () => {
    expect(TOPOLOGY_COUNT).toBe(12)
    for (let i = 0; i < TOPOLOGY_COUNT; i++) {
      const topology = getTopology(i)
      expect(topology.rows).toBe(6)
      expect(topology.cols).toBe(3)
      expect(topology.cells).toHaveLength(18)
      expect(topology.deckParams.wildCount).toBeGreaterThanOrEqual(0)
      expect(topology.deckParams.bufferSize).toBeGreaterThan(0)
    }
  })

  it('throws for an out-of-range index', () => {
    expect(() => getTopology(-1)).toThrow()
    expect(() => getTopology(12)).toThrow()
  })
})
