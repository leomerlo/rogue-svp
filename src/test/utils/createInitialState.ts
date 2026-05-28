import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import type { Card, GameState, Place } from '@/game/types'

const PATH_ROWS = 1
const PATH_COLS = 6

const PATH_SOLUTION_CARDS: Card[] = [
  makeCard('path-p0', 'red', 'green'),
  makeCard('path-p1', 'green', 'blue'),
  makeCard('path-p2', 'blue', 'yellow'),
  makeCard('path-p3', 'yellow', 'red'),
  makeCard('path-p4', 'red', 'green'),
  makeCard('path-p5', 'green', 'red'),
]

// never required for the known solution
const PATH_BUFFER_CARDS: Card[] = [
  makeCard('path-d0', 'blue', 'red'),
  makeCard('path-d1', 'yellow', 'blue'),
  makeCard('path-d2', 'red', 'yellow'),
  makeCard('path-d3', 'green', 'yellow'),
  makeCard('path-d4', 'blue', 'red'),
  makeCard('path-d5', 'yellow', 'green'),
]

const M11_PATH_SOLUTION: Place[] = [
  { cardId: 'path-p0', row: 0, col: 0 },
  { cardId: 'path-p1', row: 0, col: 1 },
  { cardId: 'path-p2', row: 0, col: 2 },
  { cardId: 'path-p3', row: 0, col: 3 },
  { cardId: 'path-p4', row: 0, col: 4 },
  { cardId: 'path-p5', row: 0, col: 5 },
]

function createM11PathCells() {
  return Array.from({ length: PATH_ROWS * PATH_COLS }, (_, i) =>
    makeCell(Math.floor(i / PATH_COLS), i % PATH_COLS),
  )
}

function createM11PathInitialState(): GameState {
  const cells = createM11PathCells()
  const hand = PATH_SOLUTION_CARDS.slice(0, 3)
  const deck = [...PATH_SOLUTION_CARDS.slice(3), ...PATH_BUFFER_CARDS]

  return makeState(PATH_ROWS, PATH_COLS, cells, { hand, deck })
}

export {
  createM11PathInitialState,
  M11_PATH_SOLUTION,
  PATH_BUFFER_CARDS,
  PATH_SOLUTION_CARDS,
}
