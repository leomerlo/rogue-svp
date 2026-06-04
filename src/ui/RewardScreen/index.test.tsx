import { describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RewardScreen from './index'
import type { Relic } from '@/game/relics'

const MOCK_RELICS: Relic[] = [
  { id: 'extra_redeal', name: 'Extra Re-deal', description: 'One more re-deal.' },
  { id: 'peek_5', name: 'Peek Five', description: 'See top 5 cards.' },
  { id: 'score_streak', name: 'Clean Streak', description: 'Bonus for no re-deals.' },
]

describe('RewardScreen', () => {
  afterEach(() => cleanup())

  it('renders all 3 relic options with name and description', () => {
    render(<RewardScreen relics={MOCK_RELICS} onSelect={() => {}} />)

    expect(screen.getByTestId('reward-screen')).toBeInTheDocument()
    expect(screen.getByText('Extra Re-deal')).toBeInTheDocument()
    expect(screen.getByText('One more re-deal.')).toBeInTheDocument()
    expect(screen.getByText('Peek Five')).toBeInTheDocument()
    expect(screen.getByText('See top 5 cards.')).toBeInTheDocument()
    expect(screen.getByText('Clean Streak')).toBeInTheDocument()
  })

  it('calls onSelect with the relic id when a relic is clicked', async () => {
    const onSelect = vi.fn()
    render(<RewardScreen relics={MOCK_RELICS} onSelect={onSelect} />)

    await userEvent.click(screen.getByTestId('relic-option-peek_5'))

    expect(onSelect).toHaveBeenCalledWith('peek_5')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
