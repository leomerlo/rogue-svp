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
  | { type: 'changeLevel'; level: 'generated' }
  | { type: 'advanceTopology' }

type RunAction =
  | { type: 'advanceLevel'; mesaScore: number }
  | { type: 'endRunLoss' }
  | { type: 'applyRelic'; relicId: RelicId }
  | { type: 'newRun'; seed: string }

type ActionOf<T extends GameAction['type'] | RunAction['type']> = Extract<GameAction | RunAction, { type: T }>

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

type RelicId = string;

interface RunState {
  topologyIndex: number
  relicsActive: RelicId[]
  scoreTotal: number
  seed: string
  status: 'playing' | 'won' | 'lost'
}

export type { ActionOf, Card, Cell, CellState, Color, DeckDef, DeckParams, DifficultyTarget, GameAction, GameState, GenerateMesaParams, InteractionAction, MesaMetrics, Place, RegularColor, RunState, Side, Swap, TopologyDef, TopologyParams, RunAction, RelicId };
