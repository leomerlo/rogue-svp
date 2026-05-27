import { useGameStore } from '@/store/gameStore'
import Board from './Board'
import Hand from './Hand'
import ScenarioPicker from './ScenarioPicker'
import StatusOverlay from './StatusOverlay'

const GameView = () => {
  const status = useGameStore((state) => state.gameState.status)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 mx-auto" data-testid="game-view">
      <ScenarioPicker />
      <div className="relative flex flex-col gap-2">
        <Board />
        <Hand />
        <StatusOverlay status={status} />
      </div>
    </div>
  )
}

export default GameView
