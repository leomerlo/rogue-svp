import { useGame } from "@/ui/hooks/useGame"

const Controls = () => {
  const { gameState, dispatch } = useGame()

  const reDealHandler = () => {
    dispatch({ type: 'reDeal' })
  }

  return (
    <div className="flex justify-center">
      <button onClick={reDealHandler} disabled={gameState.redealsLeft === 0} className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
        Re-deal ({gameState.redealsLeft} left)
      </button>
    </div>
  )
}

export default Controls