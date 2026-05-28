import type { Card, Cell, GameState, RegularColor } from '@/game/types'

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
    fixedColor: null,
    ...overrides,
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
  } = {},
): GameState {
  return {
    rows,
    cols,
    cells,
    hand: options.hand ?? [],
    deck: options.deck ?? [],
    redealsLeft: 4,
    placedCards: options.placedCards ?? {},
    status: options.status ?? 'playing',
    selectedCardId: options.selectedCardId ?? null,
  }
}
