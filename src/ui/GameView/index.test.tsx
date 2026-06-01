import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { gameReducer } from '@/game/gameReducer'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { findValidArrangement } from '@/game/arrangementSolver'
import { seatKey } from '@/game/solutionAssignment'
import {
  createPathInitialState,
  PATH_SOLUTION,
} from '@/test/utils/pathLevel'
import { makeState } from '@/test/utils/factories'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import GameView from './index'

describe('GameView', () => {
  afterEach(() => cleanup())

  it('composes Board and Hand', () => {
    renderWithGameState(<GameView />, createPathInitialState())

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('hand')).toBeInTheDocument()
  })

  it('reflects the game state across board and hand', () => {
    const state = gameReducer(createPathInitialState(), {
      type: 'placeCard',
      move: PATH_SOLUTION[0]!,
    })

    renderWithGameState(<GameView />, state)

    expect(screen.getByTestId('board').children).toHaveLength(6)
    expect(within(screen.getByTestId('board')).getAllByTestId('card')).toHaveLength(1)
    expect(within(screen.getByTestId('hand')).getAllByTestId('card')).toHaveLength(3)
  })

  it('shows the win overlay when status is won', () => {
    let state = createPathInitialState()
    for (const move of PATH_SOLUTION) {
      state = gameReducer(state, { type: 'placeCard', move })
    }

    renderWithGameState(<GameView />, state)

    expect(screen.getByRole('status')).toHaveTextContent('You won!')
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })

  it('advances to the next authored topology from the win overlay', async () => {
    const user = userEvent.setup()
    let state = createGeneratedGameState(0, { seed: 7 })
    const allCards = [...state.hand, ...state.deck]
    const topology = {
      rows: state.rows,
      cols: state.cols,
      cells: state.cells.map(({ row, col, state: cellState }) => ({
        row,
        col,
        state: cellState,
      })),
    }
    const fixedBySeat = new Map(
      state.cells
        .filter((c) => c.state === 'pinned')
        .map((c) => [seatKey(c.row, c.col), state.placedCards[c.cardId!]!] as const),
    )
    const arrangement = findValidArrangement(topology, allCards, fixedBySeat)
    expect(arrangement).not.toBeNull()

    const cardsById = new Map(allCards.map((c) => [c.id, c]))
    const placedCards = { ...state.placedCards }
    const cells = state.cells.map((cell) => {
      if (cell.state === 'blocked' || cell.state === 'pinned') return { ...cell }
      const cardId = arrangement!.get(seatKey(cell.row, cell.col))!
      const card = cardsById.get(cardId)!
      placedCards[cardId] = card
      return { ...cell, cardId }
    })

    state = makeState(state.rows, state.cols, cells, {
      placedCards,
      hand: [],
      deck: [],
      topologyIndex: 0,
      status: 'won',
    })

    renderWithGameState(<GameView />, state)

    await user.click(screen.getByRole('button', { name: 'Next level' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByTestId('board').children).toHaveLength(18)
  })
})
