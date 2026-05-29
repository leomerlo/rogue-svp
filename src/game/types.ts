type RegularColor = 'red' | 'blue' | 'green' | 'yellow';
type Color = RegularColor | 'wild';

type Side = 'top' | 'bottom' | 'left' | 'right';

type Card =
  | { id: string; colorA: 'wild'; colorB: 'wild' }
  | { id: string; colorA: RegularColor; colorB: RegularColor }

type CellState = 'free' | 'blocked' | 'pinned';

interface Cell {
  row: number;
  col: number;
  state: CellState;
  cardId: string | null;
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
  topologyIndex: number | null;
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
  | { type: 'changeLevel'; level: 'path' | 'ring' | 'generated' }
  | { type: 'advanceTopology' }

type ActionOf<T extends GameAction['type']> = Extract<GameAction, { type: T }>

type InteractionAction =
  | ActionOf<'selectCard'>
  | ActionOf<'deselectCard'>
  | ActionOf<'placeCard'>
  | ActionOf<'swapCard'>

interface TopologyParams {
  rows: number;
  cols: number;
  targetFreeSeats?: number;
  seed?: number;
  pinnedCount?: number;
}

interface TopologyDef {
  rows: number;
  cols: number;
  cells: Array<{ row: number; col: number; state: CellState }>;
  deckParams?: { wildCount: number; bufferSize: number };
}

interface DeckParams {
  seed?: number;
  bufferSize?: number;
  wildCount?: number;
  excludeCardIds?: string[];
}

interface DeckDef {
  cards: Card[];
}

type DifficultyTarget = 1 | 2 | 3 | 4 | 5;

interface MesaMetrics {
  solutionCount: number;
  solutionCountCapped: boolean;
  wildRatio: number;
  bottleneckCount: number;
  avgSeatDegree: number;
}

interface GenerateMesaParams {
  rows?: number;
  cols?: number;
  targetFreeSeats?: number;
  seed?: number;
  attemptBudget?: number;
  bufferSize?: number;
  wildCount?: number;
}

export type { ActionOf, Card, Cell, CellState, Color, DeckDef, DeckParams, DifficultyTarget, GameAction, GameState, GenerateMesaParams, InteractionAction, MesaMetrics, Place, RegularColor, Side, Swap, TopologyDef, TopologyParams };
