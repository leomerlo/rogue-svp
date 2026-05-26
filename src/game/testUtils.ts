import type { Card, Cell, Color, GameState } from './types'

export function makeCard(id: string, colorA: Color, colorB: Color): Card {
  return { id, colorA, colorB }
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
  }
}
