import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import Board from './Board'

describe('Board', () => {
  afterEach(() => cleanup())

  it('renders one cell per game cell with the correct grid columns', () => {
    const placed = makeCard('c1', 'red', 'green')
    const state = makeState(1, 3, [
      makeCell(0, 0, { cardId: 'c1' }),
      makeCell(0, 1),
      makeCell(0, 2),
    ], { placedCards: { c1: placed } })

    renderWithGameState(<Board />, state)

    const board = screen.getByTestId('board')
    expect(board).toHaveStyle({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' })
    expect(board.children).toHaveLength(3)
    expect(within(board).getAllByTestId('card')).toHaveLength(1)
    expect(within(board).getAllByTestId('empty-cell')).toHaveLength(2)
  })

  it('resolves placed cards from placedCards by cell cardId', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'green', 'blue')
    const state = makeState(1, 2, [
      makeCell(0, 0, { cardId: 'left' }),
      makeCell(0, 1, { cardId: 'right' }),
    ], { placedCards: { left, right } })

    renderWithGameState(<Board />, state)

    const labels = within(screen.getByTestId('board'))
      .getAllByTestId('card')
      .map((el) => el.getAttribute('aria-label'))

    expect(labels).toEqual(['red / green', 'green / blue'])
  })

  it('renders an empty cell when cardId is missing from placedCards', () => {
    const state = makeState(1, 1, [makeCell(0, 0, { cardId: 'missing' })])

    renderWithGameState(<Board />, state)

    expect(within(screen.getByTestId('board')).getByTestId('empty-cell')).toBeInTheDocument()
  })
})
