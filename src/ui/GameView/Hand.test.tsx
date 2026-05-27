import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen, within } from '@testing-library/react'
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
})
