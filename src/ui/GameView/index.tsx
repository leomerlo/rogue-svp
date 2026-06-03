import { useEffect } from 'react'
import Board from '@/ui/GameView/components/Board'
import Hand from '@/ui/GameView/components/Hand'
import Controls from '@/ui/GameView/components/Controls'
import StatusOverlay from '@/ui/GameView/components/StatusOverlay'
import { useGame } from '@/ui/hooks/useGame'
import { useRun } from '@/ui/hooks/useRun'
import { computeMesaScore } from '@/game/mesaScore'

const GameView = () => {
  const { gameState, dispatch } = useGame()
  const { runDispatch } = useRun()

  useEffect(() => {
    if (gameState.status === 'won') {
      runDispatch({ type: 'advanceLevel', mesaScore: computeMesaScore(gameState) })
    } else if (gameState.status === 'lost') {
      runDispatch({ type: 'endRunLoss' })
    }
  }, [gameState.status, runDispatch])

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 mx-auto" data-testid="game-view">
      <button onClick={() => {
        dispatch({ type: 'resetGame' })
      }}>
        Reset Game
      </button>
      <div className="relative flex flex-col gap-2">
        <Board />
        <Hand />
        <Controls />
        <StatusOverlay status={gameState.status} />
      </div>
    </div>
  )
}

export default GameView
