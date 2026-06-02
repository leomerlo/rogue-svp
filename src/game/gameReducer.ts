import type { GameState, GameAction } from '@/game/types'
import { selectCard, deselectCard, applyMove, reDealCards, swapCard } from '@/game/movement'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { TOPOLOGY_COUNT } from '@/game/topologies'
import { createPathInitialState } from '@/test/utils/pathLevel'

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'selectCard':
      return selectCard(state, action.cardId)
    case 'deselectCard':
      return deselectCard(state)
    case 'placeCard':
      return applyMove(state, action.move)
    case 'swapCard':
      return swapCard(state, action.move)
    case 'resetGame':
      return createPathInitialState()
    case 'reDeal':
      return reDealCards(state)
    case 'changeLevel':
      return createGeneratedGameState(0, { seed: 42 })
    case 'advanceTopology': {
      if (state.status !== 'won' || state.topologyIndex === null) return state
      const nextIndex = state.topologyIndex + 1
      if (nextIndex >= TOPOLOGY_COUNT) return state
      return createGeneratedGameState(nextIndex, { seed: deckSeedFromState(state) })
    }
    default:
      return state
  }
}

function deckSeedFromState(state: GameState): number {
  const sample =
    state.hand[0] ?? state.deck[0] ?? Object.values(state.placedCards)[0]
  if (!sample) return 42
  const genMatch = /^gen-(\d+)-/.exec(sample.id)
  if (genMatch) return Number(genMatch[1])
  return 42
}
