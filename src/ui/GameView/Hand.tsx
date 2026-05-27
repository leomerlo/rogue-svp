import { useGameStore } from "@/store/gameStore"
import Card from "./Card"
import type { Card as CardType } from "@/game/types"

const Hand = () => {
  const hand = useGameStore((state) => state.gameState.hand)
  return (
    <div className="grid grid-cols-3 gap-2" data-testid="hand">
      {hand.map((card: CardType) => (
        <div key={card.id} className="flex align-center justify-center">
          <Card card={card} />
        </div>
      ))}
    </div>
  )
}

export default Hand