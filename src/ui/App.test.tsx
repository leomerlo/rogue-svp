import { describe, expect, it, afterEach, beforeEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createM11PathMidGameState } from '@/test/utils/createInitialState'
import { useGameStore } from '@/store/gameStore'
import App from './App'

describe('App', () => {
  afterEach(() => cleanup())

  beforeEach(() => {
    useGameStore.setState({ gameState: createM11PathMidGameState() })
  })

  it('renders the mid-game GameView from the store', () => {
    render(<App />)

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board').children).toHaveLength(12)
    expect(screen.getByTestId('hand').children).toHaveLength(3)
  })
})
