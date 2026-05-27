import { describe, expect, it } from 'vitest'
import { isSolved } from '@/game/helpers'
import { applyMove } from '@/game/movement'
import {
  createM11PathInitialState,
  createM11PathLoseState,
  createM11PathMidGameState,
  createM11PathWinState,
  M11_PATH_REMAINING_SOLUTION,
  M11_PATH_SOLUTION,
  PATH_BUFFER_CARDS,
} from './createInitialState'

describe('createM11PathInitialState', () => {
  it('builds a 1×6 path with a 12-card deck and 3-card hand', () => {
    const state = createM11PathInitialState()

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
    let state = createM11PathInitialState()

    for (const move of M11_PATH_SOLUTION) {
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

describe('createM11PathMidGameState', () => {
  it('starts with three placed cards, blocked cells, and a refilled hand', () => {
    const state = createM11PathMidGameState()

    expect(state.rows).toBe(2)
    expect(state.cols).toBe(6)
    expect(state.cells).toHaveLength(12)
    expect(state.cells.slice(0, 6).map(cell => cell.cardId)).toEqual([
      'path-p0',
      'path-p1',
      'path-p2',
      null,
      null,
      null,
    ])
    expect(state.cells.slice(6).every(cell => cell.state === 'blocked')).toBe(true)
    expect(state.hand.map(card => card.id)).toEqual(['path-p3', 'path-p4', 'path-p5'])
    expect(state.deck).toHaveLength(PATH_BUFFER_CARDS.length)
    expect(Object.keys(state.placedCards)).toEqual(['path-p0', 'path-p1', 'path-p2'])
    expect(state.status).toBe('playing')
  })

  it('reaches a won state by applying the remaining solution sequence', () => {
    let state = createM11PathMidGameState()

    for (const move of M11_PATH_REMAINING_SOLUTION) {
      state = applyMove(state, move)
    }

    expect(state.status).toBe('won')
    expect(isSolved(state)).toBe(true)
  })
})

describe('createM11PathWinState', () => {
  it('matches the won state after completing the mid-game scenario', () => {
    let state = createM11PathMidGameState()

    for (const move of M11_PATH_REMAINING_SOLUTION) {
      state = applyMove(state, move)
    }

    expect(createM11PathWinState()).toEqual(state)
  })

  it('is a solved board with blocked cells and leftover buffer cards', () => {
    const state = createM11PathWinState()

    expect(state.status).toBe('won')
    expect(isSolved(state)).toBe(true)
    expect(state.cells.slice(0, 6).map(cell => cell.cardId)).toEqual([
      'path-p0',
      'path-p1',
      'path-p2',
      'path-p3',
      'path-p4',
      'path-p5',
    ])
    expect(state.cells.slice(6).every(cell => cell.state === 'blocked')).toBe(true)
    expect(state.hand.map(card => card.id)).toEqual(['path-d0', 'path-d1'])
    expect(state.deck.map(card => card.id)).toEqual(['path-d2', 'path-d3', 'path-d4', 'path-d5'])
    expect(Object.keys(state.placedCards)).toHaveLength(6)
  })
})

describe('createM11PathLoseState', () => {
  it('fills the play row with mismatched cards and keeps blocked cells', () => {
    const state = createM11PathLoseState()

    expect(state.status).toBe('lost')
    expect(isSolved(state)).toBe(false)
    expect(state.cells.slice(0, 6).map(cell => cell.cardId)).toEqual([
      'path-p0',
      'path-p1',
      'path-p2',
      'path-d0',
      'path-d1',
      'path-d2',
    ])
    expect(state.cells.slice(6).every(cell => cell.state === 'blocked')).toBe(true)
    expect(state.hand.map(card => card.id)).toEqual(['path-p3', 'path-p4', 'path-p5'])
    expect(state.deck.map(card => card.id)).toEqual(['path-d3', 'path-d4', 'path-d5'])
    expect(Object.keys(state.placedCards)).toHaveLength(6)
  })
})
