import type { Color, Card as CardType } from "@/game/types"
import { useGame } from "@/ui/hooks/useGame"

type Happiness = 'happy' | 'unhappy';

const COLOR_FILL: Record<Color, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  wild: "#a855f7",
}

const Card = ({ card, happiness }: { card: CardType, happiness?: Happiness }) => {
  const { gameState, dispatch } = useGame()
  const colorA = COLOR_FILL[card.colorA]
  const colorB = COLOR_FILL[card.colorB]

  const borderColor = gameState.selectedCardId === card.id
    ? 'border-blue-500'
    : happiness === 'happy' ? 'border-green-500'
    : happiness === 'unhappy' ? 'border-red-500'
    : 'border-gray-300';

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
      className={`h-full w-full aspect-square overflow-hidden rounded border-2 ${borderColor}`}
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
