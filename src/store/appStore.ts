import { create } from 'zustand'

type AppState = {
  title: string
  setTitle: (title: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  title: 'RogueSVP',
  setTitle: (title) => set({ title }),
}))
