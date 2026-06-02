import type { Card, RegularColor } from '@/game/types'
import { seededRandom, shuffled } from '@/game/seededRandom'

type AuthoredCardDef = readonly [value: number, colorLeft: number, colorRight: number]

/** Original RSVP board-game deck: [value, leftColor, rightColor]. Colors 1–4; 5 = wild. */
const AUTHORED_CARD_DEFS: AuthoredCardDef[] = [
  [0, 5, 5],
  [0, 5, 5],
  [0, 5, 5],
  [5, 1, 1],
  [5, 1, 2],
  [5, 1, 3],
  [5, 1, 4],
  [5, 1, 1],
  [5, 1, 2],
  [5, 1, 3],
  [5, 1, 4],
  [5, 1, 1],
  [5, 2, 1],
  [5, 3, 1],
  [5, 4, 1],
  [5, 1, 1],
  [5, 2, 1],
  [5, 3, 1],
  [5, 4, 1],
  [5, 2, 1],
  [5, 2, 2],
  [5, 2, 3],
  [5, 2, 4],
  [5, 2, 1],
  [5, 2, 2],
  [5, 2, 3],
  [5, 2, 4],
  [10, 1, 2],
  [10, 2, 2],
  [10, 3, 2],
  [10, 4, 2],
  [10, 1, 2],
  [10, 2, 2],
  [10, 3, 2],
  [10, 4, 2],
  [10, 3, 1],
  [10, 3, 2],
  [10, 3, 3],
  [10, 3, 4],
  [10, 3, 1],
  [10, 3, 2],
  [10, 3, 3],
  [10, 3, 4],
  [15, 1, 3],
  [15, 2, 3],
  [15, 3, 3],
  [15, 4, 3],
  [15, 1, 3],
  [15, 2, 3],
  [15, 3, 3],
  [15, 4, 3],
  [15, 4, 1],
  [15, 4, 2],
  [15, 4, 3],
  [15, 4, 4],
  [20, 4, 1],
  [20, 4, 2],
  [20, 4, 3],
  [20, 4, 4],
  [20, 1, 4],
  [20, 2, 4],
  [20, 3, 4],
  [20, 4, 4],
  [25, 1, 4],
  [25, 2, 4],
  [25, 3, 4],
  [25, 4, 4],
]

const COLOR_BY_INDEX: Record<number, RegularColor> = {
  1: 'red',
  2: 'blue',
  3: 'green',
  4: 'yellow',
}

function authoredDefToCard(def: AuthoredCardDef, index: number): Card {
  const [, colorLeft, colorRight] = def
  const id = `authored-${index}`

  if (colorLeft === 5 || colorRight === 5) {
    return { id, colorA: 'wild', colorB: 'wild' }
  }

  return {
    id,
    colorA: COLOR_BY_INDEX[colorLeft]!,
    colorB: COLOR_BY_INDEX[colorRight]!,
  }
}

const AUTHORED_DECK: Card[] = AUTHORED_CARD_DEFS.map(authoredDefToCard)

function shuffleAuthoredDeck(seed: number): Card[] {
  return shuffled(AUTHORED_DECK, seededRandom(seed))
}

function getCardValue(card: Card): number {
  const match = /^authored-(\d+)$/.exec(card.id)
  if (match) {
    return AUTHORED_CARD_DEFS[Number(match[1])]![0]
  }
  return 0
}

export {
  AUTHORED_CARD_DEFS,
  AUTHORED_DECK,
  getCardValue,
  shuffleAuthoredDeck,
}
