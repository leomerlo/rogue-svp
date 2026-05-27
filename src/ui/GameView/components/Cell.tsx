import type { Cell as CellType } from "@/game/types"
import type { Card as CardType } from "@/game/types";
import Card from "./Card";
import { useGame } from "@/ui/hooks/useGame";
import { isHappy } from "@/game/helpers";

const Cell = ({ cell, card }: { cell: CellType; card: CardType | null }) => {
  const { gameState, dispatch } = useGame()
  const happy = card !== null && isHappy(cell, gameState);
  if (card !== null) return <Card card={card} happiness={happy ? 'happy' : 'unhappy'} />

  const handleCellClick = () => {
    if (gameState.selectedCardId === null) return;
    dispatch({ type: 'placeCard', move: { type: 'place', cardId: gameState.selectedCardId, row: cell.row, col: cell.col } })
  }
  
  return (
    <div
      data-testid="empty-cell"
      className={`h-full w-full aspect-square overflow-hidden rounded border border-gray-300 ... ${cell.state === 'blocked' ? 'bg-gray-500' : 'bg-white'}`}
      onClick={handleCellClick}
      role="button"
    />
  )
}

export default Cell