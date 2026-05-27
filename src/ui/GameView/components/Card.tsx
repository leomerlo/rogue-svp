import type { Color, Card as CardType } from "@/game/types"

const COLOR_FILL: Record<Color, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  wild: "#a855f7",
}

type CardProps = {
  card: CardType
  happiness?: 'happy' | 'unhappy'
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Card = ({ card, happiness, selected, disabled, onClick }: CardProps) => {
  const colorA = COLOR_FILL[card.colorA]
  const colorB = COLOR_FILL[card.colorB]

  const borderColor = selected
    ? 'border-blue-500'
    : happiness === 'happy' ? 'border-green-500'
    : happiness === 'unhappy' ? 'border-red-500'
    : 'border-gray-300';

  return (
    <div
      data-testid="card"
      className={`h-full w-full aspect-square overflow-hidden rounded border-2 ${borderColor}`}
      style={{
        background: `linear-gradient(to bottom right, ${colorA} 50%, ${colorB} 50%)`,
      }}
      aria-label={`${card.colorA} / ${card.colorB}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      aria-disabled={disabled}
    />
  )
}

export default Card
