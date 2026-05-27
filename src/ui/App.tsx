import { useGameStore } from "../store/gameStore"
import GameView from "./GameView"

const App = () => {
  const status = useGameStore((state) => state.gameState.status)
  
  if (status === 'playing') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <GameView />
      </main>
    )
  }
  
  if (status === 'won') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <h1 className="text-4xl font-bold text-green-500">You won!</h1>
      </main>
    )
  }
  
  if (status === 'lost') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <h1 className="text-4xl font-bold text-red-500">You lost!</h1>
      </main>
    )
  }
}

export default App
