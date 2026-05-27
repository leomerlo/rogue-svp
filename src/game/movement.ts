import { getCard, getCellIndex, isSolved, isTableFull } from '@/game/helpers'
import type { GameState, Place, Swap } from '@/game/types'

function setCellCard(cells: GameState['cells'], indexToUpdate: number, cardId: string | null): GameState['cells'] {
  return cells.map((cell, index) => (
    index === indexToUpdate
      ? { ...cell, cardId }
      : cell
  ))
}

function swapCellCards(
  cells: GameState['cells'],
  indexA: number,
  cardIdA: string | null,
  indexB: number,
  cardIdB: string | null,
): GameState['cells'] {
  const next = [...cells]
  next[indexA] = { ...cells[indexA]!, cardId: cardIdA }
  next[indexB] = { ...cells[indexB]!, cardId: cardIdB }
  return next
}

function drawCards(state: GameState): GameState {
  const hand = [...state.hand]
  const deck = [...state.deck]

  while (hand.length < 3 && deck.length > 0) {
    hand.push(deck.shift()!)
  }

  return { ...state, hand, deck }
}

function shuffleDeck(state: GameState): GameState {
  return { ...state, deck: [...state.deck].sort(() => Math.random() - 0.5) }
}

function selectCard(state: GameState, cardId: string): GameState {
  if (getCard(state, cardId) === null) {
    throw new Error('Card not found')
  }
  return { ...state, selectedCardId: cardId }
}

function deselectCard(state: GameState): GameState {
  return { ...state, selectedCardId: null }
}

function applyMove(state: GameState, move: Place): GameState {
  if (move.row < 0 || move.col < 0 || move.row >= state.rows || move.col >= state.cols) {
    throw new Error('Invalid move')
  }

  const cellIndex = getCellIndex(state, move.row, move.col)
  if (cellIndex === -1) {
    throw new Error('Invalid move')
  }

  const targetCell = state.cells[cellIndex]!

  if (targetCell.state === 'blocked') {
    throw new Error('Cell is blocked')
  }

  if (targetCell.cardId !== null) {
    throw new Error('Cell already occupied')
  }

  const card = state.hand.find(c => c.id === move.cardId) ?? null
  if (card === null) {
    throw new Error('Card not found')
  }

  const cells = setCellCard(state.cells, cellIndex, move.cardId)
  const hand = state.hand.filter(c => c.id !== move.cardId)
  const placedCards = { ...state.placedCards, [move.cardId]: card }

  const nextState: GameState = {
    ...state,
    cells,
    hand,
    placedCards,
    selectedCardId: null,
  }

  if (isSolved(nextState)) {
    return { ...nextState, status: 'won' }
  }

  if (isTableFull(nextState)) {
    return { ...nextState, status: 'lost' }
  }

  return drawCards(nextState)
}

function swapCard(state: GameState, move: Swap): GameState {
  if (state.status !== 'playing') return state

  const cellFromIndex = getCellIndex(state, move.from.row, move.from.col)
  const cellToIndex = getCellIndex(state, move.to.row, move.to.col)

  if (cellFromIndex === -1 || cellToIndex === -1) {
    throw new Error('Invalid move')
  }

  const cellFrom = state.cells[cellFromIndex]!
  const cellTo = state.cells[cellToIndex]!

  if (cellFrom.state === 'blocked' || cellTo.state === 'blocked') {
    throw new Error('Cell is blocked')
  }

  const cardFrom = cellFrom.cardId
  const cardTo = cellTo.cardId

  if (cardFrom === null) {
    throw new Error('Source cell is empty')
  }
  
  const cells = swapCellCards(state.cells, cellFromIndex, cardTo, cellToIndex, cardFrom)

  return { ...state, cells, selectedCardId: null }
}

export {
  applyMove,
  deselectCard,
  selectCard,
  shuffleDeck,
  swapCard
}
