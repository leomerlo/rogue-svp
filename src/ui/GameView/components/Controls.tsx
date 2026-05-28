import { useGame } from "@/ui/hooks/useGame"

const Controls = () => {
  const { gameState, dispatch } = useGame()

  const reDealHandler = () => {
    dispatch({ type: 'reDeal' })
  }

  const changeLevelHandler = (level: 'path' | 'ring' | 'generated') => {
    dispatch({ type: 'changeLevel', level })
  }

  return (
    <div className="flex justify-center gap-4">
      <button onClick={reDealHandler} disabled={gameState.redealsLeft === 0} className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
        Re-deal ({gameState.redealsLeft} left)
      </button>
      <button onClick={() => changeLevelHandler('path')} className="bg-blue-500 text-white p-2 rounded-md">Path</button>
      <button onClick={() => changeLevelHandler('ring')} className="bg-blue-500 text-white p-2 rounded-md">Ring</button>
      <button onClick={() => changeLevelHandler('generated')} className="bg-blue-500 text-white p-2 rounded-md">Generated</button>
    </div>
  )
}

export default Controls