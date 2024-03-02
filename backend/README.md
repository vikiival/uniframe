## NFT minter

your happy serverless minter
It uses DENO.

### DEV

You need to create a `.env` file with the following content:

```bash
KEYRING_SEED=your_seed
```

Then you can start the server with:

```bash
deno task start
```

### API

```bash
POST /do
```

```json
{
  "chain": "ahp",
  "collection": "100",
  "metadata": "ipfs://",
  "address": "Fksma..."
}
```

it automatically fetches the the nft id to be used.