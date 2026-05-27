import GameView from './GameView'
import { GameProvider } from './providers/GameProvider'
import { createM11PathInitialState } from '@/test/utils/createInitialState'

const App = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <GameProvider initialState={createM11PathInitialState()}>
        <GameView />
      </GameProvider>
    </main>
  )
}

export default App
