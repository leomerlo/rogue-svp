import type { Card, Color, Cell, GameState, Side } from './types';

/**
 * Returns the cell at the given row and column.
 * @param state - The game state.
 * @param row - The row of the cell to get.
 * @param col - The column of the cell to get.
 * @returns The cell at the given row and column.
 */
function getCell(state: GameState, row: number, col: number): Cell {
  return state.cells.find(cell => cell.row === row && cell.col === col)!;
}

/**
 * Returns the card with the given id.
 * @param state - The game state.
 * @param id - The id of the card to get.
 * @returns The card with the given id.
 */
function getCard(state: GameState, id: string): Card | null {
  return state.placedCards[id]
    ?? state.hand.find(c => c.id === id)
    ?? state.deck.find(c => c.id === id)
    ?? null;
}

/**
 * Returns the neighbors of a cell.
 * @param cell - The cell to get the neighbors of.
 * @returns The neighbors of the cell.
 */
function neighborsOf(cell: Cell, state: GameState): Cell[] {
  const deltas = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ]

  function inBounds(row: number, col: number): boolean {
    return row >= 0 && row < state.rows && col >= 0 && col < state.cols;
  }

  return deltas
    .map(({ dr, dc }) => ({ row: cell.row + dr, col: cell.col + dc }))
    .filter(({ row, col }) => inBounds(row, col))
    .map(({ row, col }) => getCell(state, row, col))
    .filter((neighbor) => neighbor.state === 'free')
}

/**
 * Returns the color of the edge of a card on a given side.
 * @param card - The card to get the edge color of.
 * @param side - The side of the card to get the edge color of.
 * @returns The color of the edge of the card on the given side.
 */
function edgeColor(card: Card, side: Side): Color {
  switch (side) {
    case 'top':
      return card.colorA;
    case 'bottom':
      return card.colorB;
    case 'left':
      return card.colorA;
    case 'right':
      return card.colorB;
  }
}

/**
 * Returns the sides that are touching between two cells.
 * @param cell - The cell to get the touching sides of.
 * @param neighbor - The neighbor cell to get the touching sides of.
 * @returns The sides that are touching between the two cells.
 */
function touchingSides(cell: Cell, neighbor: Cell): { mySide: Side; theirSide: Side } {
  const dr = neighbor.row - cell.row
  const dc = neighbor.col - cell.col
  if (dr === -1) return { mySide: 'top',    theirSide: 'bottom' }
  if (dr ===  1) return { mySide: 'bottom', theirSide: 'top'    }
  if (dc === -1) return { mySide: 'left',   theirSide: 'right'  }
  if (dc ===  1) return { mySide: 'right',  theirSide: 'left'   }
  throw new Error('not adjacent')
}

/**
 * Returns true if the edges of the two cards match.
 * @param a - The first card to compare.
 * @param aSide - The side of the first card to compare.
 * @param b - The second card to compare.
 * @param bSide - The side of the second card to compare.
 * @returns True if the edges of the two cards match.
 */
function edgesMatch(a: Card, aSide: Side, b: Card, bSide: Side): boolean {
  return edgeColor(a, aSide) === edgeColor(b, bSide)
}

/**
 * Returns true if the cell is happy.
 * @param cell - The cell to check if it is happy.
 * @param state - The game state.
 * @returns True if the cell is happy.
 */
function isHappy(cell: Cell, state: GameState): boolean {
  if (cell.cardId === null) return false;
  const myCard = getCard(state, cell.cardId!);
  if (myCard === null) return false;
  
  const neighbors = neighborsOf(cell, state).filter(n => n.cardId !== null);
  
  return neighbors.every(neighbor => {
    const neighborCard = getCard(state, neighbor.cardId!)
    if (neighborCard === null) return false  // not true — missing card is a failure
    const { mySide, theirSide } = touchingSides(cell, neighbor)
    return edgesMatch(myCard, mySide, neighborCard, theirSide)
  })
}

function isSolved(state: GameState): boolean {
  return state.cells
    .filter(cell => cell.state === 'free')
    .every(cell => cell.cardId !== null && isHappy(cell, state));
}

export {
  isHappy,
  neighborsOf,
  edgeColor,
  getCard,
  touchingSides,
  edgesMatch,
  isSolved
}