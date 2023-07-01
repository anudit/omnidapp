import { Identity } from '@semaphore-protocol/identity';
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
  zkIdData: null | string[],
  setHasHydrated: (state: boolean) => void
  setupBase: () => void
  getZkId: () => Identity
}

const store: (set, get) => AccountStoreType = (set, get) => ({

  basePrivKey: null,
  basePubKey: null,
  zkIdData: null,
  hasHydrated: false,

  setHasHydrated: (state) => {
    set(async (curState) => {
      if (curState.basePrivKey === null) {
        await curState.setupBase();
      }
      return {
        hasHydrated: state
      }
    });
  },

  setupBase: async () => {
    console.log('setupbase');

    const wallet = ethers.Wallet.createRandom();
    const message = `Setting up my Omnid with ${wallet.address}`;
    const sig = await wallet.signMessage(message);
    const identity = new Identity(sig);

    set({
      basePrivKey: wallet.privateKey,
      basePubKey: wallet.address,
      zkIdData: [`0x${identity.trapdoor.toString(16)}`, `0x${identity.nullifier.toString(16)}`]
    });

  },

  getZkId: () => {
    return new Identity(JSON.stringify(get().zkIdData))
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
