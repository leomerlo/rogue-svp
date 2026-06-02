import { describe, expect, it } from 'vitest'
import { createRunState } from '@/game/createRunState'
import { runReducer } from '@/game/runReducer'

describe('createRunState', () => {
  it('returns a valid initial RunState', () => {
    expect(createRunState('run-seed')).toEqual({
      topologyIndex: 0,
      relicsActive: [],
      scoreTotal: 0,
      seed: 'run-seed',
      status: 'playing',
    })
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
    expect(state.status).toBe('playing')
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
