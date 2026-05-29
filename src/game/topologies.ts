import type { TopologyDef } from '@/game/types'

const GRID_ROWS = 3
const GRID_COLS = 6

type AuthoredDeckParams = { wildCount: number; bufferSize: number }

function build3x6(
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

const TOPOLOGIES: TopologyDef[] = [
  // Act 1 — heavy blocking, ~8-9 free cells
  build3x6([[0,0],[0,1],[0,4],[0,5],[1,0],[1,5],[2,0],[2,1],[2,4],[2,5]], { wildCount: 1, bufferSize: 8 }),
  build3x6([[0,1],[0,2],[0,3],[0,4],[1,0],[1,5],[2,1],[2,2],[2,3],[2,4]], { wildCount: 1, bufferSize: 8 }),
  build3x6([[0,0],[0,2],[0,4],[1,1],[1,3],[1,5],[2,0],[2,2],[2,4]], { wildCount: 1, bufferSize: 7 }),
  build3x6([[0,0],[0,1],[0,2],[1,0],[1,2],[1,3],[2,3],[2,4],[2,5]], { wildCount: 1, bufferSize: 7 }),
  // Act 2 — moderate density, 4-6 blocked
  build3x6([[0,0],[0,2],[0,5],[2,0],[2,3],[2,5]], { wildCount: 1, bufferSize: 6 }),
  build3x6([[0,0],[0,2],[1,3],[1,5],[2,1],[2,4]], { wildCount: 1, bufferSize: 6 }),
  build3x6([[0,2],[1,0],[1,4],[2,3],[2,5]], { wildCount: 1, bufferSize: 6 }),
  build3x6([[0,1],[0,4],[2,1],[2,4]], { wildCount: 1, bufferSize: 5 }),
  // Act 3 — nearly full grid, 1-2 strategic holes
  build3x6([[1,1],[1,4]], { wildCount: 0, bufferSize: 5 }),
  build3x6([[0,2],[2,3]], { wildCount: 0, bufferSize: 5 }),
  build3x6([[1,3]], { wildCount: 0, bufferSize: 4 }),
  build3x6([[0,0],[2,5]], { wildCount: 0, bufferSize: 4 }),
]

const TOPOLOGY_COUNT = TOPOLOGIES.length

function getTopology(index: number): TopologyDef {
  if (index < 0 || index >= TOPOLOGY_COUNT) {
    throw new Error(`topology index must be between 0 and ${TOPOLOGY_COUNT - 1}`)
  }
  return TOPOLOGIES[index]!
}

export { GRID_COLS, GRID_ROWS, TOPOLOGIES, TOPOLOGY_COUNT, getTopology }
