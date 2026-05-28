import { describe, expect, it } from 'vitest'
import { isSolved } from '@/game/helpers'
import { applyMove } from '@/game/movement'
import {
  createPathInitialState,
  PATH_SOLUTION,
} from './pathLevel'

describe('createPathInitialState', () => {
  it('builds a 1×6 path with a 12-card deck and 3-card hand', () => {
    const state = createPathInitialState()

    expect(state.rows).toBe(1)
    expect(state.cols).toBe(6)
    expect(state.cells).toHaveLength(6)
    expect(state.cells.every(cell => cell.state === 'free' && cell.cardId === null)).toBe(true)
    expect(state.hand).toHaveLength(3)
    expect(state.deck).toHaveLength(9)
    expect(state.hand.length + state.deck.length).toBe(12)
    expect(state.redealsLeft).toBe(4)
    expect(state.status).toBe('playing')
  })

  it('reaches a won state by applying the known solution sequence', () => {
    let state = createPathInitialState()

    for (const move of PATH_SOLUTION) {
      state = applyMove(state, move)
    }

    expect(state.status).toBe('won')
    expect(isSolved(state)).toBe(true)
    expect(state.cells.map(cell => cell.cardId)).toEqual([
      'path-p0',
      'path-p1',
      'path-p2',
      'path-p3',
      'path-p4',
      'path-p5',
    ])
  })
})
