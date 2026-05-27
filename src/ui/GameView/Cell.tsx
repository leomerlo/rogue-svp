import type { Cell as CellType } from "@/game/types"
import type { Card as CardType } from "@/game/types";
import Card from "./Card";

const Cell = ({ cell, card }: { cell: CellType; card: CardType | null }) => {
  if (card !== null) return <Card card={card} />
  return (
    <div
      data-testid="empty-cell"
      className={`h-40 w-40 ... ${cell.state === 'blocked' ? 'bg-gray-500' : 'bg-white'}`}
    />
  )
}

export default Cell