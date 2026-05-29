import { describe, expect, it } from 'vitest'
import { computeMesaMetrics, computeTopologyMetrics } from '@/game/mesaMetrics'
import { generateDeck } from '@/game/deck'
import type { TopologyDef } from '@/game/types'
import { createPathInitialState } from '@/test/utils/pathLevel'
import { createRingInitialState } from '@/test/utils/ringLevel'

function pathTopology(): TopologyDef {
  return {
    rows: 1,
    cols: 6,
    cells: Array.from({ length: 6 }, (_, col) => ({ row: 0, col, state: 'free' as const })),
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
  it('computes wildRatio from deck wild count', () => {
    const topology = ringTopology()
    const deck = generateDeck(topology, { seed: 1, wildCount: 2, bufferSize: 4 })
    const metrics = computeMesaMetrics(topology, deck)

    expect(metrics.wildRatio).toBeCloseTo(2 / deck.cards.length)
  })

  it('reports multiple solutions for the path level deck', () => {
    const state = createPathInitialState()
    const cards = allDeckCards(state)
    const deck = { cards }
    const metrics = computeMesaMetrics(pathTopology(), deck)

    expect(metrics.solutionCount).toBeGreaterThan(1)
  })

  it('caps solution count when arrangements exceed maxCount', () => {
    const state = createPathInitialState()
    const cards = allDeckCards(state)
    const deck = { cards }
    const metrics = computeMesaMetrics(pathTopology(), deck, { maxSolutionCount: 2 })

    expect(metrics.solutionCount).toBe(2)
    expect(metrics.solutionCountCapped).toBe(true)
  })

  it('includes topology metrics for generated mesas', () => {
    const topology = ringTopology()
    const deck = generateDeck(topology, { seed: 5 })
    const metrics = computeMesaMetrics(topology, deck)

    expect(metrics.bottleneckCount).toBe(0)
    expect(metrics.avgSeatDegree).toBe(2)
    expect(metrics.solutionCount).toBeGreaterThanOrEqual(1)
  })
})
