import type { GameState } from '@/game/types'
import { TOPOLOGY_COUNT } from '@/game/topologies'

type StatusOverlayProps = {
  status: GameState['status']
  topologyIndex: number | null
  onAdvanceTopology: () => void
}

const StatusOverlay = ({ status, topologyIndex, onAdvanceTopology }: StatusOverlayProps) => {
  if (status === 'playing') return null

  const isWin = status === 'won'
  const canAdvance = isWin && topologyIndex !== null && topologyIndex < TOPOLOGY_COUNT - 1
  const isRunComplete = isWin && topologyIndex === TOPOLOGY_COUNT - 1

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 flex items-center justify-center bg-slate-950/80"
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className={`text-4xl font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
          {isWin ? 'You won!' : 'You lost!'}
        </h1>
        {canAdvance && (
          <button
            type="button"
            onClick={onAdvanceTopology}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            Next level
          </button>
        )}
        {isRunComplete && (
          <p className="text-lg text-white">Run complete!</p>
        )}
      </div>
    </div>
  )
}

export default StatusOverlay
