import { Button, Frog } from 'frog'
import { getCollection, getItem } from '../services/uniquery'
import { kodaUrl } from '../utils'
import { $purifyOne } from '@kodadot1/minipfs'
import { HonoEnv } from '../constants'

type State = {
  count: number
}

const initialState: State = {
  count: 0
}
 
export const app = new Frog<State, HonoEnv>({
  // initialState,
})
 
// app.frame('/', (c) => {
//   const { buttonValue, deriveState } = c
//   const state = deriveState(previousState => {
//     if (buttonValue === 'inc') previousState.count++
//     if (buttonValue === 'dec') previousState.count--
//   })
//   return c.res({
//     image: (
//       <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
//         Count: {state.count}
//       </div>
//     ),
//     intents: [
//       <Button value="inc">Increment</Button>,
//       <Button value="dec">Decrement</Button>,
//     ]
//   })
// })

app.frame('/', async (c) => {
  const collection = await getCollection('ahp', '106')
  const image = $purifyOne(collection.image, 'kodadot_beta')
  const max = collection.max
  const label = `Browse:${collection.name}[${max}]`
  return c.res({
    title: collection.name,
    image,
    intents: [
      <Button action={`/gallery/view`} value={`ahp/${collection.id}/${1}`}>{label}</Button>,
    ]
  })
})
 
// Frame to display user's response.
app.frame('/view', async (c) => {
  const { buttonValue } = c

  console.log('buttonValue', buttonValue)
  if (!buttonValue) {
    return c.res({
      image: (
        <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
          No URL supplied
        </div>
      ),
      intents: [
        <Button.Reset>Try again</Button.Reset>,
        <Button.Link href="https://kodadot.xyz">kodadot</Button.Link>,
      ]
    })
  }

  const [chain, collection, id] = buttonValue.split('/')

  const max = 1 // todo DOES NOT WORK
  
  const item = await getItem(chain, collection, id)

  const image = $purifyOne(item.image, 'kodadot_beta')
  // const random = Math.floor(Math.random() * max) + 1

  return c.res({
    image: image,
    intents: [
      // <Button value={`ahp/${collection}/${random}/?max=${max}`}> 🎲 </Button>,
      parseInt(id) > 1 ? (<Button value={`ahp/${collection}/${parseInt(id) - 1}/?max=${max}`}> ⬅️ </Button>) : null,
      <Button value={`ahp/${collection}/${parseInt(id) + 1}/?max=${max}`}>  ➡️ </Button>,
      <Button.Link href={kodaUrl(chain, collection, id)}>🖼️</Button.Link>,
    ]
  })
})

export default app
