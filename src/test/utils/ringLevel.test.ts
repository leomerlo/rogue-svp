import { describe, expect, it } from 'vitest'
import { isSolved, neighborsOf } from '@/game/helpers'
import { applyMove } from '@/game/movement'
import {
  createRingInitialState,
  RING_SOLUTION,
} from './ringLevel'

describe('createRingInitialState', () => {
  it('builds a 3×3 ring with center blocked, 14-card deck, and 3-card hand', () => {
    const state = createRingInitialState()

    expect(state.rows).toBe(3)
    expect(state.cols).toBe(3)
    expect(state.cells).toHaveLength(9)
    expect(state.cells.filter((cell) => cell.state === 'blocked')).toEqual([
      expect.objectContaining({ row: 1, col: 1 }),
    ])
    expect(state.cells.filter((cell) => cell.state === 'free')).toHaveLength(8)
    expect(
      state.cells
        .filter((cell) => cell.state === 'free')
        .every((cell) => cell.cardId === null),
    ).toBe(true)
    expect(state.hand).toHaveLength(3)
    expect(state.deck).toHaveLength(11)
    expect(state.hand.length + state.deck.length).toBe(14)
    expect(state.redealsLeft).toBe(4)
    expect(state.status).toBe('playing')
  })

  it('gives perimeter seats two neighbors each, skipping the blocked center', () => {
    const state = createRingInitialState()
    const corner = state.cells.find((c) => c.row === 0 && c.col === 0)!
    const topEdge = state.cells.find((c) => c.row === 0 && c.col === 1)!
    const rightEdge = state.cells.find((c) => c.row === 1 && c.col === 2)!

    const neighborCoords = (cell: (typeof state.cells)[number]) =>
      neighborsOf(cell, state)
        .map((c) => [c.row, c.col] as const)
        .sort((a, b) => a[0] - b[0] || a[1] - b[1])

    expect(neighborCoords(corner)).toEqual([
      [0, 1],
      [1, 0],
    ])
    expect(neighborCoords(topEdge)).toEqual([
      [0, 0],
      [0, 2],
    ])
    expect(neighborCoords(rightEdge)).toEqual([
      [0, 2],
      [2, 2],
    ])
  })

  it('reaches a won state by applying the known solution sequence', () => {
    let state = createRingInitialState()

    for (const move of RING_SOLUTION) {
      state = applyMove(state, move)
    }

    expect(state.status).toBe('won')
    expect(isSolved(state)).toBe(true)
    expect(state.cells.map((cell) => cell.cardId)).toEqual([
      'ring-p0',
      'ring-p1',
      'ring-p2',
      'ring-p7',
      null,
      'ring-p3',
      'ring-p6',
      'ring-p5',
      'ring-p4',
    ])
  })
})
