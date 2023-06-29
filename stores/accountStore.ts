import { ethers } from 'ethers';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { create } from 'zustand';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await deleteItemAsync(name);
  },
};

export interface AccountStoreType {
  basePrivKey: null | string,
  basePubKey: null | string,
  hasHydrated: boolean,
  setHasHydrated: (state: boolean) => void
  setupBase: () => void
}

const store: (set, get) => AccountStoreType = (set) => ({

  basePrivKey: null,
  basePubKey: null,
  hasHydrated: false,
  setHasHydrated: (state) => {
    set((curState) => {
      if (curState.basePrivKey === null) {
        curState.setupBase();
      }
      return {
        hasHydrated: state
      }
    });
  },
  setupBase: () => {
    console.log('setupbase')
    const wallet = ethers.Wallet.createRandom();
    set({
      basePrivKey: wallet.privateKey,
      basePubKey: wallet.address,
    });
  }
})

export const useAccountStore = create(
  persist(store, {
    storage: createJSONStorage(() => customStorage),
    name: "omnid-account-store",
    version: 1,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
);
