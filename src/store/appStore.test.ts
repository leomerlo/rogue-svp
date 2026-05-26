import { describe, expect, it, beforeEach } from 'vitest'
import { useAppStore } from './appStore'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ title: 'RogueSVP' })
  })

  it('updates title', () => {
    useAppStore.getState().setTitle('RSVP Roguelike')
    expect(useAppStore.getState().title).toBe('RSVP Roguelike')
  })
})
