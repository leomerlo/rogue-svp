import type { Color, Card as CardType } from "@/game/types"
import { useGame } from "@/ui/hooks/useGame"

const COLOR_FILL: Record<Color, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  wild: "#a855f7",
}

const Card = ({ card }: { card: CardType }) => {
  const { gameState, dispatch } = useGame()
  const colorA = COLOR_FILL[card.colorA]
  const colorB = COLOR_FILL[card.colorB]

  const selectCardHandler = () => {
      if (gameState.selectedCardId === card.id) {
        dispatch({ type: 'deselectCard' })
      } else {
        dispatch({ type: 'selectCard', cardId: card.id })
      }
  }

  return (
    <div
      data-testid="card"
      className={`h-full w-full aspect-square overflow-hidden rounded border border-gray-300 ${gameState.selectedCardId === card.id ? 'border-2 border-blue-500!' : ''}`}
      style={{
        background: `linear-gradient(to bottom right, ${colorA} 50%, ${colorB} 50%)`,
      }}
      aria-label={`${card.colorA} / ${card.colorB}`}
      onClick={() => selectCardHandler()}
      role="button"
    />
  )
}

export default Card
