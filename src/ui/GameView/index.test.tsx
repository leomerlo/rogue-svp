import { describe, expect, it, vi, afterEach } from 'vitest'
import { act, cleanup, screen, within } from '@testing-library/react'
import { gameReducer } from '@/game/gameReducer'
import { createRunState } from '@/game/createRunState'
import {
  createPathInitialState,
  PATH_SOLUTION,
} from '@/test/utils/pathLevel'
import { makeState } from '@/test/utils/factories'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import { RunContext } from '@/ui/context/RunContext'
import { GameProvider } from '@/ui/providers/GameProvider'
import { render } from '@testing-library/react'
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

  it('dispatches startReward to run when game is won on a non-final mesa', async () => {
    const runDispatch = vi.fn()
    let wonState = createPathInitialState()
    for (const move of PATH_SOLUTION) {
      wonState = gameReducer(wonState, { type: 'placeCard', move })
    }

    render(
      <RunContext.Provider value={{ runState: createRunState('test'), runDispatch }}>
        <GameProvider initialState={wonState}>
          <GameView />
        </GameProvider>
      </RunContext.Provider>
    )

    await act(async () => {})

    expect(runDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'startReward', mesaScore: expect.any(Number) })
    )
  })

  it('dispatches advanceLevel directly when game is won on the last mesa', async () => {
    const runDispatch = vi.fn()
    let wonState = createPathInitialState()
    for (const move of PATH_SOLUTION) {
      wonState = gameReducer(wonState, { type: 'placeCard', move })
    }

    const lastMesaRunState = { ...createRunState('test'), topologyIndex: 3 }

    render(
      <RunContext.Provider value={{ runState: lastMesaRunState, runDispatch }}>
        <GameProvider initialState={wonState}>
          <GameView />
        </GameProvider>
      </RunContext.Provider>
    )

    await act(async () => {})

    expect(runDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'advanceLevel', mesaScore: expect.any(Number) })
    )
  })

  it('dispatches endRunLoss to run when game is lost', async () => {
    const runDispatch = vi.fn()
    const lostState = makeState(1, 6, [], { status: 'lost' })

    render(
      <RunContext.Provider value={{ runState: createRunState('test'), runDispatch }}>
        <GameProvider initialState={lostState}>
          <GameView />
        </GameProvider>
      </RunContext.Provider>
    )

    await act(async () => {})

    expect(runDispatch).toHaveBeenCalledWith({ type: 'endRunLoss' })
  })
})
