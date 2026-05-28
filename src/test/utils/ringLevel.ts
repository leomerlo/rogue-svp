import { makeCard, makeCell, makeState } from "@/test/utils/factories"
import type { Card, GameState, Place } from "@/game/types"

const ROWS = 3
const COLS = 3
const BLOCKED: ReadonlyArray<{ row: number; col: number }> = [
  { row: 1, col: 1 },
]

const SOLUTION_CARDS: Card[] = [
  makeCard('ring-p0', 'yellow', 'red'),
  makeCard('ring-p1', 'red', 'blue'),
  makeCard('ring-p2', 'blue', 'green'),
  makeCard('ring-p3', 'green', 'green'),
  makeCard('ring-p4', 'green', 'blue'),
  makeCard('ring-p5', 'red', 'green'),
  makeCard('ring-p6', 'blue', 'red'),
  makeCard('ring-p7', 'red', 'blue'),
]

const BUFFER_CARDS: Card[] = [
  makeCard('ring-d0', 'yellow', 'red'),
  makeCard('ring-d1', 'red', 'blue'),
  makeCard('ring-d2', 'blue', 'green'),
  makeCard('ring-d3', 'green', 'green'),
  makeCard('ring-d4', 'green', 'blue'),
  makeCard('ring-d5', 'red', 'green'),
]

const SOLUTION: Place[] = [
  { cardId: 'ring-p0', row: 0, col: 0 },
  { cardId: 'ring-p1', row: 0, col: 1 },
  { cardId: 'ring-p2', row: 0, col: 2 },
  { cardId: 'ring-p3', row: 1, col: 2 },
  { cardId: 'ring-p4', row: 2, col: 2 },
  { cardId: 'ring-p5', row: 2, col: 1 },
  { cardId: 'ring-p6', row: 2, col: 0 },
  { cardId: 'ring-p7', row: 1, col: 0 },
]

function createRingCells() {
  return Array.from({ length: ROWS * COLS }, (_, i) => {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const isBlocked = (row: number, col: number) =>
      BLOCKED.some((b) => b.row === row && b.col === col)
    return makeCell(row, col, isBlocked(row, col) ? { state: 'blocked' } : {})
  })
}

function createRingInitialState(): GameState {
  const cells = createRingCells()
  const hand = SOLUTION_CARDS.slice(0, 3)
  const deck = [...SOLUTION_CARDS.slice(3), ...BUFFER_CARDS]
  return makeState(ROWS, COLS, cells, { hand, deck })
}

export {
  createRingInitialState,
  SOLUTION as RING_SOLUTION,
  SOLUTION_CARDS as RING_SOLUTION_CARDS,
  BUFFER_CARDS as RING_BUFFER_CARDS,
}