import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import type { Card, GameState, Move } from '@/game/types'

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
  makeCard('path-d4', 'wild', 'blue'),
  makeCard('path-d5', 'yellow', 'green'),
]

const M11_PATH_SOLUTION: Move[] = [
  { type: 'place', cardId: 'path-p0', row: 0, col: 0 },
  { type: 'place', cardId: 'path-p1', row: 0, col: 1 },
  { type: 'place', cardId: 'path-p2', row: 0, col: 2 },
  { type: 'place', cardId: 'path-p3', row: 0, col: 3 },
  { type: 'place', cardId: 'path-p4', row: 0, col: 4 },
  { type: 'place', cardId: 'path-p5', row: 0, col: 5 },
]

const M11_PATH_MIDGAME_PLACED_COUNT = 3
const M11_PATH_MIDGAME_ROWS = 2
const M11_PATH_MIDGAME_BLOCKED_ROW = 1

const M11_PATH_REMAINING_SOLUTION: Move[] = M11_PATH_SOLUTION.slice(M11_PATH_MIDGAME_PLACED_COUNT)

const M11_PATH_LOSE_ROW_CARDS: Card[] = [
  ...PATH_SOLUTION_CARDS.slice(0, M11_PATH_MIDGAME_PLACED_COUNT),
  PATH_BUFFER_CARDS[0]!,
  PATH_BUFFER_CARDS[1]!,
  PATH_BUFFER_CARDS[2]!,
]

function createM11PathCells() {
  return Array.from({ length: PATH_ROWS * PATH_COLS }, (_, i) =>
    makeCell(Math.floor(i / PATH_COLS), i % PATH_COLS),
  )
}

function createM11PathBlockedRow() {
  return Array.from({ length: PATH_COLS }, (_, col) =>
    makeCell(M11_PATH_MIDGAME_BLOCKED_ROW, col, { state: 'blocked' }),
  )
}

function createM11PathInitialState(): GameState {
  const cells = createM11PathCells()
  const hand = PATH_SOLUTION_CARDS.slice(0, 3)
  const deck = [...PATH_SOLUTION_CARDS.slice(3), ...PATH_BUFFER_CARDS]

  return makeState(PATH_ROWS, PATH_COLS, cells, { hand, deck })
}

function createM11PathMidGameState(): GameState {
  const placedCards = PATH_SOLUTION_CARDS.slice(0, M11_PATH_MIDGAME_PLACED_COUNT)
  const playRow = createM11PathCells().map((cell, index) =>
    index < M11_PATH_MIDGAME_PLACED_COUNT
      ? { ...cell, cardId: placedCards[index]!.id }
      : cell,
  )
  const blockedRow = createM11PathBlockedRow()
  const hand = PATH_SOLUTION_CARDS.slice(
    M11_PATH_MIDGAME_PLACED_COUNT,
    M11_PATH_MIDGAME_PLACED_COUNT + 3,
  )
  const deck = [...PATH_BUFFER_CARDS]

  return makeState(M11_PATH_MIDGAME_ROWS, PATH_COLS, [...playRow, ...blockedRow], {
    hand,
    deck,
    placedCards: Object.fromEntries(placedCards.map(card => [card.id, card])),
  })
}

function createM11PathWinState(): GameState {
  const playRow = createM11PathCells().map((cell, index) => ({
    ...cell,
    cardId: PATH_SOLUTION_CARDS[index]!.id,
  }))
  const placedCards = Object.fromEntries(
    PATH_SOLUTION_CARDS.map(card => [card.id, card]),
  )

  return makeState(M11_PATH_MIDGAME_ROWS, PATH_COLS, [...playRow, ...createM11PathBlockedRow()], {
    hand: PATH_BUFFER_CARDS.slice(0, 2),
    deck: PATH_BUFFER_CARDS.slice(2),
    placedCards,
    status: 'won',
  })
}

function createM11PathLoseState(): GameState {
  const playRow = createM11PathCells().map((cell, index) => ({
    ...cell,
    cardId: M11_PATH_LOSE_ROW_CARDS[index]!.id,
  }))
  const placedCards = Object.fromEntries(
    M11_PATH_LOSE_ROW_CARDS.map(card => [card.id, card]),
  )

  return makeState(M11_PATH_MIDGAME_ROWS, PATH_COLS, [...playRow, ...createM11PathBlockedRow()], {
    hand: PATH_SOLUTION_CARDS.slice(M11_PATH_MIDGAME_PLACED_COUNT),
    deck: PATH_BUFFER_CARDS.slice(3),
    placedCards,
    status: 'lost',
  })
}

export {
  createM11PathInitialState,
  createM11PathLoseState,
  createM11PathMidGameState,
  createM11PathWinState,
  M11_PATH_LOSE_ROW_CARDS,
  M11_PATH_MIDGAME_PLACED_COUNT,
  M11_PATH_REMAINING_SOLUTION,
  M11_PATH_SOLUTION,
  PATH_BUFFER_CARDS,
  PATH_SOLUTION_CARDS,
}
