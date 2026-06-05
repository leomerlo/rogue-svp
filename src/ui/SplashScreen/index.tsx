type SplashScreenProps = {
  partyTypeLabel: string
  oneLiner: string
  onDismiss: () => void
}

const SplashScreen = ({ partyTypeLabel, oneLiner, onDismiss }: SplashScreenProps) => (
  <div
    className="flex flex-col items-center gap-8 text-center"
    data-testid="splash-screen"
  >
    <h1 className="text-4xl font-bold text-yellow-400">{partyTypeLabel}</h1>
    <p className="max-w-md text-lg text-slate-300 italic">{oneLiner}</p>
    <button
      onClick={onDismiss}
      className="rounded-lg bg-yellow-500 px-8 py-3 text-lg font-semibold text-slate-900 hover:bg-yellow-400"
      data-testid="splash-dismiss"
    >
      Comenzar
    </button>
  </div>
)

export default SplashScreen
