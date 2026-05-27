import { getCellIndex, isSolved, isTableFull } from './helpers';
import type { GameState, Move } from './types';

function drawCards(state: GameState): GameState {
  const hand = [...state.hand];
  const deck = [...state.deck];

  while (hand.length < 3 && deck.length > 0) {
    hand.push(deck.shift()!);
  }

  return { ...state, hand, deck };
}

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

  const card = state.hand.find(c => c.id === move.cardId) ?? null;
  if (card === null) {
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

  if (isSolved(nextState)) {
    return { ...nextState, status: 'won' };
  }

  if (isTableFull(nextState)) {
    return { ...nextState, status: 'lost' };
  }

  return drawCards(nextState);
}

export {
  applyMove
}
