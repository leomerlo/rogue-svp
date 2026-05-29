import { useGame } from '@/ui/hooks/useGame'
import type { DifficultyTarget } from '@/game/types'

const Controls = () => {
  const { gameState, dispatch } = useGame()

  const reDealHandler = () => {
    dispatch({ type: 'reDeal' })
  }

  const changeLevelHandler = (level: 'path' | 'ring') => {
    dispatch({ type: 'changeLevel', level })
  }

  const changeGeneratedHandler = (difficultyTarget: DifficultyTarget) => {
    dispatch({ type: 'changeLevel', level: 'generated', difficultyTarget })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex justify-center gap-4">
        <button
          onClick={reDealHandler}
          disabled={gameState.redealsLeft === 0}
          className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Re-deal ({gameState.redealsLeft} left)
        </button>
        <button
          onClick={() => changeLevelHandler('path')}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Path
        </button>
        <button
          onClick={() => changeLevelHandler('ring')}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Ring
        </button>
      </div>
      <div className="flex justify-center gap-2" aria-label="Generated difficulty">
        {([1, 2, 3, 4, 5] as const).map((level) => (
          <button
            key={level}
            onClick={() => changeGeneratedHandler(level)}
            className="bg-emerald-600 text-white px-3 py-2 rounded-md text-sm"
          >
            Gen {level}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Controls
