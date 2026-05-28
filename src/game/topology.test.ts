import { describe, it, expect } from 'vitest'
import { generateTopology, topologyDefToCells } from '@/game/topology'
import type { TopologyDef } from '@/game/types'

function freeCells(def: TopologyDef) {
  return def.cells.filter(c => c.state === 'free')
}

function freeNeighbors(def: TopologyDef, row: number, col: number) {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]]
    .map(([dr, dc]) => def.cells.find(c => c.row === row + dr! && c.col === col + dc!))
    .filter(c => c?.state === 'free')
}

function bfsReachable(def: TopologyDef, startRow: number, startCol: number): Set<string> {
  const visited = new Set<string>()
  const queue = [{ row: startRow, col: startCol }]
  visited.add(`${startRow},${startCol}`)
  while (queue.length > 0) {
    const { row, col } = queue.shift()!
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
      const nr = row + dr
      const nc = col + dc
      const key = `${nr},${nc}`
      if (!visited.has(key) && def.cells.find(c => c.row === nr && c.col === nc && c.state === 'free')) {
        visited.add(key)
        queue.push({ row: nr, col: nc })
      }
    }
  }
  return visited
}

describe('generateTopology', () => {
  it('reproducibility: same seed produces identical output', () => {
    const a = generateTopology({ rows: 4, cols: 4, seed: 42 })
    const b = generateTopology({ rows: 4, cols: 4, seed: 42 })
    expect(a).toEqual(b)
  })

  it('variety: 100 distinct seeds produce at least 50 unique layouts', () => {
    const patterns = new Set<string>()
    for (let s = 0; s < 100; s++) {
      const def = generateTopology({ rows: 4, cols: 4, seed: s })
      patterns.add(JSON.stringify(def.cells.map(c => c.state)))
    }
    expect(patterns.size).toBeGreaterThanOrEqual(50)
  })

  it('connectivity: every free cell is reachable from every other free cell', () => {
    for (const seed of [0, 1, 7, 42, 99]) {
      const def = generateTopology({ rows: 4, cols: 5, seed })
      const free = freeCells(def)
      expect(free.length).toBeGreaterThan(0)
      const reachable = bfsReachable(def, free[0]!.row, free[0]!.col)
      expect(reachable.size).toBe(free.length)
    }
  })

  it('no isolated cells: every free cell has at least one free neighbor', () => {
    for (const seed of [0, 3, 17, 55, 88]) {
      const def = generateTopology({ rows: 4, cols: 4, seed })
      for (const cell of freeCells(def)) {
        const neighbors = freeNeighbors(def, cell.row, cell.col)
        expect(neighbors.length).toBeGreaterThan(0)
      }
    }
  })

  it('no all-free: at least one cell is blocked', () => {
    const def = generateTopology({ rows: 3, cols: 3, targetFreeSeats: 6, seed: 1 })
    const blocked = def.cells.filter(c => c.state === 'blocked')
    expect(blocked.length).toBeGreaterThan(0)
  })

  it('no all-blocked: always has at least 2 free seats', () => {
    for (const seed of [0, 5, 10]) {
      const def = generateTopology({ rows: 3, cols: 3, targetFreeSeats: 6, seed })
      expect(freeCells(def).length).toBeGreaterThanOrEqual(2)
    }
  })

  it('free seat count matches targetFreeSeats on standard grids', () => {
    const def = generateTopology({ rows: 4, cols: 4, targetFreeSeats: 10, seed: 7 })
    expect(freeCells(def).length).toBe(10)
  })

  it('defaults targetFreeSeats to ~60% of total cells', () => {
    const def = generateTopology({ rows: 5, cols: 5, seed: 0 })
    const expectedFree = Math.ceil(25 * 0.6)
    expect(freeCells(def).length).toBe(expectedFree)
  })

  it('output cells cover the full grid (rows × cols entries)', () => {
    const def = generateTopology({ rows: 3, cols: 4, seed: 2 })
    expect(def.cells.length).toBe(12)
    expect(def.rows).toBe(3)
    expect(def.cols).toBe(4)
  })

  describe('invalid params', () => {
    it('throws when targetFreeSeats < 2', () => {
      expect(() => generateTopology({ rows: 3, cols: 3, targetFreeSeats: 1 })).toThrow()
    })

    it('throws when targetFreeSeats >= rows * cols', () => {
      expect(() => generateTopology({ rows: 3, cols: 3, targetFreeSeats: 9 })).toThrow()
    })

    it('throws when rows < 1', () => {
      expect(() => generateTopology({ rows: 0, cols: 3 })).toThrow()
    })

    it('throws when cols < 1', () => {
      expect(() => generateTopology({ rows: 3, cols: 0 })).toThrow()
    })
  })
})

describe('topologyDefToCells', () => {
  it('produces full Cell[] with cardId null', () => {
    const def = generateTopology({ rows: 3, cols: 3, targetFreeSeats: 6, seed: 5 })
    const cells = topologyDefToCells(def)
    expect(cells.length).toBe(9)
    for (const cell of cells) {
      expect(cell.cardId).toBeNull()
      expect(['free', 'blocked']).toContain(cell.state)
    }
  })

  it('preserves row, col, and state from the topology definition', () => {
    const def = generateTopology({ rows: 2, cols: 2, targetFreeSeats: 2, seed: 0 })
    const cells = topologyDefToCells(def)
    for (const cell of cells) {
      const original = def.cells.find(c => c.row === cell.row && c.col === cell.col)
      expect(original).toBeDefined()
      expect(cell.state).toBe(original!.state)
    }
  })
})
