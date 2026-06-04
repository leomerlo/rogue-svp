import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('dispatches newRun when Play Again is clicked on game over screen', async () => {
    const runDispatch = vi.fn()
    const lostState = runReducer(createRunState('test'), { type: 'endRunLoss' })

    render(
      <RunContext.Provider value={{ runState: lostState, runDispatch }}>
        <AppContent />
      </RunContext.Provider>
    )

    await userEvent.click(screen.getByRole('button', { name: /play again/i }))

    expect(runDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'newRun' })
    )
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

  it('shows reward screen with 3 relic options when run status is reward', () => {
    const rewardState = runReducer(createRunState('test'), { type: 'startReward', mesaScore: 50 })

    render(
      <RunContext.Provider value={{ runState: rewardState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('reward-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
    const options = screen.getAllByTestId(/^relic-option-/)
    expect(options).toHaveLength(3)
  })

  it('excludes already-active relics from reward options', () => {
    let state = createRunState('test')
    state = runReducer(state, { type: 'applyRelic', relicId: 'extra_redeal' })
    state = runReducer(state, { type: 'applyRelic', relicId: 'peek_5' })
    state = runReducer(state, { type: 'applyRelic', relicId: 'score_streak' })
    state = runReducer(state, { type: 'applyRelic', relicId: 'wild_on_start' })
    state = runReducer(state, { type: 'applyRelic', relicId: 'wild_on_redeal' })
    state = runReducer(state, { type: 'startReward', mesaScore: 30 })

    render(
      <RunContext.Provider value={{ runState: state, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.queryByTestId('relic-option-extra_redeal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('relic-option-peek_5')).not.toBeInTheDocument()
    const options = screen.getAllByTestId(/^relic-option-/)
    expect(options).toHaveLength(3)
  })
})
