import { OtpConfig } from "@/app/(tabs)/dev/totp";
import { Omnid } from '@omnid/sdk';
import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { LeanIMTMerkleProof } from "@zk-kit/imt";
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { WalletClient, createWalletClient, fallback, http, keccak256, toHex } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { optimismSepolia } from 'viem/chains';
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
  merkleProof: LeanIMTMerkleProof<string>,
}

export interface AccountStoreType {
  basePrivKey: null | string,
  basePubKey: null | string,
  hasHydrated: boolean,
  zkIdData: null | string,
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
      zkIdData: `0x${identity.privateKey.toString(16)}`
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
    // const arbitrumClient = createWalletClient({
    //   account: privateKeyToAccount(pk),
    //   chain: arbitrum,
    //   transport: fallback([
    //     http('https://arb1.arbitrum.io/rpc'),
    //     http('https://arbitrum-one.public.blastapi.io'),
    //     http('https://rpc.ankr.com/arbitrum'),
    //   ])
    // })

    const optimismSepoliaClient = createWalletClient({
      account: privateKeyToAccount(pk),
      chain: optimismSepolia,
      transport: fallback([
        http('https://sepolia.optimism.io'),
        http('https://rpc.ankr.com/optimism_sepolia'),
        http('https://optimism-sepolia.blastapi.io/ed3d6bab-623e-4371-b5d2-a38d608e8050'),
      ])
    })

    return isDev ? optimismSepoliaClient : optimismSepoliaClient;
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

    const omnid = new Omnid();


    let group: Group;
    let merkleProof: LeanIMTMerkleProof<string>;

    if (groupId === 0) {
      group = new Group([zkid.commitment]);
      merkleProof = group.generateMerkleProof(0)
    }
    else {
      const groupData = await omnid.query.getGroup(groupId.toString(), { members: true });
      if (groupData.members) {
        group = new Group(groupData.members.map(e => e.id));

        const index = group.indexOf(zkid.commitment)
        if (index === -1) {
          throw new Error("The identity is not part of the group")
        }
        merkleProof = group.generateMerkleProof(index)

      }
      else {
        throw new Error("No members from API")
      }
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
