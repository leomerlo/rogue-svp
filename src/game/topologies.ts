import type { TopologyDef } from '@/game/types'

const GRID_ROWS = 6
const GRID_COLS = 3

type AuthoredDeckParams = { wildCount: number; bufferSize: number }

function build6x3(
  blocked: ReadonlyArray<[row: number, col: number]>,
  deckParams: AuthoredDeckParams,
): TopologyDef {
  const blockedSet = new Set(blocked.map(([row, col]) => `${row},${col}`))
  const cells = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => {
    const row = Math.floor(i / GRID_COLS)
    const col = i % GRID_COLS
    return {
      row,
      col,
      state: blockedSet.has(`${row},${col}`) ? ('blocked' as const) : ('free' as const),
    }
  })

  return { rows: GRID_ROWS, cols: GRID_COLS, cells, deckParams }
}

// Placeholder blocked-cell patterns — replace with hand-authored shapes.
const TOPOLOGIES: TopologyDef[] = [
  // Act 1 — more blocked cells, easier puzzles
  build6x3([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2], [3, 0], [3, 2], [5, 1]], { wildCount: 1, bufferSize: 8 }),
  build6x3([[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2], [4, 0], [4, 2], [5, 0], [5, 2]], { wildCount: 1, bufferSize: 8 }),
  build6x3([[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [3, 2], [4, 1], [5, 0], [5, 2]], { wildCount: 1, bufferSize: 7 }),
  build6x3([[0, 0], [0, 2], [2, 0], [2, 2], [4, 0], [4, 2], [5, 0], [5, 1], [5, 2]], { wildCount: 1, bufferSize: 7 }),
  // Act 2 — moderate density
  build6x3([[0, 0], [0, 2], [2, 1], [3, 1], [5, 0], [5, 2]], { wildCount: 1, bufferSize: 6 }),
  build6x3([[0, 1], [1, 0], [1, 2], [4, 0], [4, 2], [5, 1]], { wildCount: 1, bufferSize: 6 }),
  build6x3([[0, 0], [2, 2], [3, 0], [5, 2]], { wildCount: 1, bufferSize: 6 }),
  build6x3([[1, 1], [2, 0], [2, 2], [3, 2], [4, 1]], { wildCount: 1, bufferSize: 5 }),
  // Act 3 — nearly full grid, strategic blocking
  build6x3([[0, 1], [3, 1]], { wildCount: 0, bufferSize: 5 }),
  build6x3([[1, 0], [4, 2]], { wildCount: 0, bufferSize: 5 }),
  build6x3([[2, 1]], { wildCount: 0, bufferSize: 4 }),
  build6x3([[0, 0], [5, 2]], { wildCount: 0, bufferSize: 4 }),
]

const TOPOLOGY_COUNT = TOPOLOGIES.length

function getTopology(index: number): TopologyDef {
  if (index < 0 || index >= TOPOLOGY_COUNT) {
    throw new Error(`topology index must be between 0 and ${TOPOLOGY_COUNT - 1}`)
  }
  return TOPOLOGIES[index]!
}

export { GRID_COLS, GRID_ROWS, TOPOLOGIES, TOPOLOGY_COUNT, getTopology }
