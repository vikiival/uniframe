import { ApiPromise, HttpProvider, Keyring } from 'polkadot/api/mod.ts'
import type { SubmittableExtrinsic } from "polkadot/api/types/index.ts"
import { hexToU8a } from 'polkadot/util/mod.ts'

const keyring = new Keyring({ ss58Format: 2 })

const AHK_URL = 'https://kusama-asset-hub-rpc.polkadot.io'
const AHP_URL = 'https://polkadot-asset-hub-rpc.polkadot.io'
const AHR_URL = 'https://rococo-asset-hub-rpc.polkadot.io'

export type Call = SubmittableExtrinsic<'promise'>
type TxResult = Promise<string>

const CHAINS = {
  ahk: AHK_URL,
  ahp: AHP_URL,
  ahr: AHR_URL,
}

export const magicApi = (chain?: string) => {
  const usableChain = chain || 'ahk'
  const BASE_URL = CHAINS[usableChain as keyof typeof CHAINS]
  const provider = new HttpProvider(BASE_URL)
  return ApiPromise.create({ provider })
}

export const me = () => {
  return buildAccount().address
}

const buildAccount = () => {
    const seed = Deno.env.get('KEYRING_SEED')!
    const pair = keyring.addFromSeed(hexToU8a(seed))
    return pair
}


export function buildMintTo(api: ApiPromise, collectionId: string, nextId: string, metadata: string, to: string): Call[] {
  const address = to
  const create = api.tx.nfts.mint(collectionId, nextId, address, undefined)
  const set = api.tx.nfts.setMetadata(collectionId, nextId, metadata)
  // const batch = api.tx.utility.batchAll([create, set])
  return [create, set]
}

export async function fetchLastUsedIndex(api: ApiPromise, collectionId: string): Promise<string> {
  const res = await api.query.nfts.collection(collectionId)
  const data = res.toJSON()
  return data.items.toString()

}

const buildBatch = (api: ApiPromise, calls: Call[]) => {
  const batch = api.tx.utility.batch(calls)
  return batch
}

export const submit = async (api: ApiPromise, calls: Call[] | Call): TxResult => {
  const batch = Array.isArray(calls) ? buildBatch(api, calls) : calls
  const account = buildAccount()
  const tx = await batch.signAndSend(account)
  return tx.toHex()
}
