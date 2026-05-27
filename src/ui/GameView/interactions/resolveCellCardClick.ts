import { getCardCellIndex, isCardInHand } from "@/game/helpers"
import type { Cell, GameState } from "@/game/types"
import type { ResolvedAction } from "@/ui/GameView/interactions/types"

export function resolveCellCardClick(state: GameState, targetCell: Cell): ResolvedAction {
  // Global rule: if the game is over, there is no interaction
  if (state.status !== 'playing') return null

  const selectedId = state.selectedCardId
  const targetCardId = targetCell.cardId

  // No selected card
  if (selectedId === null) {
    if (targetCardId === null) return null
    return { type: 'selectCard', cardId: targetCardId }
  }

  // Click on the same selected card => cancel
  if (selectedId === targetCardId) {
    return { type: 'deselectCard' }
  }

  // Selected card comes from hand => place
  if (isCardInHand(state, selectedId)) {
    return {
      type: 'placeCard',
      move: { cardId: selectedId, row: targetCell.row, col: targetCell.col },
    }
  }

  // Selected card comes from placed cards => swap
  const fromCellIndex = getCardCellIndex(state, selectedId)
  if (fromCellIndex === -1) return { type: 'deselectCard' }
  const fromCell = state.cells[fromCellIndex]!

  return {
    type: 'swapCard',
    move: { from: { row: fromCell.row, col: fromCell.col }, to: { row: targetCell.row, col: targetCell.col } },
  }
}