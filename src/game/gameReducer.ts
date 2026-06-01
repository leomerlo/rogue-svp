import type { GameState, GameAction } from '@/game/types'
import { selectCard, deselectCard, applyMove, reDealCards, swapCard } from '@/game/movement'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { TOPOLOGY_COUNT } from '@/game/topologies'
import { createPathInitialState } from '@/test/utils/pathLevel'
import { createRingInitialState } from '@/test/utils/ringLevel'

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
      switch (action.level) {
        case 'path': return createPathInitialState()
        case 'ring': return createRingInitialState()
        case 'generated': return createGeneratedGameState(0, { seed: 42 })
        default: return state
      }
    case 'advanceTopology': {
      const nextIndex = (state.topologyIndex ?? -1) + 1
      if (nextIndex >= TOPOLOGY_COUNT) return state
      return createGeneratedGameState(nextIndex, { seed: nextIndex * 1000 + 42 })
    }
    default:
      return state
  }
}
