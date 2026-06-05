import { createRunState } from '@/game/createRunState'
import type { RunAction, RunState } from '@/game/types'

export const RUN_MESA_COUNT = 4

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'startReward':
      return { ...state, status: 'reward', pendingMesaScore: action.mesaScore }
    case 'startMesa':
      if (state.status !== 'splash') return state
      return { ...state, status: 'playing' }
    case 'advanceLevel': {
      const scoreTotal = state.scoreTotal + action.mesaScore
      const topologyIndex = state.topologyIndex + 1
      if (topologyIndex >= RUN_MESA_COUNT) {
        return { ...state, scoreTotal, topologyIndex: RUN_MESA_COUNT, status: 'won', pendingMesaScore: 0 }
      }
      return { ...state, scoreTotal, topologyIndex, status: 'splash', pendingMesaScore: 0 }
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
    case 'applyNarrativeTag': {
      const { slotIndex, tag } = action
      if (slotIndex < 0 || slotIndex >= state.narrativeState.roster.length) return state
      const roster = state.narrativeState.roster.map((slot, i) => {
        if (i !== slotIndex) return slot
        if (slot.tags.includes(tag)) return slot
        return { ...slot, tags: [...slot.tags, tag] }
      })
      return { ...state, narrativeState: { ...state.narrativeState, roster } }
    }
    default:
      return state
  }
}
