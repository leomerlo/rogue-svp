import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import type { Card, GameState, Place } from '@/game/types'

const ROWS = 1
const COLS = 6

const SOLUTION_CARDS: Card[] = [
  makeCard('path-p0', 'red', 'green'),
  makeCard('path-p1', 'green', 'blue'),
  makeCard('path-p2', 'blue', 'yellow'),
  makeCard('path-p3', 'yellow', 'red'),
  makeCard('path-p4', 'red', 'green'),
  makeCard('path-p5', 'green', 'red'),
]

// never required for the known solution
const BUFFER_CARDS: Card[] = [
  makeCard('path-d0', 'blue', 'red'),
  makeCard('path-d1', 'yellow', 'blue'),
  makeCard('path-d2', 'red', 'yellow'),
  makeCard('path-d3', 'green', 'yellow'),
  makeCard('path-d4', 'blue', 'red'),
  makeCard('path-d5', 'yellow', 'green'),
]

const SOLUTION: Place[] = [
  { cardId: 'path-p0', row: 0, col: 0 },
  { cardId: 'path-p1', row: 0, col: 1 },
  { cardId: 'path-p2', row: 0, col: 2 },
  { cardId: 'path-p3', row: 0, col: 3 },
  { cardId: 'path-p4', row: 0, col: 4 },
  { cardId: 'path-p5', row: 0, col: 5 },
]

function createPathCells() {
  return Array.from({ length: ROWS * COLS }, (_, i) =>
    makeCell(Math.floor(i / COLS), i % COLS),
  )
}

function createPathInitialState(): GameState {
  const cells = createPathCells()
  const hand = SOLUTION_CARDS.slice(0, 3)
  const deck = [...SOLUTION_CARDS.slice(3), ...BUFFER_CARDS]

  return makeState(ROWS, COLS, cells, { hand, deck })
}

export {
  createPathInitialState,
  SOLUTION as PATH_SOLUTION,
  BUFFER_CARDS as PATH_BUFFER_CARDS,
  SOLUTION_CARDS as PATH_SOLUTION_CARDS,
}
