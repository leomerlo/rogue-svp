import type { Card, DeckDef, DeckParams, TopologyDef } from '@/game/types'
import { seededRandom, shuffled } from '@/game/seededRandom'
import { buildSolutionCards, REGULAR_COLORS } from '@/game/solutionAssignment'

const DEFAULT_BUFFER_SIZE = 6
const DEFAULT_WILD_COUNT = 1

function buildBufferCards(options: {
  count: number
  wildCount: number
  seed: number
}): Card[] {
  const { count, wildCount, seed } = options
  const rng = seededRandom(seed + 1000)
  const cards: Card[] = []

  for (let i = 0; i < count; i++) {
    const id = `gen-${seed}-buf-${i}`
    if (i < wildCount) {
      cards.push({ id, colorA: 'wild', colorB: 'wild' })
    } else {
      const colorA = REGULAR_COLORS[Math.floor(rng() * REGULAR_COLORS.length)]!
      const colorB = REGULAR_COLORS[Math.floor(rng() * REGULAR_COLORS.length)]!
      cards.push({ id, colorA, colorB })
    }
  }

  return cards
}

function generateDeck(topology: TopologyDef, params?: DeckParams): DeckDef {
  const seed = params?.seed ?? ((Math.random() * 2 ** 32) >>> 0)
  const bufferSize = params?.bufferSize ?? topology.deckParams?.bufferSize ?? DEFAULT_BUFFER_SIZE
  const wildCount = params?.wildCount ?? topology.deckParams?.wildCount ?? DEFAULT_WILD_COUNT

  const excludeSet = new Set(params?.excludeCardIds ?? [])
  const solutionCards = buildSolutionCards(topology, seed)
  const playableCards = solutionCards.filter((c) => !excludeSet.has(c.id))
  const bufferCards = buildBufferCards({
    count: bufferSize,
    wildCount,
    seed,
  })

  const cards = shuffled(
    [...playableCards, ...bufferCards],
    seededRandom(seed + 2000),
  )

  return { cards }
}

export { generateDeck, DEFAULT_BUFFER_SIZE, DEFAULT_WILD_COUNT }
