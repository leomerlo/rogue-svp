import { cellKey, edgesMatch } from '@/game/helpers'
import type { Card, TopologyDef } from '@/game/types'
import { freeSeats, neighborSeats, seatKey } from '@/game/solutionAssignment'

const DEFAULT_MAX_COUNT = 100

type SearchContext = {
  seats: ReturnType<typeof freeSeats>
  playableSet: Set<string>
  cardsById: Map<string, Card>
  assignment: Map<string, string>
}

function buildSearchContext(
  topology: TopologyDef,
  cards: Card[],
  fixedBySeat: Map<string, Card>,
): SearchContext | null {
  const seats = freeSeats(topology)
  const playableSet = new Set(
    topology.cells
      .filter((c) => c.state === 'free' || c.state === 'pinned')
      .map((c) => cellKey(c.row, c.col)),
  )
  const assignment = new Map<string, string>()
  const cardsById = new Map(cards.map((c) => [c.id, c]))

  for (const [key, card] of fixedBySeat) {
    assignment.set(key, card.id)
    cardsById.set(card.id, card)
  }

  const usedCardIds = new Set(fixedBySeat.values().map((c) => c.id))
  const availableCards = cards.filter((c) => !usedCardIds.has(c.id))
  if (seats.length > availableCards.length) return null

  return { seats, playableSet, cardsById, assignment }
}

function edgesConsistent(
  ctx: SearchContext,
  seat: { row: number; col: number },
  card: Card,
  topology: TopologyDef,
): boolean {
  for (const neighbor of neighborSeats(topology, seat, ctx.playableSet)) {
    const nKey = seatKey(neighbor.row, neighbor.col)
    const neighborCardId = ctx.assignment.get(nKey)
    if (neighborCardId === undefined) continue

    const neighborCard = ctx.cardsById.get(neighborCardId)!
    const dr = neighbor.row - seat.row
    const dc = neighbor.col - seat.col

    if (dr === 0 && dc === 1) {
      if (!edgesMatch(card, 'right', neighborCard, 'left')) return false
    } else if (dr === 0 && dc === -1) {
      if (!edgesMatch(card, 'left', neighborCard, 'right')) return false
    } else if (dr === 1 && dc === 0) {
      if (!edgesMatch(card, 'bottom', neighborCard, 'top')) return false
    } else if (dr === -1 && dc === 0) {
      if (!edgesMatch(card, 'top', neighborCard, 'bottom')) return false
    }
  }
  return true
}

function findValidArrangement(
  topology: TopologyDef,
  cards: Card[],
  fixedBySeat: Map<string, Card> = new Map(),
): Map<string, string> | null {
  const ctx = buildSearchContext(topology, cards, fixedBySeat)
  if (ctx === null) return null

  const usedCardIds = new Set(fixedBySeat.values().map((c) => c.id))
  const availableCards = cards.filter((c) => !usedCardIds.has(c.id))

  function backtrack(seatIndex: number, usedIds: Set<string>, pool: Card[]): boolean {
    if (seatIndex >= ctx.seats.length) return true

    const seat = ctx.seats[seatIndex]!
    const key = seatKey(seat.row, seat.col)

    for (const card of pool) {
      if (usedIds.has(card.id)) continue
      if (!edgesConsistent(ctx, seat, card, topology)) continue

      ctx.assignment.set(key, card.id)
      usedIds.add(card.id)

      if (backtrack(seatIndex + 1, usedIds, pool)) return true

      ctx.assignment.delete(key)
      usedIds.delete(card.id)
    }

    return false
  }

  if (backtrack(0, usedCardIds, availableCards)) {
    return ctx.assignment
  }

  return null
}

function countValidArrangements(
  topology: TopologyDef,
  cards: Card[],
  options?: { maxCount?: number; fixedBySeat?: Map<string, Card> },
): { count: number; capped: boolean } {
  const maxCount = options?.maxCount ?? DEFAULT_MAX_COUNT
  const fixedBySeat = options?.fixedBySeat ?? new Map()
  const ctx = buildSearchContext(topology, cards, fixedBySeat)
  if (ctx === null) return { count: 0, capped: false }

  const usedCardIds = new Set(fixedBySeat.values().map((c) => c.id))
  const availableCards = cards.filter((c) => !usedCardIds.has(c.id))
  let count = 0

  function backtrack(seatIndex: number, usedIds: Set<string>, pool: Card[]): void {
    if (count >= maxCount) return
    if (seatIndex >= ctx.seats.length) {
      count++
      return
    }

    const seat = ctx.seats[seatIndex]!
    const key = seatKey(seat.row, seat.col)

    for (const card of pool) {
      if (usedIds.has(card.id)) continue
      if (!edgesConsistent(ctx, seat, card, topology)) continue

      ctx.assignment.set(key, card.id)
      usedIds.add(card.id)

      backtrack(seatIndex + 1, usedIds, pool)

      ctx.assignment.delete(key)
      usedIds.delete(card.id)

      if (count >= maxCount) return
    }
  }

  backtrack(0, usedCardIds, availableCards)
  return { count, capped: count >= maxCount }
}

export { countValidArrangements, findValidArrangement, DEFAULT_MAX_COUNT }
