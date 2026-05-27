import { useGameStore } from "@/store/gameStore"
import Cell from "./Cell"

const Board = () => {
  const { cells, cols, placedCards } = useGameStore((state) => state.gameState)
  
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