import { describe, expect, it } from 'vitest'
import { createRunState } from '@/game/createRunState'
import { runReducer } from '@/game/runReducer'

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
    expect(state.partyAssignments[0]).toMatchObject({ partyTypeId: expect.any(String), characterName: expect.any(String) })
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
    expect(state.status).toBe('splash')
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
