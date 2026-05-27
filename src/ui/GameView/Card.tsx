import type { Color, Card as CardType } from "@/game/types"

const COLOR_FILL: Record<Color, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  wild: "#a855f7",
}

const Card = ({ card }: { card: CardType }) => {
  const colorA = COLOR_FILL[card.colorA]
  const colorB = COLOR_FILL[card.colorB]

  return (
    <div
      data-testid="card"
      className="h-40 w-40 overflow-hidden rounded border border-gray-300"
      style={{
        background: `linear-gradient(to bottom right, ${colorA} 50%, ${colorB} 50%)`,
      }}
      aria-label={`${card.colorA} / ${card.colorB}`}
    />
  )
}

export default Card
