import Board from "./Board"
import Hand from "./Hand"

const GameView = () => {
  return (
    <div className="flex flex-col gap-2" data-testid="game-view">
      <Board />
      <Hand />
    </div>
  )
}

export default GameView
