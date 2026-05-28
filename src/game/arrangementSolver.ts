import { cellKey, edgesMatch } from '@/game/helpers'
import type { Card, TopologyDef } from '@/game/types'
import { freeSeats, neighborSeats, seatKey } from '@/game/solutionAssignment'

function findValidArrangement(
  topology: TopologyDef,
  cards: Card[],
): Map<string, string> | null {
  const seats = freeSeats(topology)
  const freeSet = new Set(seats.map((s) => cellKey(s.row, s.col)))
  const assignment = new Map<string, string>()
  const cardsById = new Map(cards.map((c) => [c.id, c]))

  function edgesConsistent(seat: { row: number; col: number }, card: Card): boolean {
    for (const neighbor of neighborSeats(topology, seat, freeSet)) {
      const nKey = seatKey(neighbor.row, neighbor.col)
      const neighborCardId = assignment.get(nKey)
      if (neighborCardId === undefined) continue

      const neighborCard = cardsById.get(neighborCardId)!
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

  function backtrack(seatIndex: number, usedCardIds: Set<string>): boolean {
    if (seatIndex >= seats.length) return true

    const seat = seats[seatIndex]!
    const key = seatKey(seat.row, seat.col)

    for (const card of cards) {
      if (usedCardIds.has(card.id)) continue
      if (!edgesConsistent(seat, card)) continue

      assignment.set(key, card.id)
      usedCardIds.add(card.id)

      if (backtrack(seatIndex + 1, usedCardIds)) return true

      assignment.delete(key)
      usedCardIds.delete(card.id)
    }

    return false
  }

  if (seats.length > cards.length) return null

  if (backtrack(0, new Set())) {
    return assignment
  }

  return null
}

export { findValidArrangement }
