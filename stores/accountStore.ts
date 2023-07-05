import { Identity } from '@semaphore-protocol/identity';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { WalletClient, createWalletClient, fallback, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { arbitrum, arbitrumGoerli } from 'viem/chains';
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
  getSigner: (isDev: boolean) => WalletClient
}

const store: (set, get) => AccountStoreType = (set, get) => ({

  basePrivKey: null,
  basePubKey: null,
  zkIdData: null,
  hasHydrated: false,

  setHasHydrated: (state) => {
    if (get().basePrivKey === null) {
      get().setupBase().then(() => {
        return set({
          hasHydrated: state
        });
      });
    }
    else {
      return set({
        hasHydrated: state
      });
    }
  },

  setupBase: async () => {
    console.log('setupbase');

    const newPk = generatePrivateKey();
    const wallet = privateKeyToAccount(newPk)
    const message = `Setting up my Omnid with ${wallet.address}`;
    const sig = await wallet.signMessage({ message });
    const identity = new Identity(sig);

    set({
      basePrivKey: newPk,
      basePubKey: wallet.address,
      zkIdData: [`0x${identity.trapdoor.toString(16)}`, `0x${identity.nullifier.toString(16)}`]
    });

  },

  getZkId: () => {
    return new Identity(JSON.stringify(get().zkIdData))
  },

  getSigner: (isDev = false) => {
    const arbitrumClient = createWalletClient({
      account: privateKeyToAccount(get().basePrivKey),
      chain: arbitrum,
      transport: fallback([
        http('https://arb1.arbitrum.io/rpc'),
        http('https://arbitrum-one.public.blastapi.io'),
        http('https://rpc.ankr.com/arbitrum'),
      ])
    })

    const arbitrumGoerliClient = createWalletClient({
      account: privateKeyToAccount(get().basePrivKey),
      chain: arbitrumGoerli,
      transport: fallback([
        http('https://goerli-rollup.arbitrum.io/rpc'),
        http('https://arb-goerli.g.alchemy.com/v2/demo'),
        http('https://arbitrum-goerli.public.blastapi.io'),
      ])
    })

    return isDev ? arbitrumGoerliClient : arbitrumClient;
  }

})

export const useAccountStore = create(
  persist(store, {
    storage: createJSONStorage(() => customStorage),
    name: "omnid-account-store",
    version: 1,
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true)
    }
  })
);
