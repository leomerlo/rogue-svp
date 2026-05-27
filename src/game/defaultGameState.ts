import type { GameState } from './types'

export function createDefaultGameState(): GameState {
  return {
    rows: 1,
    cols: 6,
    cells: Array.from({ length: 6 }, (_, col) => ({
      row: 0,
      col,
      state: 'free',
      cardId: null,
      fixedColor: null,
    })),
    hand: [],
    deck: [],
    redealsLeft: 4,
    placedCards: {},
    status: 'playing',
  }
}
