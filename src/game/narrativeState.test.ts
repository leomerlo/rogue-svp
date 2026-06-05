import { describe, expect, it } from 'vitest'
import { createRunState } from '@/game/createRunState'
import { runReducer } from '@/game/runReducer'

describe('NarrativeState — initial shape', () => {
  it('createRunState includes narrativeState with a 4-slot roster', () => {
    const state = createRunState('test-seed')
    expect(state.narrativeState.roster).toHaveLength(4)
  })

  it('each slot has a name, archetype, and empty tags array', () => {
    const state = createRunState('test-seed')
    for (const slot of state.narrativeState.roster) {
      expect(typeof slot.name).toBe('string')
      expect(slot.name.length).toBeGreaterThan(0)
      expect(typeof slot.archetype).toBe('string')
      expect(slot.archetype.length).toBeGreaterThan(0)
      expect(slot.tags).toEqual([])
    }
  })

  it('roster is deterministic for the same seed', () => {
    const a = createRunState('same-seed')
    const b = createRunState('same-seed')
    expect(a.narrativeState).toEqual(b.narrativeState)
  })

  it('roster differs for different seeds', () => {
    const a = createRunState('seed-alpha')
    const b = createRunState('seed-beta')
    expect(a.narrativeState).not.toEqual(b.narrativeState)
  })
})

describe('applyNarrativeTag', () => {
  it('appends a tag to the target slot', () => {
    const state = createRunState('seed')
    const next = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 0, tag: 'married' })
    expect(next.narrativeState.roster[0]!.tags).toEqual(['married'])
  })

  it('does not affect other slots', () => {
    const state = createRunState('seed')
    const next = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 1, tag: 'bereaved' })
    expect(next.narrativeState.roster[0]!.tags).toEqual([])
    expect(next.narrativeState.roster[2]!.tags).toEqual([])
    expect(next.narrativeState.roster[3]!.tags).toEqual([])
  })

  it('multiple tags accumulate on the same slot', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 2, tag: 'married' })
    state = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 2, tag: 'newborn' })
    expect(state.narrativeState.roster[2]!.tags).toEqual(['married', 'newborn'])
  })

  it('applying the same tag twice is a no-op after the first', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 0, tag: 'bereaved' })
    state = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 0, tag: 'bereaved' })
    expect(state.narrativeState.roster[0]!.tags).toEqual(['bereaved'])
  })

  it('out-of-bounds slotIndex is a no-op', () => {
    const state = createRunState('seed')
    const next = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 99, tag: 'married' })
    expect(next).toBe(state)
  })

  it('newRun resets narrativeState', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'applyNarrativeTag', slotIndex: 0, tag: 'married' })
    const next = runReducer(state, { type: 'newRun', seed: 'fresh-seed' })
    expect(next.narrativeState.roster[0]!.tags).toEqual([])
  })
})
