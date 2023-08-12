import { OtpConfig } from "@/app/(tabs)/dev/totp";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { MerkleProof } from "@zk-kit/incremental-merkle-tree";
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { WalletClient, createWalletClient, fallback, http, keccak256, toHex } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { arbitrum, arbitrumGoerli } from 'viem/chains';
import { StoreApi, create } from 'zustand';
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

type ProofParams = {
  commitment: string,
  signalHash: string,
  extNullifier: string,
  merkleProof: MerkleProof,
}

export interface AccountStoreType {
  basePrivKey: null | string,
  basePubKey: null | string,
  hasHydrated: boolean,
  zkIdData: null | string[],
  totpAccounts: OtpConfig[],

  setHasHydrated: (state: boolean) => void
  setupBase: () => Promise<void>
  signMessage: (message: string) => Promise<string>;
  getZkId: () => Identity
  getSigner: (isDev: boolean) => WalletClient,
  getSignInParams: () => Promise<ProofParams>,
  getProofParams: (groupId: number, signInSignal: string) => Promise<ProofParams>,
  addTotpAccount: (details: OtpConfig) => void,
  removeTotpAccount: (secretToRemove: string) => void,
}

const store: (set: StoreApi<AccountStoreType>['setState'], get: StoreApi<AccountStoreType>['getState']) => AccountStoreType = (set, get) => ({

  basePrivKey: null,
  basePubKey: null,
  zkIdData: null,
  hasHydrated: false,
  totpAccounts: [],

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

  signMessage: async (message: string): Promise<string> => {
    const wallet = privateKeyToAccount(get().basePrivKey as `0x${string}`)
    return await wallet.signMessage({ message });
  },

  getZkId: () => {
    return new Identity(JSON.stringify(get().zkIdData))
  },

  getSigner: (isDev = false) => {
    const pk = get()?.basePrivKey as `0x${string}`;
    const arbitrumClient = createWalletClient({
      account: privateKeyToAccount(pk),
      chain: arbitrum,
      transport: fallback([
        http('https://arb1.arbitrum.io/rpc'),
        http('https://arbitrum-one.public.blastapi.io'),
        http('https://rpc.ankr.com/arbitrum'),
      ])
    })

    const arbitrumGoerliClient = createWalletClient({
      account: privateKeyToAccount(pk),
      chain: arbitrumGoerli,
      transport: fallback([
        http('https://goerli-rollup.arbitrum.io/rpc'),
        http('https://arb-goerli.g.alchemy.com/v2/demo'),
        http('https://arbitrum-goerli.public.blastapi.io'),
      ])
    })

    return isDev ? arbitrumGoerliClient : arbitrumClient;
  },

  getSignInParams: async () => {
    const zkid: Identity = get().getZkId();
    const wallet = privateKeyToAccount(get()?.basePrivKey as `0x${string}`)

    const signedMessage = await wallet.signMessage({ message: zkid.commitment.toString() });
    const signedMessageHash = keccak256(signedMessage);

    return await get().getProofParams(0, signedMessageHash);
  },

  getProofParams: async (groupId: number, signInSignal: string) => {

    const zkid: Identity = get().getZkId();

    const subgraph = new SemaphoreSubgraph(
      "https://api.studio.thegraph.com/query/1649/groupmanager/version/latest"
    )

    let group: Group;
    let merkleProof: MerkleProof;

    if (groupId === 0) {
      group = new Group(groupId, 20);
      group.addMember(zkid.commitment);
      merkleProof = group.generateMerkleProof(0)
    }
    else {
      const { members } = await subgraph.getGroup(groupId.toString(), { members: true });
      group = new Group(groupId, 20, members);

      const index = group.indexOf(zkid.commitment)
      if (index === -1) {
        throw new Error("The identity is not part of the group")
      }
      merkleProof = group.generateMerkleProof(index)
    }

    const signalHash = keccak256(toHex(signInSignal));
    const extNullifier = BigInt(Math.floor(Math.random() * 1000))

    return {
      extNullifier: extNullifier.toString(),
      signalHash: signalHash as string,
      commitment: zkid.commitment.toString(),
      merkleProof,
    }

  },

  addTotpAccount(details: OtpConfig) {
    const old = get().totpAccounts;
    if (old.filter(e => e.secret === details.secret).length == 0) {
      set({
        totpAccounts: old == null ? [details] : old.concat([details])
      });
    }
  },

  removeTotpAccount(secretToRemove: string) {
    const old = get().totpAccounts;
    set({
      totpAccounts: old.filter(e => e.secret != secretToRemove)
    });
  },

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
