import { makeCard, makeCell, makeState } from './testUtils';
import type { Card, GameState, Move } from './types';

/** M1.1 path table: one row, six seats in a chain (cols 0–5). */
const PATH_ROWS = 1;
const PATH_COLS = 6;

/**
 * Solvable seating for the 1×6 path (left → right).
 * Adjacent cards share a matching edge: colorA (left) === neighbor's colorB (right).
 */
const PATH_SOLUTION_CARDS: Card[] = [
  makeCard('path-p0', 'red', 'green'),
  makeCard('path-p1', 'green', 'blue'),
  makeCard('path-p2', 'blue', 'yellow'),
  makeCard('path-p3', 'yellow', 'red'),
  makeCard('path-p4', 'red', 'green'),
  makeCard('path-p5', 'green', 'red'),
];

/** Six buffer cards (includes one wild); never required for the known solution. */
const PATH_BUFFER_CARDS: Card[] = [
  makeCard('path-d0', 'blue', 'red'),
  makeCard('path-d1', 'yellow', 'blue'),
  makeCard('path-d2', 'red', 'yellow'),
  makeCard('path-d3', 'green', 'yellow'),
  makeCard('path-d4', 'wild', 'blue'),
  makeCard('path-d5', 'yellow', 'green'),
];

/**
 * Known winning sequence: play solution cards left to right.
 * Initial hand is [p0, p1, p2]; each placement draws the next solution card from the deck.
 */
const M11_PATH_SOLUTION: Move[] = [
  { type: 'place', cardId: 'path-p0', row: 0, col: 0 },
  { type: 'place', cardId: 'path-p1', row: 0, col: 1 },
  { type: 'place', cardId: 'path-p2', row: 0, col: 2 },
  { type: 'place', cardId: 'path-p3', row: 0, col: 3 },
  { type: 'place', cardId: 'path-p4', row: 0, col: 4 },
  { type: 'place', cardId: 'path-p5', row: 0, col: 5 },
];

function createM11PathCells() {
  return Array.from({ length: PATH_COLS }, (_, col) => makeCell(0, col));
}

/**
 * Hand-crafted M1.1 initial state: 1×6 path topology and a 12-card solvable deck.
 * Hand holds the first three solution cards; the deck holds the rest plus buffer cards.
 */
function createM11PathInitialState(): GameState {
  const cells = createM11PathCells();
  const hand = PATH_SOLUTION_CARDS.slice(0, 3);
  const deck = [...PATH_SOLUTION_CARDS.slice(3), ...PATH_BUFFER_CARDS];

  return makeState(PATH_ROWS, PATH_COLS, cells, { hand, deck });
}

export {
  createM11PathInitialState,
  M11_PATH_SOLUTION,
  PATH_BUFFER_CARDS,
  PATH_SOLUTION_CARDS,
};
