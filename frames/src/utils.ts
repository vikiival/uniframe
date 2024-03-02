import { encodeAddress, isAddress, blake2AsHex } from '@polkadot/util-crypto'

const SS58_PREFIX = 0

export function addressOf(address: string): string {
  if (isAddress(address, undefined, SS58_PREFIX)) {
    return address
  }

  return encodeAddress(address, SS58_PREFIX)
}

export function isValidAddress(address: string): boolean {
  return isAddress(address)
}

export function kodaUrl(chain: string, collection: string, token?: string): string {
  const base = `https://kodadot.xyz/${chain}/`
  const path = token ? `gallery/${collection}-${token}` : `collection/${collection}`
  return base + path
}

export function hashOf(value: string): string {
  return blake2AsHex(value, 256, null, true)
}