import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import Cell from './Cell'

describe('Cell', () => {
  afterEach(() => cleanup())

  it('renders a Card when a card is provided', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Cell cell={makeCell(0, 0)} card={card} />, state)

    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'red / blue')
    expect(screen.queryByTestId('empty-cell')).not.toBeInTheDocument()
  })

  it('renders a free empty cell when no card is placed', () => {
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Cell cell={makeCell(0, 0)} card={null} />, state)

    const emptyCell = screen.getByTestId('empty-cell')
    expect(emptyCell).toHaveClass('bg-white')
    expect(screen.queryByTestId('card')).not.toBeInTheDocument()
  })

  it('renders a blocked empty cell when no card is placed', () => {
    const state = makeState(1, 1, [makeCell(1, 0, { state: 'blocked' })])

    renderWithGameState(
      <Cell cell={makeCell(1, 0, { state: 'blocked' })} card={null} />,
      state,
    )

    expect(screen.getByTestId('empty-cell')).toHaveClass('bg-gray-500')
  })

  it('shows a happy border when the placed card satisfies isHappy', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'green', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'left' }),
      makeCell(0, 1, { cardId: 'right' }),
    ]
    const state = makeState(1, 2, cells, { placedCards: { left, right } })

    renderWithGameState(<Cell cell={cells[0]!} card={left} />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-green-500')
  })

  it('shows an unhappy border when adjacent edges do not match', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'yellow', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'left' }),
      makeCell(0, 1, { cardId: 'right' }),
    ]
    const state = makeState(1, 2, cells, { placedCards: { left, right } })

    renderWithGameState(<Cell cell={cells[0]!} card={left} />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-red-500')
  })

  it('shows an unhappy border when an adjacent seat is empty', () => {
    const card = makeCard('c1', 'red', 'green')
    const cells = [makeCell(0, 0, { cardId: 'c1' }), makeCell(0, 1)]
    const state = makeState(1, 2, cells, { placedCards: { c1: card } })

    renderWithGameState(<Cell cell={cells[0]!} card={card} />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-red-500')
  })

  it('shows selected border when the cell card is selected', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { cardId: 'c1' })
    const state = makeState(1, 1, [cell], { placedCards: { c1: card }, selectedCardId: 'c1' })

    renderWithGameState(<Cell cell={cell} card={card} />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-blue-500')
  })

  it('toggles selected state when clicking the same placed card', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { cardId: 'c1' })
    const state = makeState(1, 1, [cell], { placedCards: { c1: card } })

    renderWithGameState(<Cell cell={cell} card={card} />, state)

    const cardElement = screen.getByTestId('card')
    fireEvent.click(cardElement)
    expect(cardElement).toHaveClass('border-blue-500')

    fireEvent.click(cardElement)
    expect(cardElement).not.toHaveClass('border-blue-500')
  })

  it('shows a P label when the cell is pinned', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { state: 'pinned', cardId: 'c1' })
    const state = makeState(1, 1, [cell], { placedCards: { c1: card } })

    renderWithGameState(<Cell cell={cell} card={card} />, state)

    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('does not show a P label when the cell is not pinned', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { cardId: 'c1' })
    const state = makeState(1, 1, [cell], { placedCards: { c1: card } })

    renderWithGameState(<Cell cell={cell} card={card} />, state)

    expect(screen.queryByText('P')).not.toBeInTheDocument()
  })

  it('does not select a pinned card when clicked', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { state: 'pinned', cardId: 'c1' })
    const state = makeState(1, 1, [cell], { placedCards: { c1: card } })

    renderWithGameState(<Cell cell={cell} card={card} />, state)

    fireEvent.click(screen.getByTestId('card'))
    expect(screen.getByTestId('card')).not.toHaveClass('border-blue-500')
  })
})
