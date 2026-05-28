import type { GameState, GameAction } from '@/game/types'
import { selectCard, deselectCard, applyMove, reDealCards, swapCard } from '@/game/movement'
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
      {
        const level = action.level === 'path' ? createPathInitialState() : createRingInitialState()
        return level
      }
    default:
      return state
  }
}