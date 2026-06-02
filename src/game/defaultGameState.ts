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
    })),
    hand: [],
    deck: [],
    redealsLeft: 4,
    initialRedealsLeft: 4,
    relicsActive: [],
    deckPeek: [],
    revealedNextDraw: null,
    placedCards: {},
    status: 'playing',
    selectedCardId: null,
    topologyIndex: null,
  }
}
