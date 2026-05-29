import { describe, expect, it } from 'vitest'
import { createCalibratedGeneratedGameState } from '@/game/createGameStateFromMesa'
import { generateMesa } from '@/game/generateMesa'

function cellLayout(state: ReturnType<typeof createCalibratedGeneratedGameState>) {
  return JSON.stringify(state.cells.map((c) => [c.row, c.col, c.state, c.cardId]))
}

describe('difficulty layout variety', () => {
  it('gen 3 and gen 4 produce different layouts with the same base seed', () => {
    const s3 = createCalibratedGeneratedGameState(3, { seed: 42, pinnedCount: 1 })
    const s4 = createCalibratedGeneratedGameState(4, { seed: 42, pinnedCount: 1 })

    expect(cellLayout(s3)).not.toEqual(cellLayout(s4))
  })

  it('all generated difficulties differ with the same base seed', () => {
    const layouts = new Map<number, string>()
    for (const level of [1, 2, 3, 4, 5] as const) {
      const state = createCalibratedGeneratedGameState(level, { seed: 42, pinnedCount: 1 })
      layouts.set(level, cellLayout(state))
    }

    const unique = new Set(layouts.values())
    expect(unique.size).toBe(5)
  })
})
