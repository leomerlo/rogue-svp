import Card from "./Card"
import type { Card as CardType } from "@/game/types"
import { useGame } from "@/ui/hooks/useGame"
import { resolveHandCardClick } from "@/ui/GameView/interactions/resolveHandCardClick"

const Hand = () => {
  const { gameState, dispatch } = useGame()

  const selectCardHandler = (cardId: string) => {
    const action = resolveHandCardClick(gameState, cardId);
    if (action) dispatch(action);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2" data-testid="hand">
        {gameState.hand.map((card: CardType) => (
          <div key={card.id} className="flex align-center justify-center">
            <Card card={card} selected={gameState.selectedCardId === card.id} onClick={() => selectCardHandler(card.id)} />
          </div>
        ))}
      </div>
      <button onClick={() => dispatch({ type: 'reDeal' })} disabled={gameState.redealsLeft === 0} className={`bg-blue-500 text-white p-2 rounded-md ${gameState.redealsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Re-deal ({gameState.redealsLeft} left)
      </button>
    </div>
  )
}

export default Hand