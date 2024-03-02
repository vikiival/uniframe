type Target = {
  chain: string,
  collection: string,
}

export type MintItem = {
  metadata: string,
  address: string,
}

export type SingleMint = Target & MintItem