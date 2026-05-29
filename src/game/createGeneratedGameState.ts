import type { Card, GameState } from '@/game/types'
import { cellKey } from '@/game/helpers'
import { generateDeck } from '@/game/deck'
import { seededRandom, shuffled } from '@/game/seededRandom'
import { buildSolutionCards, freeSeats, seatKey } from '@/game/solutionAssignment'
import { getTopology } from '@/game/topologies'
import { topologyDefToCells } from '@/game/topology'

type GeneratedGameOptions = {
  seed?: number
  pinnedCount?: number
}

function createGeneratedGameState(
  topologyIndex: number,
  options: GeneratedGameOptions = {},
): GameState {
  const topology = getTopology(topologyIndex)
  const seed = options.seed ?? 0
  const seats = freeSeats(topology)
  const pinnedCount = options.pinnedCount ?? 0

  if (pinnedCount < 0 || pinnedCount > seats.length) {
    throw new Error(`pinnedCount must be between 0 and ${seats.length}`)
  }

  const solutionCards = buildSolutionCards(topology, seed)
  const cardBySeat = new Map<string, Card>()
  for (let i = 0; i < seats.length; i++) {
    cardBySeat.set(seatKey(seats[i]!.row, seats[i]!.col), solutionCards[i]!)
  }

  const pinnedSeats = shuffled(seats, seededRandom(seed + 3000)).slice(0, pinnedCount)
  const pinnedIds = pinnedSeats.map((seat) => cardBySeat.get(seatKey(seat.row, seat.col))!.id)

  const pinnedSeatKeys = new Set(pinnedSeats.map((s) => seatKey(s.row, s.col)))
  const placedCards: Record<string, Card> = {}
  for (const seat of pinnedSeats) {
    const card = cardBySeat.get(seatKey(seat.row, seat.col))!
    placedCards[card.id] = card
  }

  const deck = generateDeck(topology, {
    ...topology.deckParams,
    seed,
    excludeCardIds: pinnedIds,
  })
  const cells = topologyDefToCells(topology).map((cell) => {
    const key = cellKey(cell.row, cell.col)
    if (!pinnedSeatKeys.has(key)) return cell
    const card = cardBySeat.get(key)!
    return { ...cell, state: 'pinned' as const, cardId: card.id }
  })

  return {
    rows: topology.rows,
    cols: topology.cols,
    cells,
    hand: deck.cards.slice(0, 3),
    deck: deck.cards.slice(3),
    redealsLeft: 4,
    placedCards,
    status: 'playing',
    selectedCardId: null,
    topologyIndex,
  }
}

export { createGeneratedGameState }
