import { Button, Frog } from "frog";
import { getCollection, getItem } from "../services/uniquery";
import { hashOf, kodaUrl } from "../utils";
import { $purifyOne } from "@kodadot1/minipfs";
import { HonoEnv } from "../constants";
import { doScreenshot } from "../services/capture";

type State = {
  count: number;
};

const initialState: State = {
  count: 0,
};

export const app = new Frog<State, HonoEnv>({
  // initialState,
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

app.frame("/", async (c) => {
  const collection = await getCollection("ahp", "106");
  const image = $purifyOne(collection.image, "kodadot_beta");

  const label = `Generate:${collection.name}`;
  return c.res({
    title: collection.name,
    image,
    intents: [
      <Button action={`/genart/view`}>{label}</Button>,
    ],
  });
});

// Frame to display user's response.
app.frame("/view", async (c) => {
  const uri = 'ipfs://bafybeiadxh5cyyu25lyg5rxvkr3gpkxbs6xuo3ay47nw3tje4p5e7m7ba4'
  const content = $purifyOne(uri, "kodadot_beta");
  const hash = hashOf(Date.now().toString());
  const url = `${content}/?hash=${hash}`
  const image = await doScreenshot(url);
  if (!image) {
    return c.res({
      image: (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            fontSize: 60,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
              backgroundClip: "text",
              "-webkit-background-clip": "text",
              color: "transparent",
            }}
          >
            Unable to generate 😭
          </div>
        </div>
      ),
      intents: [
        <Button.Reset>Try again</Button.Reset>,
      ],
    });
  }

  return c.res({
    image: <img src={image as any} />,
    intents: [
      <Button>Generate</Button>,
      <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

export default app;
