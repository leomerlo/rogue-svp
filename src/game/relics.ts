import type { Card, GameState, RelicId } from '@/game/types'

const BASE_REDEALS_LEFT = 4
const REDEAL_PENALTY = 5

interface Relic {
  id: RelicId
  name: string
  description: string
}

const RELICS: Relic[] = [
  {
    id: 'extra_redeal',
    name: 'Extra Re-deal',
    description: 'Start each mesa with one additional re-deal.',
  },
  {
    id: 'free_first_redeal',
    name: 'Free First Re-deal',
    description: 'The first re-deal of each mesa costs no points.',
  },
  {
    id: 'peek_5',
    name: 'Peek Five',
    description: 'At the start of each mesa, see the top 5 cards of the deck.',
  },
  {
    id: 'reveal_hand_next',
    name: 'Reveal Next Draw',
    description: 'After seating a card, the next card drawn is shown face-up before drawing.',
  },
  {
    id: 'wild_on_start',
    name: 'Opening Wild',
    description: 'Each mesa starts with one wild card in your hand.',
  },
  {
    id: 'wild_on_redeal',
    name: 'Re-deal Wild',
    description: 'Each re-deal adds one wild card to your new hand.',
  },
  {
    id: 'score_streak',
    name: 'Clean Streak',
    description: 'If you use no re-deals, mesa score is multiplied by 1.5 (rounded down).',
  },
  {
    id: 'score_no_loss',
    name: 'No Penalty Floor',
    description: 'Re-deal penalties cannot reduce mesa score below the sum of card values.',
  },
]

function hasRelic(relics: RelicId[], id: RelicId): boolean {
  return relics.includes(id)
}

function initialRedealsLeft(relics: RelicId[]): number {
  return BASE_REDEALS_LEFT + (hasRelic(relics, 'extra_redeal') ? 1 : 0)
}

function createRelicWildCard(suffix: string): Card {
  return { id: `relic-wild-${suffix}`, colorA: 'wild', colorB: 'wild' }
}

function applyMesaStartRelics(state: GameState): GameState {
  let next = { ...state }

  if (hasRelic(state.relicsActive, 'peek_5')) {
    next = { ...next, deckPeek: state.deck.slice(0, 5) }
  }

  if (hasRelic(state.relicsActive, 'wild_on_start')) {
    next = {
      ...next,
      hand: [...next.hand, createRelicWildCard('start')],
    }
  }

  return next
}

// Removes peeked cards that have been drawn into hand, shrinking the preview one by one
function refreshDeckPeek(state: GameState): GameState {
  if (!hasRelic(state.relicsActive, 'peek_5')) return state
  const deckIds = new Set(state.deck.map(c => c.id))
  return { ...state, deckPeek: state.deckPeek.filter(c => deckIds.has(c.id)) }
}

// Resets the peek to the new top 5 after a re-deal reshuffles the deck
function resetDeckPeek(state: GameState): GameState {
  if (!hasRelic(state.relicsActive, 'peek_5')) return state
  return { ...state, deckPeek: state.deck.slice(0, 5) }
}

function applyRedealRelics(state: GameState): GameState {
  if (!hasRelic(state.relicsActive, 'wild_on_redeal')) {
    return state
  }

  const redealCount = state.initialRedealsLeft - state.redealsLeft
  return {
    ...state,
    hand: [...state.hand, createRelicWildCard(`redeal-${redealCount}`)],
  }
}

function redealPenalty(relics: RelicId[], redealsUsed: number): number {
  if (redealsUsed === 0) return 0

  let penalty = REDEAL_PENALTY * redealsUsed
  if (hasRelic(relics, 'free_first_redeal') && redealsUsed >= 1) {
    penalty -= REDEAL_PENALTY
  }
  return penalty
}

export {
  BASE_REDEALS_LEFT,
  REDEAL_PENALTY,
  RELICS,
  applyMesaStartRelics,
  applyRedealRelics,
  createRelicWildCard,
  hasRelic,
  initialRedealsLeft,
  redealPenalty,
  refreshDeckPeek,
  resetDeckPeek,
  type Relic,
}
