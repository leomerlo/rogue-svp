import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
import { gameReducer } from '@/game/gameReducer'
import {
  createM11PathInitialState,
  M11_PATH_SOLUTION,
} from '@/test/utils/createInitialState'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import GameView from './index'

describe('GameView', () => {
  afterEach(() => cleanup())

  it('composes Board and Hand', () => {
    renderWithGameState(<GameView />, createM11PathInitialState())

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('hand')).toBeInTheDocument()
  })

  it('reflects the game state across board and hand', () => {
    const state = gameReducer(createM11PathInitialState(), {
      type: 'placeCard',
      move: M11_PATH_SOLUTION[0]!,
    })

    renderWithGameState(<GameView />, state)

    expect(screen.getByTestId('board').children).toHaveLength(6)
    expect(within(screen.getByTestId('board')).getAllByTestId('card')).toHaveLength(1)
    expect(within(screen.getByTestId('hand')).getAllByTestId('card')).toHaveLength(3)
  })

  it('shows the win overlay when status is won', () => {
    let state = createM11PathInitialState()
    for (const move of M11_PATH_SOLUTION) {
      state = gameReducer(state, { type: 'placeCard', move })
    }

    renderWithGameState(<GameView />, state)

    expect(screen.getByRole('status')).toHaveTextContent('You won!')
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })
})
