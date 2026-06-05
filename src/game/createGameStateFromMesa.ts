import type { Card, GameState, RelicId, TopologyDef } from '@/game/types'
import { applyMesaStartRelics, initialRedealsLeft } from '@/game/relics'
import { findValidArrangement } from '@/game/arrangementSolver'
import { cellKey } from '@/game/helpers'
import { seededRandom, shuffled } from '@/game/seededRandom'
import { freeSeats, seatKey } from '@/game/solutionAssignment'
import { topologyDefToCells } from '@/game/topology'

interface CreateGameStateFromMesaParams {
  deckSeed: number
  pinnedCount?: number
  relicsActive?: RelicId[]
}

function createGameStateFromMesa(
  topology: TopologyDef,
  deckCards: Card[],
  params: CreateGameStateFromMesaParams,
): GameState {
  const { deckSeed } = params
  const relicsActive = params.relicsActive ?? []
  const pinnedCount = params.pinnedCount ?? topology.pinnedCount
  const startingRedeals = initialRedealsLeft(relicsActive)
  const seats = freeSeats(topology)

  if (pinnedCount < 0 || pinnedCount > seats.length) {
    throw new Error(`pinnedCount must be between 0 and ${seats.length}`)
  }

  const arrangement = findValidArrangement(topology, deckCards)
  const cardBySeat = new Map<string, Card>()

  if (arrangement) {
    const cardsById = new Map(deckCards.map((card) => [card.id, card]))
    for (const [key, cardId] of arrangement) {
      cardBySeat.set(key, cardsById.get(cardId)!)
    }
  } else if (pinnedCount > 0) {
    throw new Error('No valid arrangement found for pinned seat placement')
  }

  const pinnedSeats = shuffled(seats, seededRandom(deckSeed + 3000)).slice(0, pinnedCount)
  const pinnedIds = pinnedSeats.map((seat) => cardBySeat.get(seatKey(seat.row, seat.col))!.id)

  const pinnedSeatKeys = new Set(pinnedSeats.map((s) => seatKey(s.row, s.col)))
  const placedCards: Record<string, Card> = {}
  for (const seat of pinnedSeats) {
    const card = cardBySeat.get(seatKey(seat.row, seat.col))!
    placedCards[card.id] = card
  }

  const playableCards = deckCards.filter((card) => !pinnedIds.includes(card.id))
  const cells = topologyDefToCells(topology).map((cell) => {
    const key = cellKey(cell.row, cell.col)
    if (!pinnedSeatKeys.has(key)) return cell
    const card = cardBySeat.get(key)!
    return { ...cell, state: 'pinned' as const, cardId: card.id }
  })

  const baseState: GameState = {
    rows: topology.rows,
    cols: topology.cols,
    cells,
    hand: playableCards.slice(0, 3),
    deck: playableCards.slice(3),
    redealsLeft: startingRedeals,
    initialRedealsLeft: startingRedeals,
    relicsActive,
    deckPeek: [],
    placedCards,
    status: 'playing',
    selectedCardId: null,
    topologyIndex: null,
  }

  return applyMesaStartRelics(baseState)
}

export { createGameStateFromMesa, type CreateGameStateFromMesaParams }
