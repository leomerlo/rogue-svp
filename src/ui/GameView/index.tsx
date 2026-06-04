import { useEffect } from 'react'
import Board from '@/ui/GameView/components/Board'
import Hand from '@/ui/GameView/components/Hand'
import Controls from '@/ui/GameView/components/Controls'
import StatusOverlay from '@/ui/GameView/components/StatusOverlay'
import { useGame } from '@/ui/hooks/useGame'
import { useRun } from '@/ui/hooks/useRun'
import { computeMesaScore } from '@/game/mesaScore'
import { RUN_MESA_COUNT } from '@/game/runReducer'

const GameView = () => {
  const { gameState, dispatch } = useGame()
  const { runState, runDispatch } = useRun()

  useEffect(() => {
    if (gameState.status === 'won') {
      const mesaScore = computeMesaScore(gameState)
      const isLastMesa = runState.topologyIndex >= RUN_MESA_COUNT - 1
      if (isLastMesa) {
        runDispatch({ type: 'advanceLevel', mesaScore })
      } else {
        runDispatch({ type: 'startReward', mesaScore })
      }
    } else if (gameState.status === 'lost') {
      runDispatch({ type: 'endRunLoss' })
    }
  }, [gameState.status, runDispatch, runState.topologyIndex])

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
