import GameView from './GameView'
import { GameProvider } from './providers/GameProvider'
import { createPathInitialState } from '@/test/utils/pathLevel'

const App = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <GameProvider initialState={createPathInitialState()}>
        <GameView />
      </GameProvider>
    </main>
  )
}

export default App
