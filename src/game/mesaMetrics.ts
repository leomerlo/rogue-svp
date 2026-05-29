import { countValidArrangements, DEFAULT_MAX_COUNT } from '@/game/arrangementSolver'
import type { DeckDef, MesaMetrics, TopologyDef } from '@/game/types'
import { freeSeats, neighborSeats } from '@/game/solutionAssignment'

function countWilds(cards: { colorA: string }[]): number {
  return cards.filter((c) => c.colorA === 'wild').length
}

function computeTopologyMetrics(topology: TopologyDef): {
  bottleneckCount: number
  avgSeatDegree: number
} {
  const seats = freeSeats(topology)
  const freeSet = new Set(seats.map((s) => `${s.row},${s.col}`))

  let bottleneckCount = 0
  let degreeSum = 0

  for (const seat of seats) {
    const degree = neighborSeats(topology, seat, freeSet).length
    degreeSum += degree
    if (degree === 1) bottleneckCount++
  }

  const avgSeatDegree = seats.length === 0 ? 0 : degreeSum / seats.length

  return { bottleneckCount, avgSeatDegree }
}

function computeMesaMetrics(
  topology: TopologyDef,
  deck: DeckDef,
  options?: { maxSolutionCount?: number },
): MesaMetrics {
  const maxSolutionCount = options?.maxSolutionCount ?? DEFAULT_MAX_COUNT
  const { count, capped } = countValidArrangements(topology, deck.cards, {
    maxCount: maxSolutionCount,
  })
  const { bottleneckCount, avgSeatDegree } = computeTopologyMetrics(topology)
  const deckSize = deck.cards.length
  const wildRatio = deckSize === 0 ? 0 : countWilds(deck.cards) / deckSize

  return {
    solutionCount: count,
    solutionCountCapped: capped,
    wildRatio,
    bottleneckCount,
    avgSeatDegree,
  }
}

export { computeMesaMetrics, computeTopologyMetrics }
