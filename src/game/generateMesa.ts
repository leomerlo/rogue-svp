import {
  distanceToBand,
  maxSolutionCountForBand,
  metricsInBand,
} from '@/game/difficultyBands'
import { AUTHORED_DECK } from '@/game/authoredDeck'
import { computeMesaMetrics } from '@/game/mesaMetrics'
import { generateTopology } from '@/game/topology'
import type { DifficultyTarget, GenerateMesaParams, TopologyDef } from '@/game/types'

const DEFAULT_ROWS = 4
const DEFAULT_COLS = 4
const DEFAULT_ATTEMPT_BUDGET = 80
const DEFAULT_SEED = 0
const DIFFICULTY_SEED_SALT = 100_000

type AttemptConfig = {
  targetFreeSeats: number
  wildCount: number
  bufferSize: number
}

const ATTEMPT_CONFIGS: Record<DifficultyTarget, AttemptConfig[]> = {
  1: [
    { targetFreeSeats: 12, wildCount: 2, bufferSize: 6 },
    { targetFreeSeats: 13, wildCount: 2, bufferSize: 6 },
    { targetFreeSeats: 11, wildCount: 2, bufferSize: 6 },
  ],
  2: [
    { targetFreeSeats: 11, wildCount: 2, bufferSize: 6 },
    { targetFreeSeats: 10, wildCount: 2, bufferSize: 5 },
    { targetFreeSeats: 12, wildCount: 1, bufferSize: 6 },
  ],
  3: [
    { targetFreeSeats: 9, wildCount: 0, bufferSize: 0 },
    { targetFreeSeats: 9, wildCount: 0, bufferSize: 1 },
    { targetFreeSeats: 8, wildCount: 0, bufferSize: 1 },
    { targetFreeSeats: 10, wildCount: 1, bufferSize: 8 },
    { targetFreeSeats: 9, wildCount: 1, bufferSize: 10 },
  ],
  4: [
    { targetFreeSeats: 8, wildCount: 0, bufferSize: 0 },
    { targetFreeSeats: 9, wildCount: 0, bufferSize: 0 },
    { targetFreeSeats: 8, wildCount: 0, bufferSize: 1 },
    { targetFreeSeats: 9, wildCount: 0, bufferSize: 1 },
  ],
  5: [
    { targetFreeSeats: 7, wildCount: 0, bufferSize: 0 },
    { targetFreeSeats: 6, wildCount: 0, bufferSize: 1 },
    { targetFreeSeats: 8, wildCount: 0, bufferSize: 0 },
    { targetFreeSeats: 7, wildCount: 0, bufferSize: 1 },
  ],
}

function resolveAttemptConfig(
  target: DifficultyTarget,
  attempt: number,
  params?: GenerateMesaParams,
): AttemptConfig {
  const preset = ATTEMPT_CONFIGS[target][attempt % ATTEMPT_CONFIGS[target].length]!
  return {
    targetFreeSeats: params?.targetFreeSeats ?? preset.targetFreeSeats,
    wildCount: params?.wildCount ?? preset.wildCount,
    bufferSize: params?.bufferSize ?? preset.bufferSize,
  }
}

/**
 * Generate a topology whose metrics fall within the difficulty band.
 *
 * Uses generate-and-test: each attempt builds a candidate topology, computes
 * metrics against the authored deck, and accepts on first match. When
 * `attemptBudget` is exhausted without a match, returns the candidate closest
 * to the band midpoint (fallback).
 */
type GeneratedMesa = {
  topology: TopologyDef
  deckSeed: number
}

function generateMesa(
  difficultyTarget: DifficultyTarget,
  params?: GenerateMesaParams,
): GeneratedMesa {
  const rows = params?.rows ?? DEFAULT_ROWS
  const cols = params?.cols ?? DEFAULT_COLS
  const attemptBudget = params?.attemptBudget ?? DEFAULT_ATTEMPT_BUDGET
  const baseSeed =
    (params?.seed ?? DEFAULT_SEED) + difficultyTarget * DIFFICULTY_SEED_SALT

  let best: GeneratedMesa | null = null
  let bestDistance = Infinity

  for (let attempt = 0; attempt < attemptBudget; attempt++) {
    const { targetFreeSeats, wildCount, bufferSize } = resolveAttemptConfig(
      difficultyTarget,
      attempt,
      params,
    )
    const topologySeed =
      baseSeed +
      attempt +
      targetFreeSeats * 1_000 +
      bufferSize * 10 +
      wildCount
    const deckSeed = topologySeed + 10_000

    const topology = generateTopology({
      rows,
      cols,
      targetFreeSeats,
      seed: topologySeed,
    })
    const metrics = computeMesaMetrics(topology, AUTHORED_DECK, {
      maxSolutionCount: maxSolutionCountForBand(difficultyTarget),
    })

    if (metricsInBand(metrics, difficultyTarget)) {
      return { topology, deckSeed }
    }

    const distance = distanceToBand(metrics, difficultyTarget)
    if (distance < bestDistance) {
      bestDistance = distance
      best = { topology, deckSeed }
    }
  }

  if (best === null) {
    const fallbackConfig = resolveAttemptConfig(difficultyTarget, 0, params)
    const topologySeed =
      baseSeed +
      fallbackConfig.targetFreeSeats * 1_000 +
      fallbackConfig.bufferSize * 10 +
      fallbackConfig.wildCount
    const deckSeed = topologySeed + 10_000
    const topology = generateTopology({
      rows,
      cols,
      targetFreeSeats: fallbackConfig.targetFreeSeats,
      seed: topologySeed,
    })
    return { topology, deckSeed }
  }

  return best
}

export { generateMesa, DEFAULT_ATTEMPT_BUDGET, type GeneratedMesa }
