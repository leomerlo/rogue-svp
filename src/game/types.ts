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

type Place = { cardId: string; row: number; col: number }

type Swap = {
  from: { row: number; col: number }
  to: { row: number; col: number }
}

type GameAction = 
  | { type: 'selectCard'; cardId: string }
  | { type: 'deselectCard' }
  | { type: 'placeCard'; move: Place }
  | { type: 'swapCard'; move: Swap }
  | { type: 'resetGame' }
  | { type: 'shuffleDeck' }
  | { type: 'reDeal' }

type ActionOf<T extends GameAction['type']> = Extract<GameAction, { type: T }>

type InteractionAction =
  | ActionOf<'selectCard'>
  | ActionOf<'deselectCard'>
  | ActionOf<'placeCard'>
  | ActionOf<'swapCard'>

export type { ActionOf, Card, Cell, Color, GameAction, GameState, InteractionAction, Place, Side, Swap };