import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { GameState } from '@/game/types'
import { GameProvider } from '@/ui/providers/GameProvider'

export function renderWithGameState(
  ui: ReactElement,
  state: GameState,
  options?: RenderOptions,
) {
  return render(
    <GameProvider initialState={state}>{ui}</GameProvider>,
    options,
  )
}
