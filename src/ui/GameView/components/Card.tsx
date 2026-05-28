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
  const isWild = card.colorA === 'wild' && card.colorB === 'wild'

  const borderColor = selected
    ? 'border-blue-500'
    : happiness === 'happy' ? 'border-green-500'
    : happiness === 'unhappy' ? 'border-red-500'
    : 'border-gray-300';

  const cardBackground = isWild ? 
    'linear-gradient(135deg,red 0%,red 14.3%,orange 14.3%,orange 28.6%,yellow 28.6%,yellow 42.9%,lime 42.9%,lime 57.1%,cyan 57.1%,cyan 71.4%,blue 71.4%,blue 85.7%,violet 85.7%,violet 100%)'
    : `linear-gradient(to bottom right, ${colorA} 50%, ${colorB} 50%)`

  return (
    <div
      data-testid="card"
      className={`h-full w-full aspect-square overflow-hidden rounded border-2 ${borderColor} flex items-center justify-center`}
      style={{
        background: cardBackground,
      }}
      aria-label={`${card.colorA} / ${card.colorB}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      aria-disabled={disabled}
    >
      {isWild && <div className="text-black text-8xl font-bold">W</div>}
    </div>
  )
}

export default Card
