import type { Cell, TopologyDef, TopologyParams } from '@/game/types'
import { seededRandom, shuffled } from '@/game/seededRandom'
import { cellKey } from '@/game/helpers'

function isConnected(rows: number, cols: number, blocked: Set<string>): boolean {
  let startRow = -1
  let startCol = -1

  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!blocked.has(cellKey(r, c))) {
        startRow = r
        startCol = c
        break outer
      }
    }
  }

  if (startRow === -1) return false

  const visited = new Set<string>()
  const queue: Array<{ row: number; col: number }> = [{ row: startRow, col: startCol }]
  visited.add(cellKey(startRow, startCol))

  const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const

  while (queue.length > 0) {
    const { row, col } = queue.shift()!
    for (const [dr, dc] of deltas) {
      const nr = row + dr
      const nc = col + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const key = cellKey(nr, nc)
      if (blocked.has(key) || visited.has(key)) continue
      visited.add(key)
      queue.push({ row: nr, col: nc })
    }
  }

  const totalFree = rows * cols - blocked.size
  return visited.size === totalFree
}

function generateTopology(params: TopologyParams): TopologyDef {
  const { rows, cols } = params
  const totalCells = rows * cols
  const targetFreeSeats = params.targetFreeSeats ?? Math.ceil(totalCells * 0.6)
  const targetBlockedCount = totalCells - targetFreeSeats

  if (rows < 1 || cols < 1) throw new Error('rows and cols must be >= 1')
  if (targetFreeSeats < 2) throw new Error('targetFreeSeats must be >= 2')
  if (targetFreeSeats >= totalCells) throw new Error('targetFreeSeats must be < rows * cols')

  const rng = seededRandom(params.seed ?? (Math.random() * 2 ** 32) >>> 0)

  const positions = shuffled(
    Array.from({ length: totalCells }, (_, i) => ({
      row: Math.floor(i / cols),
      col: i % cols,
    })),
    rng,
  )

  const blocked = new Set<string>()

  for (const pos of positions) {
    if (blocked.size >= targetBlockedCount) break
    const key = cellKey(pos.row, pos.col)
    blocked.add(key)
    if (!isConnected(rows, cols, blocked)) {
      blocked.delete(key)
    }
  }

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    return {
      row,
      col,
      state: blocked.has(cellKey(row, col)) ? ('blocked' as const) : ('free' as const),
    }
  })

  return { rows, cols, cells, pinnedCount: params.pinnedCount ?? 0 }
}

function topologyDefToCells(def: TopologyDef): Cell[] {
  return def.cells.map(({ row, col, state }) => ({
    row,
    col,
    state,
    cardId: null
  }))
}

export { generateTopology, topologyDefToCells }
