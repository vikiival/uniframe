import { getClient } from "@kodadot1/uniquery";
import { $purifyOne } from "@kodadot1/minipfs"; // Currently not working
import { Button, Frog, TextInput } from "frog";
import { isValidAddress, kodaUrl } from "../utils";
import { doClaim } from "../services/mint";

export const app = new Frog({
  // Supply a Hub API URL to enable frame verification.
  // hubApiUrl: 'https://api.hub.wevm.dev',
  // browserLocation: 'https://kodadot.xyz',
  // basePath: '/poap',
});

app.frame("/", async (c) => {
  const client = getClient("ahp");
  const query = client.collectionById("107");
  const collection = await client.fetch<any>(query).then((x) =>
    x.data.collection
  );
  console.log("collection", collection);
  const image = $purifyOne(collection.image, "kodadot_beta");
  return c.res({
    title: collection.name,
    image,
    intents: [
      <TextInput placeholder="Enter your Polkadot Address..." />,
      <Button action="/poap/submit" value={`ahp/${collection.id}/denver`}>
        Mint
      </Button>,
      <Button.Link href="https://kodadot.xyz">kodadot</Button.Link>,
      // <Button.Mint target='polkadot:b0a8d493285c2df73290dfb7e61f870f:5hmuyxw9xdgbpptgypokw4thfyoe3ryenebr381z9iaegmfy'>Mint</Button.Mint>, // Currently not working
    ],
  });
});

// Frame to display user's response.
app.frame("/submit", async (c) => {
  const { buttonValue, frameData, inputText } = c;

  if (!inputText || !isValidAddress(inputText) || !buttonValue) {
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
            Supplied address is invalid 😭
          </div>
        </div>
      ),
      intents: [
        <Button.Reset>Try again</Button.Reset>,
        <Button.Link href="https://kodadot.xyz">kodadot</Button.Link>,
      ],
    });
  }

  const [chain, collection, code] = buttonValue.split("/");

  const mint = await doClaim({
    chain,
    collection,
    metadata: "",
    address: inputText,
  }, true);

  console.log("mint", mint);

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
              "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
        >
          Congrats 🥳
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Try again</Button.Reset>,
      <Button.Link href={kodaUrl(chain, collection, mint?.sn)}>🖼️</Button.Link>,
    ],
  });
});

export default app;
