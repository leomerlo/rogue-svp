import type { Card, Cell, GameState, RegularColor, TopologyDef } from '@/game/types'

export function makeCard(id: string, colorA: RegularColor, colorB: RegularColor): Card {
  return { id, colorA, colorB }
}

export function makeWildCard(id: string): Card {
  return { id, colorA: 'wild', colorB: 'wild' }
}

export function makeCell(row: number, col: number, overrides: Partial<Cell> = {}): Cell {
  return {
    row,
    col,
    state: 'free',
    cardId: null,
    ...overrides,
  }
}

export function topologyFromGameState(state: GameState): TopologyDef {
  return {
    rows: state.rows,
    cols: state.cols,
    cells: state.cells.map(({ row, col, state: cellState }) => ({
      row,
      col,
      state: cellState,
    })),
    pinnedCount: state.cells.filter((c) => c.state === 'pinned').length,
  }
}

export function makeState(
  rows: number,
  cols: number,
  cells: Cell[],
  options: {
    placedCards?: Record<string, Card>
    hand?: Card[]
    deck?: Card[]
    status?: GameState['status']
    selectedCardId?: string | null
    topologyIndex?: number | null
    redealsLeft?: number
    initialRedealsLeft?: number
    relicsActive?: GameState['relicsActive']
    deckPeek?: Card[]
  } = {},
): GameState {
  return {
    rows,
    cols,
    cells,
    hand: options.hand ?? [],
    deck: options.deck ?? [],
    redealsLeft: options.redealsLeft ?? 4,
    initialRedealsLeft: options.initialRedealsLeft ?? options.redealsLeft ?? 4,
    relicsActive: options.relicsActive ?? [],
    deckPeek: options.deckPeek ?? [],
    placedCards: options.placedCards ?? {},
    status: options.status ?? 'playing',
    selectedCardId: options.selectedCardId ?? null,
    topologyIndex: options.topologyIndex ?? null,
  }
}
