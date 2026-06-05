import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SplashScreen from './index'

describe('SplashScreen', () => {
  afterEach(() => cleanup())

  it('renders party type label', () => {
    render(<SplashScreen partyTypeLabel="La Boda" oneLiner="Elena se casa." onDismiss={() => {}} />)
    expect(screen.getByText('La Boda')).toBeInTheDocument()
  })

  it('renders one-liner text', () => {
    render(<SplashScreen partyTypeLabel="La Boda" oneLiner="Elena se casa con un forastero." onDismiss={() => {}} />)
    expect(screen.getByText('Elena se casa con un forastero.')).toBeInTheDocument()
  })

  it('calls onDismiss when Comenzar is clicked', async () => {
    const onDismiss = vi.fn()
    render(<SplashScreen partyTypeLabel="La Boda" oneLiner="Una boda." onDismiss={onDismiss} />)

    await userEvent.click(screen.getByTestId('splash-dismiss'))

    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('has data-testid splash-screen', () => {
    render(<SplashScreen partyTypeLabel="El Funeral" oneLiner="Todos vienen a llorar." onDismiss={() => {}} />)
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()
  })
})
