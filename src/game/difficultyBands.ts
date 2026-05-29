import type { DifficultyTarget, MesaMetrics } from '@/game/types'

type MetricRange = { min: number; max: number }

type DifficultyBand = {
  solutionCount: MetricRange
  wildRatio: MetricRange
  bottleneckCount: MetricRange
  avgSeatDegree: MetricRange
}

const DIFFICULTY_BANDS: Record<DifficultyTarget, DifficultyBand> = {
  1: {
    solutionCount: { min: 20, max: Infinity },
    wildRatio: { min: 0.055, max: Infinity },
    bottleneckCount: { min: 0, max: 1 },
    avgSeatDegree: { min: 2.4, max: Infinity },
  },
  2: {
    solutionCount: { min: 8, max: Infinity },
    wildRatio: { min: 0.04, max: Infinity },
    bottleneckCount: { min: 0, max: 2 },
    avgSeatDegree: { min: 2.2, max: Infinity },
  },
  3: {
    solutionCount: { min: 3, max: 15 },
    wildRatio: { min: 0, max: 0.07 },
    bottleneckCount: { min: 1, max: 3 },
    avgSeatDegree: { min: 2.0, max: 2.5 },
  },
  4: {
    solutionCount: { min: 2, max: 6 },
    wildRatio: { min: 0, max: 0.05 },
    bottleneckCount: { min: 2, max: 4 },
    avgSeatDegree: { min: 1.8, max: 2.3 },
  },
  5: {
    solutionCount: { min: 1, max: 2 },
    wildRatio: { min: 0, max: 0.035 },
    bottleneckCount: { min: 3, max: Infinity },
    avgSeatDegree: { min: 0, max: 2.1 },
  },
}

function inRange(value: number, range: MetricRange): boolean {
  return value >= range.min && value <= range.max
}

function solutionCountInBand(metrics: MesaMetrics, range: MetricRange): boolean {
  if (metrics.solutionCountCapped) {
    return Number.isFinite(range.max) ? false : metrics.solutionCount >= range.min
  }
  return inRange(metrics.solutionCount, range)
}

function metricsInBand(metrics: MesaMetrics, target: DifficultyTarget): boolean {
  const band = DIFFICULTY_BANDS[target]
  return (
    solutionCountInBand(metrics, band.solutionCount) &&
    inRange(metrics.wildRatio, band.wildRatio) &&
    inRange(metrics.bottleneckCount, band.bottleneckCount) &&
    inRange(metrics.avgSeatDegree, band.avgSeatDegree)
  )
}

function clampToRange(value: number, range: MetricRange): number {
  if (value < range.min) return range.min - value
  if (value > range.max) return value - range.max
  return 0
}

function midpoint(range: MetricRange): number {
  if (!Number.isFinite(range.max)) return range.min
  return (range.min + range.max) / 2
}

function distanceToBand(metrics: MesaMetrics, target: DifficultyTarget): number {
  const band = DIFFICULTY_BANDS[target]
  const solutionValue =
    metrics.solutionCountCapped && !Number.isFinite(band.solutionCount.max)
      ? band.solutionCount.min
      : metrics.solutionCountCapped && Number.isFinite(band.solutionCount.max)
        ? band.solutionCount.max + 1
        : metrics.solutionCount

  return (
    clampToRange(solutionValue, band.solutionCount) +
    Math.abs(metrics.wildRatio - midpoint(band.wildRatio)) +
    clampToRange(metrics.bottleneckCount, band.bottleneckCount) +
    clampToRange(metrics.avgSeatDegree, band.avgSeatDegree)
  )
}

function wildCountForTarget(target: DifficultyTarget): number {
  if (target <= 2) return 2
  if (target === 3) return 1
  return 0
}

function maxSolutionCountForBand(target: DifficultyTarget): number {
  const max = DIFFICULTY_BANDS[target].solutionCount.max
  return Number.isFinite(max) ? max + 1 : 100
}

export {
  DIFFICULTY_BANDS,
  distanceToBand,
  maxSolutionCountForBand,
  metricsInBand,
  wildCountForTarget,
}
