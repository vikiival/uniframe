
import { Hono, type Context } from 'hono/mod.ts'
import { buildMintTo, fetchLastUsedIndex, magicApi, submit } from './mint'
import { SingleMint } from './types'

const app = new Hono()

app.get('/', (c: Context) => c.redirect('https://github.com/vikiival/uniframe'))

app.post('/do', async (c: Context) => {
  const body = await c.req.json<SingleMint>()
  if (!body.chain) {
    return c.text('chain is required', 400)
  }

  const api = await magicApi(body.chain)

  const sn = await fetchLastUsedIndex(api, body.collection)

  const mint = buildMintTo(api, body.collection, sn, body.metadata, body.address)

  const txHash = await submit(api, mint)


  return c.json({
    sn: sn,
    collection: body.collection,
    chain: body.chain,
    txHash,
  })
})

const PORT = 8080
Deno.serve({ port: PORT }, app.fetch)
