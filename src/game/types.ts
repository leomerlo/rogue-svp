type RegularColor = 'red' | 'blue' | 'green' | 'yellow';
type Color = RegularColor | 'wild';

const NARRATIVE_TAGS = ['married', 'bereaved', 'newborn'] as const;
type NarrativeTag = typeof NARRATIVE_TAGS[number];

interface EncounterOption {
  label: string;
  tag: NarrativeTag;
  tagTarget: 'charA' | 'charB';
  rumores: number;
}

interface EncounterDef {
  id: string;
  prompt: string;
  options: EncounterOption[];
}

interface RunEncounter {
  encounterId: string;
  charASlotIndex: number;
  charBSlotIndex: number;
}

interface Archetype {
  id: string
  label: string
  socialPosture: string
  comicWeakness: string
}

interface CharacterSlot {
  name: string;
  archetypeId: string;
  tags: NarrativeTag[];
}

interface NarrativeState {
  roster: CharacterSlot[];
}

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
  | { type: 'applyNarrativeTag'; slotIndex: number; tag: NarrativeTag }
  | { type: 'applyRumores'; amount: number }
  | { type: 'resolveEncounter'; slotIndex: number; tag: NarrativeTag; rumores: number }

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
  status: 'playing' | 'won' | 'lost' | 'reward' | 'splash' | 'encounter'
  pendingMesaScore: number
  rumores: number
  encounter: RunEncounter
  partyAssignments: Array<{ partyTypeId: string; characterName: string; familyName: string; archetypeId: string; oneLiner: string }>
  narrativeState: NarrativeState
}

export { NARRATIVE_TAGS };
export type { ActionOf, Archetype, Card, Cell, CellState, CharacterSlot, Color, EncounterDef, EncounterOption, GameAction, GameState, InteractionAction, NarrativeState, NarrativeTag, Place, RegularColor, RelicId, RunAction, RunEncounter, RunState, Side, Swap, TopologyDef };
