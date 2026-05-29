import { describe, expect, it } from 'vitest'
import { maxSolutionCountForBand, metricsInBand } from '@/game/difficultyBands'
import { generateMesa } from '@/game/generateMesa'
import { computeMesaMetrics } from '@/game/mesaMetrics'
import type { DifficultyTarget, MesaMetrics } from '@/game/types'

describe('metricsInBand', () => {
  it('accepts capped solution counts for easy bands only', () => {
    const easyCapped: MesaMetrics = {
      solutionCount: 100,
      solutionCountCapped: true,
      wildRatio: 0.06,
      bottleneckCount: 1,
      avgSeatDegree: 2.5,
    }
    expect(metricsInBand(easyCapped, 1)).toBe(true)

    const hardCapped: MesaMetrics = {
      ...easyCapped,
      wildRatio: 0,
      bottleneckCount: 3,
      avgSeatDegree: 1.7,
    }
    expect(metricsInBand(hardCapped, 5)).toBe(false)
  })
})

describe('generateMesa band hit rate sample', () => {
  it('hits band for each level in a small sample', () => {
    for (const level of [1, 2, 3, 4, 5] as DifficultyTarget[]) {
      let hits = 0
      const runs = 20
      for (let i = 0; i < runs; i++) {
        const { topology, deck } = generateMesa(level, {
          seed: level * 1000 + i,
          attemptBudget: 80,
        })
        const metrics = computeMesaMetrics(topology, deck, {
          maxSolutionCount: maxSolutionCountForBand(level),
        })
        if (metricsInBand(metrics, level)) hits++
      }
      expect(hits, `level ${level}`).toBeGreaterThanOrEqual(Math.ceil(runs * 0.7))
    }
  }, 120_000)
})
