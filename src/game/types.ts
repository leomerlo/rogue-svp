type RegularColor = 'red' | 'blue' | 'green' | 'yellow';
type Color = RegularColor | 'wild';

type Side = 'top' | 'bottom' | 'left' | 'right';

type Card =
  | { id: string; colorA: 'wild'; colorB: 'wild' }
  | { id: string; colorA: RegularColor; colorB: RegularColor }

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
  | { type: 'reDeal' }
  | { type: 'changeLevel'; level: string }

type ActionOf<T extends GameAction['type']> = Extract<GameAction, { type: T }>

type InteractionAction =
  | ActionOf<'selectCard'>
  | ActionOf<'deselectCard'>
  | ActionOf<'placeCard'>
  | ActionOf<'swapCard'>

export type { ActionOf, Card, Cell, Color, GameAction, GameState, InteractionAction, Place, RegularColor, Side, Swap };