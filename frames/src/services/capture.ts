import { $fetch, FetchError } from 'ofetch'
// import { pinFile } from './nftStorage'

const BASE_URL = 'https://capture.kodadot.art'

const api = $fetch.create({
  baseURL: BASE_URL,
})

//  new File([JSON.stringify({'from': 'incognito'}, null, 2)], 'metadata.json', { type: 'application/json' })
// new File  new File(['<DATA>'], 'README.md', { type: 'text/plain' })

export const doScreenshot = async (url: string): Promise<ArrayBuffer | null> => {

  try {
    const res = await fetch(`${BASE_URL}/screenshot`, {
      method: 'POST',
      body: JSON.stringify({
        // url: 'https://nftstorage.link/ipfs/bafybeibc4bhdksstboetdg7q7dzzbxl6ynqmhjdifukm3hxirqvebxefea/?hash=0x485978453152395357446f70556b4a50484a4a526966526f4e4d474a375a38465078347932695351577834785a4b38'
        url,
      })})

    if (!res.ok) {
      return null
    }

    const buffer = await res.arrayBuffer()

    return buffer
    // const file =  new File([buffer], 'image.png', { type: 'image/png' })
    
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(error.response)
    }
  }

  return null
}
