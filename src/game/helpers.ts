import type { Card, Color, Cell, GameState, Side } from '@/game/types'

type CellLookup = {
  cellsByCoord: Map<string, Cell>
  indexByCoord: Map<string, number>
}

type CardZone = 'placed' | 'hand' | 'deck' | null

function cellKey(row: number, col: number): string {
  return `${row},${col}`
}

function buildCellLookup(state: GameState): CellLookup {
  const cellsByCoord = new Map<string, Cell>()
  const indexByCoord = new Map<string, number>()

  for (let i = 0; i < state.cells.length; i++) {
    const cell = state.cells[i]!
    const key = cellKey(cell.row, cell.col)
    cellsByCoord.set(key, cell)
    indexByCoord.set(key, i)
  }

  return { cellsByCoord, indexByCoord }
}

function getCellIndex(state: GameState, row: number, col: number): number {
  return state.cells.findIndex(cell => cell.row === row && cell.col === col)
}

function getCardCellIndex(state: GameState, cardId: string): number {
  return state.cells.findIndex(cell => cell.cardId === cardId)
}

function getCardZone(state: GameState, id: string): CardZone {
  if (state.placedCards[id] !== undefined) return 'placed'
  if (state.hand.some(card => card.id === id)) return 'hand'
  if (state.deck.some(card => card.id === id)) return 'deck'
  return null
}

function getCard(state: GameState, id: string): Card | null {
  const zone = getCardZone(state, id)
  if (zone === 'placed') return state.placedCards[id]!
  if (zone === 'hand') return state.hand.find(c => c.id === id) ?? null
  if (zone === 'deck') return state.deck.find(c => c.id === id) ?? null
  return null
}

function isCardInHand(state: GameState, id: string): boolean {
  return getCardZone(state, id) === 'hand'
}

function isCardInDeck(state: GameState, id: string): boolean {
  return getCardZone(state, id) === 'deck'
}

function isCardInPlacedCards(state: GameState, id: string): boolean {
  return getCardZone(state, id) === 'placed'
}

function neighborsOf(cell: Cell, state: GameState, lookup = buildCellLookup(state)): Cell[] {
  const neighbors: Cell[] = []
  const deltas = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ]

  for (const { dr, dc } of deltas) {
    const row = cell.row + dr
    const col = cell.col + dc
    if (row < 0 || row >= state.rows || col < 0 || col >= state.cols) continue

    const neighbor = lookup.cellsByCoord.get(cellKey(row, col))
    if (neighbor === undefined || neighbor.state === 'blocked') continue

    neighbors.push(neighbor)
  }

  return neighbors
}

function placedNeighborsOf(cell: Cell, state: GameState, lookup: CellLookup): Cell[] {
  return neighborsOf(cell, state, lookup).filter((neighbor) => neighbor.cardId !== null);
}

function edgeColor(card: Card, side: Side): Color {
  switch (side) {
    case 'top':
    case 'left':
      return card.colorA;
    case 'bottom':
    case 'right':
      return card.colorB;
  }
}

function touchingSides(cell: Cell, neighbor: Cell): { mySide: Side; theirSide: Side } {
  const dr = neighbor.row - cell.row
  const dc = neighbor.col - cell.col
  if (dr === -1) return { mySide: 'top',    theirSide: 'bottom' }
  if (dr ===  1) return { mySide: 'bottom', theirSide: 'top'    }
  if (dc === -1) return { mySide: 'left',   theirSide: 'right'  }
  if (dc ===  1) return { mySide: 'right',  theirSide: 'left'   }
  throw new Error('not adjacent')
}

function edgesMatch(a: Card, aSide: Side, b: Card, bSide: Side): boolean {
  return edgeColor(a, aSide) === edgeColor(b, bSide)
}

function isHappy(cell: Cell, state: GameState, lookup = buildCellLookup(state)): boolean {
  if (cell.cardId === null) return false
  const myCard = getCard(state, cell.cardId)
  if (myCard === null) return false

  const neighbors = neighborsOf(cell, state, lookup)

  return neighbors.every(neighbor => {
    const neighborCard = neighbor.cardId === null ? null : getCard(state, neighbor.cardId)
    if (neighborCard === null) return false
    const { mySide, theirSide } = touchingSides(cell, neighbor)
    return edgesMatch(myCard, mySide, neighborCard, theirSide)
  })
}

function isTableFull(state: GameState): boolean {
  return state.cells.every(cell => cell.state !== 'free' || cell.cardId !== null)
}

function isSolved(state: GameState): boolean {
  if (!isTableFull(state)) return false
  const lookup = buildCellLookup(state)
  return state.cells.every(cell => cell.state !== 'free' || isHappy(cell, state, lookup))
}

export {
  isHappy,
  placedNeighborsOf,
  buildCellLookup,
  neighborsOf,
  edgeColor,
  getCard,
  getCellIndex,
  getCardCellIndex,
  isTableFull,
  touchingSides,
  edgesMatch,
  isSolved,
  getCardZone,
  isCardInHand,
  isCardInDeck,
  isCardInPlacedCards,
}
