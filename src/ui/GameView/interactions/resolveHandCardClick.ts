import type { GameState } from "@/game/types"
import type { HandResolvedAction } from "@/ui/GameView/interactions/types"

export function resolveHandCardClick(state: GameState, cardId: string): HandResolvedAction {
  if (state.status !== 'playing') return null

  if (state.selectedCardId === cardId) {
    return { type: 'deselectCard' }
  }

  return { type: 'selectCard', cardId }
}