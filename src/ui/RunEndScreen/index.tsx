interface RunEndScreenProps {
  status: 'won' | 'lost'
  scoreTotal: number
  onNewRun: () => void
}

const RunEndScreen = ({ status, scoreTotal, onNewRun }: RunEndScreenProps) => {
  const isWon = status === 'won'

  return (
    <div className="flex flex-col items-center gap-6" data-testid="run-end-screen">
      <h1
        className={`text-3xl font-bold ${isWon ? 'text-yellow-400' : 'text-red-500'}`}
        data-testid="run-end-title"
      >
        {isWon ? '¡Fiesta completada!' : 'La fiesta terminó antes de tiempo.'}
      </h1>

      <p className="text-lg text-slate-300" data-testid="run-end-score">
        Puntaje total:{' '}
        <span className={`font-bold ${isWon ? 'text-yellow-300' : 'text-slate-100'}`}>
          {scoreTotal}
        </span>
      </p>

      <button
        onClick={onNewRun}
        className={`rounded-md px-6 py-3 font-semibold transition-colors ${
          isWon
            ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400'
            : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
        }`}
        data-testid="new-run-button"
      >
        Nueva Run
      </button>
    </div>
  )
}

export default RunEndScreen
