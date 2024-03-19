import { Button, Frog } from "frog";
import { getCollection, getItem } from "../services/uniquery";
import { kodaUrl } from "../utils";
import { $purifyOne } from "@kodadot1/minipfs";
import { HonoEnv } from "../constants";



type State = {
  count: number;
  max: number;
};

const initialState: State = {
  count: 0,
  max: 100,
};

export const app = new Frog<{ State: State; Env: HonoEnv }>({
  // initialState,
  initialState,
});

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

// app.frame('/:chain/:id', async (c) => {
//   const { chain, id } = c.req.param()
//   return c.res({
//     image:
//       "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*OohqW5DGh9CQS4hLY5FXzA.png",
//     intents: [<Button>Hello World</Button>,
//       <Button>{chain}</Button>,
//       <Button>{id}</Button>
//     ]
//   });
// })

app.frame("/:chain/:id", async (c) => {
  const { chain, id } = c.req.param();
  const collection = await getCollection(chain, id);
  const image = $purifyOne(collection.image, "kodadot_beta");
  const max = collection.max;

  const label = `Browse:${collection.name}[${max}]`;
  return c.res({
    title: collection.name,
    image,
    intents: [<Button action={`/view/${chain}/${id}/1`} value={max}>{label}</Button>],
  });
});

app.frame("/view/:chain/:id/:curr", async (c) => {

  const { chain, id, curr } = c.req.param();
  const { buttonValue } = c

  // There is no max defined
  if (!buttonValue) {
    throw new Error("The collection should have a maximum")
  }
  let max = Number(buttonValue);
  if (isNaN(max) || max === 0) {
    throw new Error("The max must be a number");

  }
  console.log({ chain, id, curr, max })

  //Does not work because it is always initialized to 1 and not the collection maximum
  // const max = 1; // todo DOES NOT WORK

  //This returs null if the :curr is high like say 60
  const item = await getItem(chain, id, curr);

  console.log({item})

  const image = $purifyOne(item.image, "kodadot_beta");

  //getItem function returns null if the random generated is high
  const random = Math.floor(Math.random() * max) + 1
  console.log({random})




  return c.res({
    image: image,
    intents: [

      <Button
        action={`/view/${chain}/${id}/${random}`}
        value={`${max}`}
      > 🎲 </Button>,
      parseInt(curr) > 1 ? (
        <Button

          value={`${max}`}
          action={`/view/${chain}/${id}/${parseInt(curr) - 1}/`}
        >
          {" "}
          ⬅️{" "}
        </Button>
      ) : null,
      <Button
        value={`${max}`}
        action={`/view/${chain}/${id}/${parseInt(curr) + 1}/`}>
        {" "}
        ➡️{" "}
      </Button>,
      <Button.Link href={kodaUrl(chain, id, curr)}>🖼️</Button.Link>,
    ],
  });
});

// app.frame('/', async (c) => {
//   const collection = await getCollection('ahp', '106')
//   const image = $purifyOne(collection.image, 'kodadot_beta')
//   const max = collection.max
//   const label = `Browse:${collection.name}[${max}]`
//   return c.res({
//     title: collection.name,
//     image,
//     intents: [
//       <Button action={`/view`} value={`ahp/${collection.id}/${1}`}>{label}</Button>,
//     ]
//   })
// })

// Frame to display user's response.

// app.frame('/view', async (c) => {
//   const { buttonValue } = c
//   console.log({buttonValue})

//   console.log('buttonValue', buttonValue)
//   if (!buttonValue) {
//     return c.res({
//       image: (
//         <div style={{ color: 'red', display: 'flex', fontSize: 60 }}>
//           No URL supplied
//         </div>
//       ),
//       intents: [
//         <Button.Reset>Try again</Button.Reset>,
//         <Button.Link href="https://kodadot.xyz">kodadot</Button.Link>,
//       ]
//     })
//   }

//   const [chain, collection, id] = buttonValue.split('/')
//   console.log({chain, collection, id})

//   const max = 1 // todo DOES NOT WORK

//   const item = await getItem(chain, collection, id)

//   const image = $purifyOne(item.image, 'kodadot_beta')
//   // const random = Math.floor(Math.random() * max) + 1

//   return c.res({
//     image: image,
//     intents: [
//       // <Button value={`ahp/${collection}/${random}/?max=${max}`}> 🎲 </Button>,
//       parseInt(id) > 1 ? (<Button value={`ahp/${collection}/${parseInt(id) - 1}/?max=${max}`}> ⬅️ </Button>) : null,
//       <Button value={`ahp/${collection}/${parseInt(id) + 1}/?max=${max}`}>  ➡️ </Button>,
//       <Button.Link href={kodaUrl(chain, collection, id)}>🖼️</Button.Link>,
//     ]
//   })
// })

export default app;
