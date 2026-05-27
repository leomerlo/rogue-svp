import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import {
  createM11PathInitialState,
  createM11PathMidGameState,
} from '@/test/utils/createInitialState'
import { useGameStore } from '@/store/gameStore'
import GameView from './index'

describe('GameView', () => {
  afterEach(() => cleanup())

  beforeEach(() => {
    useGameStore.setState({ gameState: createM11PathInitialState() })
  })

  it('composes Board and Hand', () => {
    render(<GameView />)

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('hand')).toBeInTheDocument()
  })

  it('reflects the store game state across board and hand', () => {
    useGameStore.setState({ gameState: createM11PathMidGameState() })
    render(<GameView />)

    expect(screen.getByTestId('board').children).toHaveLength(12)
    expect(within(screen.getByTestId('board')).getAllByTestId('card')).toHaveLength(3)
    expect(within(screen.getByTestId('hand')).getAllByTestId('card')).toHaveLength(3)
  })
})
