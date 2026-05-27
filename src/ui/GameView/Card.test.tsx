import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { makeCard } from '@/test/utils/factories'
import Card from './Card'

describe('Card', () => {
  afterEach(() => cleanup())

  it('renders both colors with a diagonal gradient and accessible label', () => {
    const card = makeCard('c1', 'red', 'green')
    render(<Card card={card} />)

    const element = screen.getByTestId('card')
    expect(element).toHaveAttribute('aria-label', 'red / green')
    expect(element).toHaveStyle({
      background: 'linear-gradient(right, rgb(239, 68, 68) 50%, rgb(34, 197, 94) 50%)',
    })
  })

  it('renders wild color fills', () => {
    const card = makeCard('wild-1', 'wild', 'blue')
    render(<Card card={card} />)

    expect(screen.getByTestId('card')).toHaveStyle({
      background: 'linear-gradient(right, rgb(168, 85, 247) 50%, rgb(59, 130, 246) 50%)',
    })
  })
})
