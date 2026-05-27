import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, screen } from '@testing-library/react'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'
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

  it('renders wild color fills', () => {
    const card = makeCard('wild-1', 'wild', 'blue')
    const state = makeState(1, 1, [makeCell(0, 0)])

    renderWithGameState(<Card card={card} />, state)

    expect(screen.getByTestId('card').style.background).toBe(
      'linear-gradient(right, rgb(168, 85, 247) 50%, rgb(59, 130, 246) 50%)',
    )
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
    const state = makeState(1, 1, [makeCell(0, 0)], { selectedCardId: 'c1' })

    renderWithGameState(<Card card={card} />, state)

    expect(screen.getByTestId('card')).toHaveClass('border-blue-500')
  })
})
