import { describe, expect, it, afterEach, vi } from 'vitest'
import { cleanup, fireEvent, screen } from '@testing-library/react'
import { makeCard, makeCell, makeState, makeWildCard } from '@/test/utils/factories'
import { renderWithGameState } from '@/test/utils/renderWithGameState'
import Card from './Card'

describe('Card', () => {
  afterEach(() => cleanup())

  it('renders both colors with a diagonal gradient and accessible label', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} />, state)

    const element = screen.getByTestId('card')
    expect(element).toHaveAttribute('aria-label', 'red / green')
    expect(element.style.background).toBe(
      'linear-gradient(right, rgb(239, 68, 68) 50%, rgb(34, 197, 94) 50%)',
    )
  })

  it('renders wild card with rainbow gradient and W label', () => {
    const card = makeWildCard('wild-1')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} />, state)

    const element = screen.getByTestId('card')
    expect(element).toHaveAttribute('aria-label', 'wild / wild')
    expect(element.style.background).toContain('linear-gradient')
    expect(screen.getByText('W')).toBeDefined()
  })

  it('applies a green border when happiness is happy', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} happiness="happy" />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-green-500')
    expect(screen.getByTestId('card')).not.toHaveClass('border-red-500')
  })

  it('applies a red border when happiness is unhappy', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} happiness="unhappy" />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-red-500')
    expect(screen.getByTestId('card')).not.toHaveClass('border-green-500')
  })

  it('does not apply happiness borders when happiness is omitted', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} />, state)

    const element = screen.getByTestId('card')
    expect(element).not.toHaveClass('border-green-500')
    expect(element).not.toHaveClass('border-red-500')
  })

  it('applies a blue border when the card is selected', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} selected />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-blue-500')
  })

  it('calls onClick when the card is interactive', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])
    const clickHandler = vi.fn()

    renderWithGameState(<Card card={card} onClick={clickHandler} />, state)

    fireEvent.click(screen.getByTestId('card'))
    expect(clickHandler).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when the card is disabled', () => {
    const card = makeCard('c1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)])
    const clickHandler = vi.fn()

    renderWithGameState(<Card card={card} onClick={clickHandler} disabled />, state)

    fireEvent.click(screen.getByTestId('card'))
    expect(clickHandler).not.toHaveBeenCalled()
  })
})
