import { http, createConfig } from "wagmi";
import { type Chain } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// RPC URL for local blockchain
export const LOCAL_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";

// Local Ganache configuration
export const ganache = {
  id: 1337,
  name: "Ganache Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [LOCAL_RPC_URL],
    },
  },
  testnet: true,
} as const satisfies Chain;

// Local Hardhat configuration
export const localHardhat = {
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [LOCAL_RPC_URL],
    },
  },
  testnet: true,
} as const satisfies Chain;

// Supported chains - only include unique chains (no duplicates)
export const supportedChains = [ganache, localHardhat] as const;

export const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [ganache.id]: http(LOCAL_RPC_URL),
    [localHardhat.id]: http(LOCAL_RPC_URL),
  },
});

// Helper to add local network to MetaMask
export async function addLocalNetworkToMetaMask(chainId: number = 1337) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const chain = chainId === 1337 ? ganache : localHardhat;

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${chain.id.toString(16)}`,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [LOCAL_RPC_URL],
        },
      ],
    });
  } catch (error) {
    console.error("Failed to add network:", error);
    throw error;
  }
}

// Helper to switch to local network
export async function switchToLocalNetwork(chainId: number = 1337) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // Error code 4902 means chain not added yet
    if (error.code === 4902) {
      await addLocalNetworkToMetaMask(chainId);
    } else {
      throw error;
    }
  }
}

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
