import type { TopologyDef } from '@/game/types'

const GRID_ROWS = 3
const GRID_COLS = 6

function build3x6(
  blocked: ReadonlyArray<[row: number, col: number]>,
  pinnedCount = 0,
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

  return { rows: GRID_ROWS, cols: GRID_COLS, cells, pinnedCount }
}

const TOPOLOGIES: TopologyDef[] = [
  // Act 1 — FFFFFF / FBBBBF / FFFFFF
  build3x6([[1,1],[1,2],[1,3],[1,4]], 0),
  // BFFFFB / FFFFFF / BFFFFB
  build3x6([[0,0],[0,5],[2,0],[2,5]], 0),
  // FBFFBF / FFBBFF / FBFFBF
  build3x6([[0,1],[0,4],[1,2],[1,3],[2,1],[2,4]], 1),
  // FFFFFF / BBFFBB / FFFFFF
  build3x6([[1,0],[1,1],[1,4],[1,5]], 1),
  // FFFFFF / FBFFBF / FFFFFF
  build3x6([[1,1],[1,4]], 2),
  // FFFFFF / FFBBFF / FFFFFF
  build3x6([[1,2],[1,3]], 3),
]

const TOPOLOGY_COUNT = TOPOLOGIES.length

function getTopology(index: number): TopologyDef {
  if (index < 0 || index >= TOPOLOGY_COUNT) {
    throw new Error(`topology index must be between 0 and ${TOPOLOGY_COUNT - 1}`)
  }
  return TOPOLOGIES[index]!
}

export { GRID_COLS, GRID_ROWS, TOPOLOGIES, TOPOLOGY_COUNT, getTopology }
