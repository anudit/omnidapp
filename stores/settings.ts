import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoreType {
  count: number
  increment: () => void
  decrement: () => void
  setHasHydrated: (state: boolean) => void
}

export const store: (set, get) => StoreType = (set) => ({

  count: 0,
  hasHydrated: false,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    });
  }
})

export const useSettingsStore = create(
  persist(store, {
    storage: createJSONStorage(() => AsyncStorage),
    name: "omnid-store",
    version: 1,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
);