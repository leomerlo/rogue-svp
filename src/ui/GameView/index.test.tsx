import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
import {
  createM11PathInitialState,
  createM11PathMidGameState,
  createM11PathWinState,
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
    renderWithGameState(<GameView />, createM11PathMidGameState())

    expect(screen.getByTestId('board').children).toHaveLength(12)
    expect(within(screen.getByTestId('board')).getAllByTestId('card')).toHaveLength(3)
    expect(within(screen.getByTestId('hand')).getAllByTestId('card')).toHaveLength(3)
  })

  it('shows the win overlay when status is won', () => {
    renderWithGameState(<GameView />, createM11PathWinState())

    expect(screen.getByRole('status')).toHaveTextContent('You won!')
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })
})
