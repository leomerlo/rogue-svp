import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  afterEach(() => cleanup())

  it('renders GameView with board and hand', () => {
    render(<App />)

    expect(screen.getByTestId('game-view')).toBeInTheDocument()
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('hand')).toBeInTheDocument()
    expect(screen.getByTestId('board').children).toHaveLength(6)
  })

  it('does not show a status overlay while playing', () => {
    render(<App />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
