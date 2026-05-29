import { describe, it, expect } from 'vitest'
import { topologyDefToCells } from '@/game/topology'
import { getTopology } from '@/game/topologies'

describe('topologyDefToCells', () => {
  it('produces full Cell[] with cardId null', () => {
    const def = getTopology(0)
    const cells = topologyDefToCells(def)
    expect(cells.length).toBe(def.rows * def.cols)
    for (const cell of cells) {
      expect(cell.cardId).toBeNull()
      expect(['free', 'blocked']).toContain(cell.state)
    }
  })

  it('preserves row, col, and state from the topology definition', () => {
    const def = getTopology(3)
    const cells = topologyDefToCells(def)
    for (const cell of cells) {
      const original = def.cells.find((c) => c.row === cell.row && c.col === cell.col)
      expect(original).toBeDefined()
      expect(cell.state).toBe(original!.state)
    }
  })
})
