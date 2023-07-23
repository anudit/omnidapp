import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreApi, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface StoreType {
  hasHydrated: boolean,
  shakeToCancel: boolean,
  developerMode: boolean,
  toggleShakeToCancel: () => void,
  toggleDeveloperMode: () => void,
  setHasHydrated: (state: boolean) => void
}

export const store: (set: StoreApi<StoreType>['setState'], get: StoreApi<StoreType>['getState']) => StoreType = (set) => ({

  shakeToCancel: true,
  hasHydrated: false,
  developerMode: false,
  toggleShakeToCancel: () => set((state) => ({ shakeToCancel: !state.shakeToCancel })),
  toggleDeveloperMode: () => set((state) => ({ developerMode: !state.developerMode })),
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
      state?.setHasHydrated(true)
    }
  })
);
