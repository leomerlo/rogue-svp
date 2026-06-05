import Card from '@/ui/GameView/components/Card'
import { useGame } from '@/ui/hooks/useGame'

const DeckInfo = () => {
  const { gameState } = useGame()
  const { deckPeek, deck, relicsActive } = gameState

  const nextDraw = relicsActive.includes('reveal_hand_next') ? deck[0] ?? null : null

  if (deckPeek.length === 0 && nextDraw === null) return null

  return (
    <div className="flex flex-col gap-2">
      {deckPeek.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Next {deckPeek.length} in deck
          </span>
          <div className="flex gap-1">
            {deckPeek.map((card) => (
              <div key={card.id} className="w-10 h-10">
                <Card card={card} disabled />
              </div>
            ))}
          </div>
        </div>
      )}
      {nextDraw !== null && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Next draw
          </span>
          <div className="w-10 h-10">
            <Card card={nextDraw} disabled />
          </div>
        </div>
      )}
    </div>
  )
}

export default DeckInfo
