import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { gameReducer } from '@/game/gameReducer'
import { createPathInitialState, PATH_SOLUTION } from '@/test/utils/pathLevel'
import { createRingInitialState } from '@/test/utils/ringLevel'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import Board from './Board'
import Controls from './Controls'
import Hand from './Hand'

describe('Controls level changer', () => {
  afterEach(() => cleanup())

  const renderLevelChanger = (state = createPathInitialState()) =>
    renderWithGameState(
      <>
        <Board />
        <Hand />
        <Controls />
      </>,
      state,
    )

  it('renders Path, Ring, and generated difficulty buttons', () => {
    renderLevelChanger()

    expect(screen.getByRole('button', { name: 'Path' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ring' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gen 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gen 5' })).toBeInTheDocument()
  })

  it('switches from path to ring and updates the board and hand', () => {
    renderLevelChanger()

    expect(screen.getByTestId('board').children).toHaveLength(6)
    expect(
      within(screen.getByTestId('hand')).getAllByTestId('card')[0],
    ).toHaveAttribute('aria-label', 'red / green')

    fireEvent.click(screen.getByRole('button', { name: 'Ring' }))

    expect(screen.getByTestId('board').children).toHaveLength(9)
    expect(
      within(screen.getByTestId('board')).getAllByTestId('empty-cell'),
    ).toHaveLength(9)
    expect(
      within(screen.getByTestId('hand')).getAllByTestId('card')[0],
    ).toHaveAttribute('aria-label', 'yellow / red')
  })

  it('switches from ring to path and updates the board and hand', () => {
    renderLevelChanger(createRingInitialState())

    expect(screen.getByTestId('board').children).toHaveLength(9)

    fireEvent.click(screen.getByRole('button', { name: 'Path' }))

    expect(screen.getByTestId('board').children).toHaveLength(6)
    expect(
      within(screen.getByTestId('hand')).getAllByTestId('card')[0],
    ).toHaveAttribute('aria-label', 'red / green')
  })

  it('clears placed cards when switching levels mid-game', () => {
    const midGame = gameReducer(createPathInitialState(), {
      type: 'placeCard',
      move: PATH_SOLUTION[0]!,
    })

    renderLevelChanger(midGame)

    expect(within(screen.getByTestId('board')).getAllByTestId('card')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Ring' }))

    expect(within(screen.getByTestId('board')).queryAllByTestId('card')).toHaveLength(0)
    expect(within(screen.getByTestId('hand')).getAllByTestId('card')).toHaveLength(3)
  })
})
