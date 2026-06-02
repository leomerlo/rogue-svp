import { createRunState } from '@/game/createRunState'
import type { RunAction, RunState } from '@/game/types'

const RUN_MESA_COUNT = 4

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'advanceLevel': {
      const scoreTotal = state.scoreTotal + action.mesaScore
      const topologyIndex = state.topologyIndex + 1
      if (topologyIndex >= RUN_MESA_COUNT) {
        return { ...state, scoreTotal, topologyIndex: RUN_MESA_COUNT, status: 'won' }
      }
      return { ...state, scoreTotal, topologyIndex }
    }
    case 'endRunLoss':
      return { ...state, status: 'lost' }
    case 'applyRelic':
      return {
        ...state,
        relicsActive: [...state.relicsActive, action.relicId],
      }
    case 'newRun':
      return createRunState(action.seed)
    default:
      return state
  }
}
