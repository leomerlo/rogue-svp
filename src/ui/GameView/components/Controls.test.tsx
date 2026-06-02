import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { createPathInitialState } from '@/test/utils/pathLevel'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import Board from './Board'
import Controls from './Controls'
import Hand from './Hand'

describe('Controls', () => {
  afterEach(() => cleanup())

  const renderControls = (state = createPathInitialState()) =>
    renderWithGameState(
      <>
        <Board />
        <Hand />
        <Controls />
      </>,
      state,
    )

  it('renders Re-deal and Generated buttons', () => {
    renderControls()

    expect(screen.getByRole('button', { name: /Re-deal/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generated' })).toBeInTheDocument()
  })

  it('loads generated topology 0 when Generated is clicked', () => {
    renderControls()

    fireEvent.click(screen.getByRole('button', { name: 'Generated' }))

    const expected = createGeneratedGameState(0, { seed: 42 })
    expect(screen.getByTestId('board').children).toHaveLength(expected.rows * expected.cols)
  })
})
