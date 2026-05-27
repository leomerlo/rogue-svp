import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import Hand from './Hand'

describe('Hand', () => {
  afterEach(() => cleanup())

  it('renders all hand cards', () => {
    const hand = [
      makeCard('h1', 'red', 'green'),
      makeCard('h2', 'blue', 'yellow'),
      makeCard('h3', 'green', 'red'),
    ]
    const state = makeState(1, 1, [makeCell(0, 0)], { hand })

    renderWithGameState(<Hand />, state)

    const handElement = screen.getByTestId('hand')
    expect(handElement).toHaveClass('grid-cols-3')
    expect(within(handElement).getAllByTestId('card')).toHaveLength(3)
    expect(
      within(handElement)
        .getAllByTestId('card')
        .map((el) => el.getAttribute('aria-label')),
    ).toEqual(['red / green', 'blue / yellow', 'green / red'])
  })

  it('renders an empty hand without cards', () => {
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [] })

    renderWithGameState(<Hand />, state)

    expect(within(screen.getByTestId('hand')).queryAllByTestId('card')).toHaveLength(0)
  })

  it('does not show happiness borders on hand cards', () => {
    const hand = [makeCard('h1', 'red', 'green')]
    const state = makeState(1, 1, [makeCell(0, 0)], { hand })

    renderWithGameState(<Hand />, state)

    const card = within(screen.getByTestId('hand')).getByTestId('card')
    expect(card).not.toHaveClass('border-green-500')
    expect(card).not.toHaveClass('border-red-500')
  })

  it('toggles selection when clicking the same hand card', () => {
    const hand = [makeCard('h1', 'red', 'green')]
    const state = makeState(1, 1, [makeCell(0, 0)], { hand })

    renderWithGameState(<Hand />, state)

    const card = within(screen.getByTestId('hand')).getByTestId('card')
    fireEvent.click(card)
    expect(card).toHaveClass('border-blue-500')

    fireEvent.click(card)
    expect(card).not.toHaveClass('border-blue-500')
  })

  it('ignores click interactions when game is over', () => {
    const hand = [makeCard('h1', 'red', 'green')]
    const state = makeState(1, 1, [makeCell(0, 0)], { hand, status: 'won' })

    renderWithGameState(<Hand />, state)

    const card = within(screen.getByTestId('hand')).getByTestId('card')
    fireEvent.click(card)
    expect(card).not.toHaveClass('border-blue-500')
  })
})
