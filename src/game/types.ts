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
  initialRedealsLeft: number;
  relicsActive: RelicId[];
  deckPeek: Card[];
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
  | { type: 'changeLevel'; level: 'generated'; relicsActive?: RelicId[] }
  | { type: 'advanceTopology' }

type RunAction =
  | { type: 'advanceLevel'; mesaScore: number }
  | { type: 'startReward'; mesaScore: number }
  | { type: 'startMesa' }
  | { type: 'endRunLoss' }
  | { type: 'applyRelic'; relicId: RelicId }
  | { type: 'newRun'; seed: string }

type ActionOf<T extends GameAction['type'] | RunAction['type']> = Extract<GameAction | RunAction, { type: T }>

type InteractionAction =
  | ActionOf<'selectCard'>
  | ActionOf<'deselectCard'>
  | ActionOf<'placeCard'>
  | ActionOf<'swapCard'>

interface TopologyDef {
  rows: number;
  cols: number;
  cells: Array<{ row: number; col: number; state: CellState }>;
  pinnedCount: number;
}

type RelicId =
  | 'extra_redeal'
  | 'free_first_redeal'
  | 'peek_5'
  | 'reveal_hand_next'
  | 'wild_on_start'
  | 'wild_on_redeal'
  | 'score_streak'
  | 'score_no_loss';

interface RunState {
  topologyIndex: number
  relicsActive: RelicId[]
  scoreTotal: number
  seed: string
  status: 'playing' | 'won' | 'lost' | 'reward' | 'splash'
  pendingMesaScore: number
  partyAssignments: Array<{ partyTypeId: string; characterName: string }>
}

export type { ActionOf, Card, Cell, CellState, Color, GameAction, GameState, InteractionAction, Place, RegularColor, RelicId, RunAction, RunState, Side, Swap, TopologyDef };
