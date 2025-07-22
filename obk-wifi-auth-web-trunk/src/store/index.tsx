import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  imageSrc: string | null
  setImageSrc: (imageSrc: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    set => ({
      imageSrc: null,
      setImageSrc: (imageSrc: string) => set({ imageSrc }),
    }),
    {
      name: 'login-storage', // unique name for storage
    }
  )
)

interface NavigationState {
  previousPath: string
  currentPath: string
  setPreviousPath: (path: string) => void
  setCurrentPath: (path: string) => void
}

export const useNavigationStore = create<NavigationState>(set => ({
  previousPath: '',
  currentPath: '',
  setPreviousPath: path => set({ previousPath: path }),
  setCurrentPath: path => set({ currentPath: path }),
}))
