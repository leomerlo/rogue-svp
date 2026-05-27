import type { Cell as CellType } from "@/game/types"
import type { Card as CardType } from "@/game/types";
import Card from "./Card";
import { useGame } from "@/ui/hooks/useGame";
import { isHappy } from "@/game/helpers";
import { resolveCellCardClick } from "../interactions/resolveCellCardClick";

const Cell = ({ cell, card }: { cell: CellType; card: CardType | null }) => {
  const { gameState, dispatch } = useGame()
  const happy = card !== null && isHappy(cell, gameState);

  const handleCellClick = () => {
    const action = resolveCellCardClick(gameState, cell);
    if (action) dispatch(action);
  }

  if (card !== null) return <Card card={card} happiness={happy ? 'happy' : 'unhappy'} onClick={handleCellClick} selected={gameState.selectedCardId === cell.cardId} />
  
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