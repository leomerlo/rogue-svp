import type {
  Card,
  DeckDef,
  DifficultyTarget,
  GameState,
  GenerateMesaParams,
  TopologyDef,
} from '@/game/types'
import { cellKey } from '@/game/helpers'
import { generateMesa } from '@/game/generateMesa'
import { seededRandom, shuffled } from '@/game/seededRandom'
import { buildSolutionCards, freeSeats, seatKey } from '@/game/solutionAssignment'
import { topologyDefToCells } from '@/game/topology'

interface CreateGameStateFromMesaParams {
  deckSeed: number
  pinnedCount?: number
}

interface CreateCalibratedGeneratedGameStateParams {
  seed?: number
  pinnedCount?: number
  mesaParams?: Omit<GenerateMesaParams, 'seed'>
}

function createGameStateFromMesa(
  topology: TopologyDef,
  deck: DeckDef,
  params: CreateGameStateFromMesaParams,
): GameState {
  const { deckSeed } = params
  const pinnedCount = params.pinnedCount ?? 0
  const seats = freeSeats(topology)

  if (pinnedCount < 0 || pinnedCount > seats.length) {
    throw new Error(`pinnedCount must be between 0 and ${seats.length}`)
  }

  const solutionCards = buildSolutionCards(topology, deckSeed)
  const cardBySeat = new Map<string, Card>()
  for (let i = 0; i < seats.length; i++) {
    cardBySeat.set(seatKey(seats[i]!.row, seats[i]!.col), solutionCards[i]!)
  }

  const pinnedSeats = shuffled(seats, seededRandom(deckSeed + 3000)).slice(0, pinnedCount)
  const pinnedIds = pinnedSeats.map((seat) => cardBySeat.get(seatKey(seat.row, seat.col))!.id)

  const pinnedSeatKeys = new Set(pinnedSeats.map((s) => seatKey(s.row, s.col)))
  const placedCards: Record<string, Card> = {}
  for (const seat of pinnedSeats) {
    const card = cardBySeat.get(seatKey(seat.row, seat.col))!
    placedCards[card.id] = card
  }

  const playableCards = deck.cards.filter((card) => !pinnedIds.includes(card.id))
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
    hand: playableCards.slice(0, 3),
    deck: playableCards.slice(3),
    redealsLeft: 4,
    placedCards,
    status: 'playing',
    selectedCardId: null,
    topologyIndex: null,
  }
}

function createCalibratedGeneratedGameState(
  difficultyTarget: DifficultyTarget,
  params?: CreateCalibratedGeneratedGameStateParams,
): GameState {
  const seed = params?.seed ?? 42
  const { topology, deck, deckSeed } = generateMesa(difficultyTarget, {
    seed,
    ...params?.mesaParams,
  })

  return createGameStateFromMesa(topology, deck, {
    deckSeed,
    pinnedCount: params?.pinnedCount ?? 0,
  })
}

export {
  createCalibratedGeneratedGameState,
  createGameStateFromMesa,
  type CreateCalibratedGeneratedGameStateParams,
  type CreateGameStateFromMesaParams,
}
