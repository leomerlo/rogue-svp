import { describe, expect, it } from 'vitest'
import { createRunState } from '@/game/createRunState'
import { runReducer, RUN_MESA_COUNT } from '@/game/runReducer'

describe('createRunState', () => {
  it('returns a valid initial RunState', () => {
    const state = createRunState('run-seed')
    expect(state.topologyIndex).toBe(0)
    expect(state.relicsActive).toEqual([])
    expect(state.scoreTotal).toBe(0)
    expect(state.seed).toBe('run-seed')
    expect(state.status).toBe('splash')
    expect(state.pendingMesaScore).toBe(0)
    expect(state.partyAssignments).toHaveLength(4)
    expect(state.partyAssignments[0]).toMatchObject({
      partyTypeId: expect.any(String),
      characterName: expect.any(String),
      familyName: expect.any(String),
      archetypeId: expect.any(String),
    })
  })

  it('partyAssignments are deterministic for the same seed', () => {
    const a = createRunState('same-seed')
    const b = createRunState('same-seed')
    expect(a.partyAssignments).toEqual(b.partyAssignments)
  })

  it('partyAssignments differ for different seeds', () => {
    const a = createRunState('seed-a')
    const b = createRunState('seed-b')
    expect(a.partyAssignments).not.toEqual(b.partyAssignments)
  })
})

describe('runReducer', () => {
  it('advanceLevel through 4 mesas sets status to won', () => {
    let state = createRunState('seed')

    for (let i = 0; i < 4; i++) {
      state = runReducer(state, { type: 'advanceLevel', mesaScore: 100 })
    }

    expect(state.topologyIndex).toBe(4)
    expect(state.status).toBe('won')
  })

  it('endRunLoss sets status to lost', () => {
    const state = createRunState('seed')

    const next = runReducer(state, { type: 'endRunLoss' })

    expect(next.status).toBe('lost')
    expect(next.topologyIndex).toBe(0)
  })

  it('applyRelic appends relic ids', () => {
    let state = createRunState('seed')

    state = runReducer(state, { type: 'applyRelic', relicId: 'extra_redeal' })
    state = runReducer(state, { type: 'applyRelic', relicId: 'peek_5' })

    expect(state.relicsActive).toEqual(['extra_redeal', 'peek_5'])
  })

  it('advanceLevel accumulates mesa scores', () => {
    let state = createRunState('seed')

    state = runReducer(state, { type: 'advanceLevel', mesaScore: 10 })
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 25 })

    expect(state.scoreTotal).toBe(35)
    expect(state.topologyIndex).toBe(2)
    // topology 2 triggers the encounter node, not a splash
    expect(state.status).toBe('encounter')
  })

  it('startReward sets status to reward and stores pendingMesaScore', () => {
    const state = createRunState('seed')

    const next = runReducer(state, { type: 'startReward', mesaScore: 75 })

    expect(next.status).toBe('reward')
    expect(next.pendingMesaScore).toBe(75)
    expect(next.topologyIndex).toBe(0)
  })

  it('advanceLevel from reward clears pendingMesaScore and shows splash for next mesa', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'startReward', mesaScore: 50 })

    const next = runReducer(state, { type: 'advanceLevel', mesaScore: 50 })

    expect(next.status).toBe('splash')
    expect(next.pendingMesaScore).toBe(0)
    expect(next.topologyIndex).toBe(1)
    expect(next.scoreTotal).toBe(50)
  })

  it('startMesa transitions from splash to playing', () => {
    const state = createRunState('seed')
    expect(state.status).toBe('splash')

    const next = runReducer(state, { type: 'startMesa' })

    expect(next.status).toBe('playing')
    expect(next.topologyIndex).toBe(0)
  })

  it('newRun resets to a fresh RunState with the given seed', () => {
    let state = createRunState('old-seed')
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 50 })
    state = runReducer(state, { type: 'applyRelic', relicId: 'score_streak' })
    state = runReducer(state, { type: 'endRunLoss' })

    const next = runReducer(state, { type: 'newRun', seed: 'new-seed' })

    expect(next).toEqual(createRunState('new-seed'))
  })
})

describe('encounter transitions', () => {
  it('advanceLevel to topology 2 sets status to encounter', () => {
    let state = createRunState('seed')
    // advance through mesa 0 → topology 1
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 10 })
    expect(state.topologyIndex).toBe(1)
    expect(state.status).toBe('splash')

    // advance through mesa 1 → topology 2: should trigger encounter
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 10 })
    expect(state.topologyIndex).toBe(2)
    expect(state.status).toBe('encounter')
  })

  it('advanceLevel to topology 1 does NOT trigger encounter', () => {
    const state = createRunState('seed')
    const next = runReducer(state, { type: 'advanceLevel', mesaScore: 10 })
    expect(next.status).toBe('splash')
  })

  it('resolveEncounter transitions status to splash', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    expect(state.status).toBe('encounter')

    const next = runReducer(state, { type: 'resolveEncounter', slotIndex: 0, tag: 'married', rumores: 8 })
    expect(next.status).toBe('splash')
    expect(next.topologyIndex).toBe(2)
  })

  it('resolveEncounter applies tag to the specified slot', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })

    const next = runReducer(state, { type: 'resolveEncounter', slotIndex: 1, tag: 'bereaved', rumores: 5 })
    expect(next.narrativeState.roster[1]!.tags).toContain('bereaved')
    expect(next.narrativeState.roster[0]!.tags).toEqual([])
  })

  it('resolveEncounter awards the correct rumores amount', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })

    const next = runReducer(state, { type: 'resolveEncounter', slotIndex: 0, tag: 'newborn', rumores: 12 })
    expect(next.rumores).toBe(12)
  })

  it('applyRumores accumulates on top of existing rumores', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'applyRumores', amount: 5 })
    state = runReducer(state, { type: 'applyRumores', amount: 7 })
    expect(state.rumores).toBe(12)
  })

  it('newRun resets rumores to 0', () => {
    let state = createRunState('seed')
    state = runReducer(state, { type: 'applyRumores', amount: 20 })
    const next = runReducer(state, { type: 'newRun', seed: 'fresh' })
    expect(next.rumores).toBe(0)
  })

  it('after resolveEncounter the run continues through remaining mesas to won', () => {
    let state = createRunState('seed')
    // mesas 0 and 1
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    expect(state.status).toBe('encounter')

    // resolve encounter → splash → mesa 2
    state = runReducer(state, { type: 'resolveEncounter', slotIndex: 0, tag: 'married', rumores: 5 })
    expect(state.status).toBe('splash')

    state = runReducer(state, { type: 'startMesa' })
    expect(state.status).toBe('playing')

    // advance mesa 2 → splash, mesa 3 → won
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    expect(state.status).toBe('splash')
    state = runReducer(state, { type: 'advanceLevel', mesaScore: 0 })
    expect(state.status).toBe('won')
    expect(state.topologyIndex).toBe(RUN_MESA_COUNT)
  })
})
