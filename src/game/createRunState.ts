import type { RunState } from '@/game/types'

function createRunState(seed: string): RunState {
  return {
    topologyIndex: 0,
    relicsActive: [],
    scoreTotal: 0,
    seed,
    status: 'playing',
  }
}

export { createRunState }