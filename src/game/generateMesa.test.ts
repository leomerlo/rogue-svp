import { describe, expect, it } from 'vitest'
import { findValidArrangement } from '@/game/arrangementSolver'
import { maxSolutionCountForBand, metricsInBand } from '@/game/difficultyBands'
import { generateMesa } from '@/game/generateMesa'
import { computeMesaMetrics } from '@/game/mesaMetrics'
import type { DifficultyTarget } from '@/game/types'

const LEVELS: DifficultyTarget[] = [1, 2, 3, 4, 5]

describe('generateMesa', () => {
  it('is deterministic for the same target and params', () => {
    const params = { seed: 42, attemptBudget: 40 }
    const a = generateMesa(3, params)
    const b = generateMesa(3, params)

    expect(a.topology).toEqual(b.topology)
    expect(a.deck.cards).toEqual(b.deck.cards)
  })

  it('returns solvable mesas for every difficulty level', () => {
    for (const level of LEVELS) {
      const { topology, deck } = generateMesa(level, { seed: level * 100 })
      const arrangement = findValidArrangement(topology, deck.cards)
      expect(arrangement).not.toBeNull()
    }
  })

  it('falls back without throwing when attempt budget is tiny', () => {
    expect(() =>
      generateMesa(5, { seed: 99, attemptBudget: 1 }),
    ).not.toThrow()

    const { topology, deck } = generateMesa(5, { seed: 99, attemptBudget: 1 })
    expect(findValidArrangement(topology, deck.cards)).not.toBeNull()
  })

  it('lands in band for at least 70% of runs per level', () => {
    for (const level of LEVELS) {
      let hits = 0
      const runs = 100

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

      expect(hits / runs).toBeGreaterThanOrEqual(0.7)
    }
  }, 60_000)

  it('produces easier mesas at level 1 than level 5 on average', () => {
    function meanMetric(
      level: DifficultyTarget,
      runs: number,
      pick: (m: ReturnType<typeof computeMesaMetrics>) => number,
    ): number {
      let sum = 0
      for (let i = 0; i < runs; i++) {
        const { topology, deck } = generateMesa(level, {
          seed: level * 5000 + i,
          attemptBudget: 80,
        })
        sum += pick(
          computeMesaMetrics(topology, deck, {
            maxSolutionCount: maxSolutionCountForBand(level),
          }),
        )
      }
      return sum / runs
    }

    const easyWild = meanMetric(1, 50, (m) => m.wildRatio)
    const hardWild = meanMetric(5, 50, (m) => m.wildRatio)
    const easyBottlenecks = meanMetric(1, 50, (m) => m.bottleneckCount)
    const hardBottlenecks = meanMetric(5, 50, (m) => m.bottleneckCount)

    expect(easyWild).toBeGreaterThan(hardWild)
    expect(hardBottlenecks).toBeGreaterThan(easyBottlenecks)
  }, 30_000)
})
