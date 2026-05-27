import Card from "./Card"
import type { Card as CardType } from "@/game/types"
import { useGame } from "@/ui/hooks/useGame"

const Hand = () => {
  const { gameState } = useGame()

  return (
    <div className="grid grid-cols-3 gap-2" data-testid="hand">
      {gameState.hand.map((card: CardType) => (
        <div key={card.id} className="flex align-center justify-center">
          <Card card={card} />
        </div>
      ))}
    </div>
  )
}

export default Hand