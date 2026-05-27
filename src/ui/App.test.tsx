import { describe, expect, it, afterEach, beforeEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createM11PathMidGameState } from '@/test/utils/createInitialState'
import { useGameStore } from '@/store/gameStore'
import App from './App'

describe('App', () => {
  afterEach(() => cleanup())

  beforeEach(() => {
    useGameStore.setState({ gameState: createM11PathMidGameState() })
  })

  it('renders GameView with the scenario picker', () => {
    render(<App />)

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('scenario-picker')).toBeInTheDocument()
    expect(screen.getByTestId('board').children).toHaveLength(12)
  })

  it('shows the win overlay when the won scenario is selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('scenario-won'))

    expect(screen.getByRole('status')).toHaveTextContent('You won!')
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })
})
