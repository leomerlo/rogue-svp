import { describe, expect, it } from 'vitest'
import { metricsInBand } from '@/game/difficultyBands'
import type { MesaMetrics } from '@/game/types'

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
