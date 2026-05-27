import Cell from "./Cell"
import { useGame } from "@/ui/hooks/useGame";

const Board = () => {
  const { gameState } = useGame()
  const { cols, cells, placedCards } = gameState;
  
  return (
    <div
      className="grid gap-2 w-full"
      data-testid="board"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((cell) => (
        <Cell
          key={`${cell.row}-${cell.col}`}
          cell={cell}
          card={cell.cardId ? placedCards[cell.cardId] ?? null : null}
        />
      ))}
    </div>
  )
}

export default Board