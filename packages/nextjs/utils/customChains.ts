import { defineChain } from "viem";

// TODO: Add Chain details here.
export const monadDevnet = defineChain({
  id: 41454,
  name: "",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      // TODO: Add Monad RPC URL
      http: ["https://devnet1.monad.xyz/rpc/8XQAiNSsPCrIdVttyeFLC6StgvRNTdf"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Devnet Blockscout",
      // TODO: Add Explorer URL
      url: "https://brightstar-884.devnet1.monad.xyz/",
    },
  },
});
