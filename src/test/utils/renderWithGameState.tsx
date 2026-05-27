import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { GameState } from '@/game/types'
import { useGameStore } from '@/store/gameStore'

export function renderWithGameState(
  ui: ReactElement,
  state: GameState,
  options?: RenderOptions,
) {
  useGameStore.setState({ gameState: state })
  return render(ui, options)
}
