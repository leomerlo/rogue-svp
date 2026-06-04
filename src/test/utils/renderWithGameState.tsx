import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { GameState } from '@/game/types'
import { GameProvider } from '@/ui/providers/GameProvider'
import { RunProvider } from '@/ui/providers/RunProvider'
import { createRunState } from '@/game/createRunState'

const TEST_RUN_STATE = createRunState('test-seed')

export function renderWithGameState(
  ui: ReactElement,
  state: GameState,
  options?: RenderOptions,
) {
  return render(
    <RunProvider initialState={TEST_RUN_STATE}>
      <GameProvider initialState={state}>{ui}</GameProvider>
    </RunProvider>,
    options,
  )
}
