import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
import { gameReducer } from '@/game/gameReducer'
import {
  createPathInitialState,
  PATH_SOLUTION,
} from '@/test/utils/pathLevel'
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
})
