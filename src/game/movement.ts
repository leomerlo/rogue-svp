import { getCard, isSolved } from './helpers';
import type { GameState, Move } from './types';

/**
 * Returns true if the table is full.
 * @param state - The game state.
 * @returns True if the table is full.
 */
function isTableFull(state: GameState): boolean {
  return state.cells
    .filter(cell => cell.state === 'free')
    .every(cell => cell.cardId !== null);
}

function getCellIndex(state: GameState, row: number, col: number): number {
  return state.cells.findIndex(cell => cell.row === row && cell.col === col);
}

/**
 * Draws cards from the top of the deck until the hand has 3 cards.
 * @param state - The game state.
 * @returns The new game state.
 */
function drawCards(state: GameState): GameState {
  const hand = [...state.hand];
  const deck = [...state.deck];

  while (hand.length < 3 && deck.length > 0) {
    hand.push(deck.shift()!);
  }

  return { ...state, hand, deck };
}

/**
 * Applies a move to the game state.
 * @param state - The game state.
 * @param move - The move to apply.
 * @returns The new game state.
 */
function applyMove(state: GameState, move: Move): GameState {
  if (move.row < 0 || move.col < 0 || move.row >= state.rows || move.col >= state.cols) {
    throw new Error('Invalid move');
  }

  const cellIndex = getCellIndex(state, move.row, move.col);
  if (cellIndex === -1) {
    throw new Error('Invalid move');
  }

  const targetCell = state.cells[cellIndex]!;

  if (move.type === 'place' && targetCell.cardId !== null) {
    throw new Error('Cell already occupied');
  }
  if (targetCell.state === 'blocked') {
    throw new Error('Cell is blocked');
  }
  if (targetCell.state !== 'free') {
    throw new Error('Invalid move');
  }

  const card = getCard(state, move.cardId);
  if (card === null || !state.hand.some(c => c.id === move.cardId)) {
    throw new Error('Card not found');
  }

  const cells = state.cells.map((cell, index) =>
    index === cellIndex ? { ...cell, cardId: move.cardId } : cell,
  );
  const hand = state.hand.filter(c => c.id !== move.cardId);
  const placedCards = { ...state.placedCards, [move.cardId]: card };

  const nextState: GameState = {
    ...state,
    cells,
    hand,
    placedCards,
  };

  if (isTableFull(nextState) && isSolved(nextState)) {
    return { ...nextState, status: 'won' };
  }
  if (isTableFull(nextState) && !isSolved(nextState)) {
    return { ...nextState, status: 'lost' };
  }

  return drawCards(nextState);
}

export {
  applyMove
}