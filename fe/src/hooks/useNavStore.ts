import { create } from 'zustand'

interface NavStore {
  name: string
  setName: (name: string) => void
}

export const useNavStore = create<NavStore>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}))
