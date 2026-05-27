type Color = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface Card {
  id: string;
  colorA: Color; // covers top + left edges
  colorB: Color; // covers bottom + right edges
}

type CellState = 'free' | 'blocked';

interface Cell {
  row: number;
  col: number;
  state: CellState;
  cardId: string | null;
  fixedColor: Color | null;
}

interface GameState {
  rows: number;
  cols: number;
  cells: Cell[];
  hand: Card[];
  deck: Card[];
  redealsLeft: number;
  placedCards: Record<string, Card>;
  status: 'playing' | 'won' | 'lost';
  selectedCardId: string | null;
}

type Move = { type: 'place'; cardId: string; row: number; col: number }

type GameAction = 
  | { type: 'selectCard'; cardId: string }
  | { type: 'deselectCard' }
  | { type: 'placeCard'; move: Move }
  | { type: 'resetGame' }
  | { type: 'shuffleDeck' }

export type { Card, Cell, Color, GameAction, GameState, Move, Side };