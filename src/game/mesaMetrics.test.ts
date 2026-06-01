import { describe, expect, it } from 'vitest'
import { AUTHORED_DECK } from '@/game/authoredDeck'
import { computeMesaMetrics, computeTopologyMetrics } from '@/game/mesaMetrics'
import type { TopologyDef } from '@/game/types'
import { createPathInitialState } from '@/test/utils/pathLevel'

function pathTopology(): TopologyDef {
  return {
    rows: 1,
    cols: 6,
    cells: Array.from({ length: 6 }, (_, col) => ({ row: 0, col, state: 'free' as const })),
    pinnedCount: 0,
  }
}

function ringTopology(): TopologyDef {
  return {
    rows: 3,
    cols: 3,
    cells: Array.from({ length: 9 }, (_, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      return { row, col, state: row === 1 && col === 1 ? ('blocked' as const) : ('free' as const) }
    }),
    pinnedCount: 0,
  }
}

function allDeckCards(state: ReturnType<typeof createPathInitialState>) {
  return [...state.hand, ...state.deck, ...Object.values(state.placedCards)]
}

describe('computeTopologyMetrics', () => {
  it('reports no bottlenecks and degree 2 for the ring', () => {
    const metrics = computeTopologyMetrics(ringTopology())
    expect(metrics.bottleneckCount).toBe(0)
    expect(metrics.avgSeatDegree).toBe(2)
  })

  it('reports two bottlenecks and avg degree 4/3 for the path', () => {
    const metrics = computeTopologyMetrics(pathTopology())
    expect(metrics.bottleneckCount).toBe(2)
    expect(metrics.avgSeatDegree).toBeCloseTo(10 / 6)
  })
})

describe('computeMesaMetrics', () => {
  it('computes wildRatio from the authored deck', () => {
    const metrics = computeMesaMetrics(ringTopology(), AUTHORED_DECK)

    expect(metrics.wildRatio).toBeCloseTo(3 / AUTHORED_DECK.length)
  })

  it('reports multiple solutions for the path level deck', () => {
    const state = createPathInitialState()
    const cards = allDeckCards(state)
    const metrics = computeMesaMetrics(pathTopology(), cards)

    expect(metrics.solutionCount).toBeGreaterThan(1)
  })

  it('caps solution count when arrangements exceed maxCount', () => {
    const state = createPathInitialState()
    const cards = allDeckCards(state)
    const metrics = computeMesaMetrics(pathTopology(), cards, { maxSolutionCount: 2 })

    expect(metrics.solutionCount).toBe(2)
    expect(metrics.solutionCountCapped).toBe(true)
  })

  it('includes topology metrics for authored-deck mesas', () => {
    const metrics = computeMesaMetrics(ringTopology(), AUTHORED_DECK)

    expect(metrics.bottleneckCount).toBe(0)
    expect(metrics.avgSeatDegree).toBe(2)
    expect(metrics.solutionCount).toBeGreaterThanOrEqual(1)
  })
})
