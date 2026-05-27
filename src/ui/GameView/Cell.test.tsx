import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { makeCard, makeCell } from '@/test/utils/factories'
import Cell from './Cell'

describe('Cell', () => {
  afterEach(() => cleanup())

  it('renders a Card when a card is provided', () => {
    const card = makeCard('c1', 'red', 'blue')
    render(<Cell cell={makeCell(0, 0)} card={card} />)

    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'red / blue')
    expect(screen.queryByTestId('empty-cell')).not.toBeInTheDocument()
  })

  it('renders a free empty cell when no card is placed', () => {
    render(<Cell cell={makeCell(0, 0)} card={null} />)

    const emptyCell = screen.getByTestId('empty-cell')
    expect(emptyCell).toHaveClass('bg-white')
    expect(screen.queryByTestId('card')).not.toBeInTheDocument()
  })

  it('renders a blocked empty cell when no card is placed', () => {
    render(<Cell cell={makeCell(1, 0, { state: 'blocked' })} card={null} />)

    expect(screen.getByTestId('empty-cell')).toHaveClass('bg-gray-500')
  })
})
