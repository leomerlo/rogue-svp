import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RunEndScreen from './index'

describe('RunEndScreen', () => {
  afterEach(() => cleanup())

  describe('won variant', () => {
    it('renders the won title and score', () => {
      render(<RunEndScreen status="won" scoreTotal={320} onNewRun={() => {}} />)

      expect(screen.getByTestId('run-end-screen')).toBeInTheDocument()
      expect(screen.getByTestId('run-end-title')).toHaveTextContent('¡Fiesta completada!')
      expect(screen.getByTestId('run-end-score')).toHaveTextContent('320')
    })

    it('calls onNewRun when Nueva Run is clicked', async () => {
      const onNewRun = vi.fn()
      render(<RunEndScreen status="won" scoreTotal={320} onNewRun={onNewRun} />)

      await userEvent.click(screen.getByTestId('new-run-button'))

      expect(onNewRun).toHaveBeenCalledTimes(1)
    })
  })

  describe('lost variant', () => {
    it('renders the lost title and score', () => {
      render(<RunEndScreen status="lost" scoreTotal={85} onNewRun={() => {}} />)

      expect(screen.getByTestId('run-end-title')).toHaveTextContent(
        'La fiesta terminó antes de tiempo.',
      )
      expect(screen.getByTestId('run-end-score')).toHaveTextContent('85')
    })

    it('calls onNewRun when Nueva Run is clicked', async () => {
      const onNewRun = vi.fn()
      render(<RunEndScreen status="lost" scoreTotal={85} onNewRun={onNewRun} />)

      await userEvent.click(screen.getByTestId('new-run-button'))

      expect(onNewRun).toHaveBeenCalledTimes(1)
    })
  })

  it('renders Nueva Run button in both variants', () => {
    const { rerender } = render(<RunEndScreen status="won" scoreTotal={0} onNewRun={() => {}} />)
    expect(screen.getByTestId('new-run-button')).toHaveTextContent('Nueva Run')

    rerender(<RunEndScreen status="lost" scoreTotal={0} onNewRun={() => {}} />)
    expect(screen.getByTestId('new-run-button')).toHaveTextContent('Nueva Run')
  })
})
