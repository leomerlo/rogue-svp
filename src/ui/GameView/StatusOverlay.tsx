import type { GameState } from '@/game/types'

const StatusOverlay = ({ status }: { status: GameState['status'] }) => {
  if (status === 'playing') return null

  const isWin = status === 'won'

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 flex items-center justify-center bg-slate-950/80"
    >
      <h1 className={`text-4xl font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
        {isWin ? 'You won!' : 'You lost!'}
      </h1>
    </div>
  )
}

export default StatusOverlay
