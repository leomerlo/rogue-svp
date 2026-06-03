import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App, { AppContent } from './App'
import { RunContext } from './context/RunContext'
import { createRunState } from '@/game/createRunState'
import { runReducer } from '@/game/runReducer'

describe('App', () => {
  afterEach(() => cleanup())

  it('renders GameView with board and hand on mesa 0', () => {
    render(<App />)

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('hand')).toBeInTheDocument()
  })

  it('does not show a status overlay while playing', () => {
    render(<App />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('AppContent', () => {
  afterEach(() => cleanup())

  it('shows run complete screen when run is won', () => {
    let wonState = createRunState('test')
    for (let i = 0; i < 4; i++) {
      wonState = runReducer(wonState, { type: 'advanceLevel', mesaScore: 100 })
    }

    render(
      <RunContext.Provider value={{ runState: wonState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('run-complete')).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('shows game over screen when run is lost', () => {
    const lostState = runReducer(createRunState('test'), { type: 'endRunLoss' })

    render(
      <RunContext.Provider value={{ runState: lostState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('game-over')).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('renders GameView when run is playing', () => {
    const playingState = createRunState('test')

    render(
      <RunContext.Provider value={{ runState: playingState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.queryByTestId('run-complete')).not.toBeInTheDocument()
    expect(screen.queryByTestId('game-over')).not.toBeInTheDocument()
  })
})
