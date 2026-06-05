import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App, { AppContent } from './App'
import { RunContext } from './context/RunContext'
import { createRunState } from '@/game/createRunState'
import { runReducer } from '@/game/runReducer'

describe('App', () => {
  afterEach(() => cleanup())

  it('shows splash screen on initial load', () => {
    render(<App />)

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('renders GameView with board and hand after dismissing splash', async () => {
    render(<App />)

    await userEvent.click(screen.getByTestId('splash-dismiss'))

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('hand')).toBeInTheDocument()
  })

  it('does not show a status overlay while playing', async () => {
    render(<App />)
    await userEvent.click(screen.getByTestId('splash-dismiss'))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('AppContent', () => {
  afterEach(() => cleanup())

  it('shows run end screen (won) when run is won', () => {
    let wonState = createRunState('test')
    for (let i = 0; i < 4; i++) {
      wonState = runReducer(wonState, { type: 'advanceLevel', mesaScore: 100 })
    }

    render(
      <RunContext.Provider value={{ runState: wonState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('run-end-screen')).toBeInTheDocument()
    expect(screen.getByText('¡Fiesta completada!')).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('shows run end screen (lost) when run is lost', () => {
    const lostState = runReducer(createRunState('test'), { type: 'endRunLoss' })

    render(
      <RunContext.Provider value={{ runState: lostState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('run-end-screen')).toBeInTheDocument()
    expect(screen.getByText('La fiesta terminó antes de tiempo.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nueva run/i })).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('dispatches newRun when Nueva Run is clicked on game over screen', async () => {
    const runDispatch = vi.fn()
    const lostState = runReducer(createRunState('test'), { type: 'endRunLoss' })

    render(
      <RunContext.Provider value={{ runState: lostState, runDispatch }}>
        <AppContent />
      </RunContext.Provider>
    )

    await userEvent.click(screen.getByRole('button', { name: /nueva run/i }))

    expect(runDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'newRun' })
    )
  })

  it('shows splash screen when run status is splash', () => {
    const splashState = createRunState('test')

    render(
      <RunContext.Provider value={{ runState: splashState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('game-view')).not.toBeInTheDocument()
  })

  it('renders GameView when run is playing', () => {
    const playingState = runReducer(createRunState('test'), { type: 'startMesa' })

    render(
      <RunContext.Provider value={{ runState: playingState, runDispatch: () => {} }}>
        <AppContent />
      </RunContext.Provider>
    )

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.queryByTestId('run-end-screen')).not.toBeInTheDocument()
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
