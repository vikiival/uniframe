import { Context } from "hono";
import { FetchError } from "ofetch";
import { HonoEnv } from "../constants";
import { addressOf } from "../utils";

const BASE_URL = "http://localhost:8080";

// {
//   "sn": "151",
//   "collection": "107",
//   "chain": "ahp",
//   "txHash": "0xa478d67d088573c8c81d9cdb8531d5c790f4f001539aa89d62ae7038feb0536b"
// }
type PoapClaimResponse = {
  sn: string;
  collection: string;
  chain: string;
  txHash: string;
};

type Target = {
  chain: string,
  collection: string,
}

export type MintItem = {
  metadata: string,
  address: string,
}

export type SingleMint = Target & MintItem

export const doClaim = async <T extends string>(
  mint: SingleMint,
  dry = true,
) => {
  if (dry) {
    return {
      "sn": "151",
      "collection": "107",
      "chain": "ahp",
      "txHash":
        "0xa478d67d088573c8c81d9cdb8531d5c790f4f001539aa89d62ae7038feb0536b",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/do`, {
      method: "POST",
      body: JSON.stringify(mint),
    });

    if (!res.ok) {
      return null;
    }

    const value: PoapClaimResponse = await res.json();
    return value;
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(error.response);
    }
  }

  return null;
};