import type { GameState, GameAction } from '@/game/types'
import { selectCard, deselectCard, applyMove, reDealCards, swapCard } from '@/game/movement'
import { createM11PathInitialState } from '@/test/utils/createInitialState'

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
      return createM11PathInitialState()
    case 'reDeal':
      return reDealCards(state)
    default:
      return state
  }
}