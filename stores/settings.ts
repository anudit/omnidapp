import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface StoreType {
  count: number,
  hasHydrated: boolean,
  shakeToCancel: boolean,
  developerMode: boolean,
  toggleShakeToCancel: () => void,
  toggleDeveloperMode: () => void,
  increment: () => void,
  decrement: () => void,
  setHasHydrated: (state: boolean) => void
}

export const store: (set, get) => StoreType = (set) => ({

  count: 0,
  shakeToCancel: true,
  hasHydrated: false,
  developerMode: false,
  toggleShakeToCancel: () => set((state) => ({ shakeToCancel: !state.shakeToCancel })),
  toggleDeveloperMode: () => set((state) => ({ developerMode: !state.developerMode })),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setHasHydrated: (state) => {
    set({
      hasHydrated: state
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
