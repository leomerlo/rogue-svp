import type { Cell, TopologyDef } from '@/game/types'

function topologyDefToCells(def: TopologyDef): Cell[] {
  return def.cells.map(({ row, col, state }) => ({
    row,
    col,
    state,
    cardId: null,
  }))
}

export { topologyDefToCells }
