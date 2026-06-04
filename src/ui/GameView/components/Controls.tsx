import { useGame } from '@/ui/hooks/useGame'
import { useRun } from '@/ui/hooks/useRun'

const Controls = () => {
  const { gameState, dispatch } = useGame()
  const { runState } = useRun()

  const reDealHandler = () => {
    dispatch({ type: 'reDeal' })
  }

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={reDealHandler}
        disabled={gameState.redealsLeft === 0}
        className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Re-deal ({gameState.redealsLeft} left)
      </button>
      <button
        onClick={() => dispatch({ type: 'changeLevel', level: 'generated', relicsActive: runState.relicsActive })}
        className="bg-emerald-600 text-white p-2 rounded-md"
      >
        Generated
      </button>
    </div>
  )
}

export default Controls
