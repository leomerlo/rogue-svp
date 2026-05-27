import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { useGameStore } from './store/gameStore'
import { createM11PathMidGameState } from './test/utils/createInitialState'
import App from './ui/App.tsx'

if (import.meta.env.DEV) {
  useGameStore.setState({ gameState: createM11PathMidGameState() })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
