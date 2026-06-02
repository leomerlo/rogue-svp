import { getCardValue } from '@/game/authoredDeck'
import { hasRelic, redealPenalty } from '@/game/relics'
import type { GameState } from '@/game/types'

function sumPlacedCardValues(state: GameState): number {
  return Object.values(state.placedCards).reduce(
    (sum, card) => sum + getCardValue(card),
    0,
  )
}

function computeMesaScore(state: GameState): number {
  if (state.status !== 'won') return 0

  const cardSum = sumPlacedCardValues(state)
  const redealsUsed = state.initialRedealsLeft - state.redealsLeft
  let score = cardSum - redealPenalty(state.relicsActive, redealsUsed)

  if (hasRelic(state.relicsActive, 'score_streak') && redealsUsed === 0) {
    score = Math.floor(score * 1.5)
  }

  if (hasRelic(state.relicsActive, 'score_no_loss')) {
    score = Math.max(score, cardSum)
  }

  return score
}

export { computeMesaScore, sumPlacedCardValues }
