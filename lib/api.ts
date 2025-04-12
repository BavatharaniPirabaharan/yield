// DeFiLlama API service

export interface YieldPool {
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apyBase: number
  apyReward: number
  apy: number
  rewardTokens: string[]
  pool: string
  apyPct1D: number
  apyPct7D: number
  apyPct30D: number
  stablecoin: boolean
  ilRisk: string
  exposure: string
  predictions: {
    predictedClass: string
    predictedProbability: number
    binnedConfidence: number
  }
  poolMeta: string | null
  mu: number
  sigma: number
  count: number
  outlier: boolean
  underlyingTokens: string[]
  il7d: number
  apyBase7d: number
  apyMean30d: number
  volumeUsd1d: number
  volumeUsd7d: number
  apyBaseInception: number
}

export interface YieldData {
  status: string
  data: YieldPool[]
}

export interface ChainInfo {
  id: string
  name: string
  logoURI?: string
  color: string
}

export const chains: Record<string, ChainInfo> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    color: "bg-blue-500",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
    color: "bg-blue-700",
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
    color: "bg-red-500",
  },
  base: {
    id: "base",
    name: "Base",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
    color: "bg-blue-400",
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    color: "bg-purple-500",
  },
  avalanche: {
    id: "avax",
    name: "Avalanche",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanche/info/logo.png",
    color: "bg-orange-500",
  },
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
    color: "bg-yellow-500",
  },
  fantom: {
    id: "fantom",
    name: "Fantom",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png",
    color: "bg-blue-800",
  },
  metis: {
    id: "metis",
    name: "Metis",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/metis/info/logo.png",
    color: "bg-teal-600",
  },
  celo: {
    id: "celo",
    name: "Celo",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png",
    color: "bg-green-500",
  },
  solana: {
    id: "solana",
    name: "Solana",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
    color: "bg-purple-600",
  },
  zksync: {
    id: "zksync",
    name: "zkSync",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zksync/info/logo.png",
    color: "bg-blue-600",
  },
  linea: {
    id: "linea",
    name: "Linea",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png",
    color: "bg-gray-600",
  },
  mantle: {
    id: "mantle",
    name: "Mantle",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png",
    color: "bg-gray-700",
  },
  scroll: {
    id: "scroll",
    name: "Scroll",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png",
    color: "bg-gray-800",
  },
  mode: {
    id: "mode",
    name: "Mode",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mode/info/logo.png",
    color: "bg-indigo-600",
  },
  blast: {
    id: "blast",
    name: "Blast",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/blast/info/logo.png",
    color: "bg-yellow-600",
  },
  manta: {
    id: "manta",
    name: "Manta",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/manta/info/logo.png",
    color: "bg-blue-500",
  },
  zkevm: {
    id: "zkevm",
    name: "zkEVM",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zkevm/info/logo.png",
    color: "bg-purple-700",
  },
  opbnb: {
    id: "opbnb",
    name: "opBNB",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/opbnb/info/logo.png",
    color: "bg-yellow-400",
  },
  kava: {
    id: "kava",
    name: "Kava",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kava/info/logo.png",
    color: "bg-orange-500",
  },
  klaytn: {
    id: "klaytn",
    name: "Klaytn",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/klaytn/info/logo.png",
    color: "bg-purple-800",
  },
  cronos: {
    id: "cronos",
    name: "Cronos",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cronos/info/logo.png",
    color: "bg-indigo-500",
  },
  moonbeam: {
    id: "moonbeam",
    name: "Moonbeam",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonbeam/info/logo.png",
    color: "bg-pink-500",
  },
  moonriver: {
    id: "moonriver",
    name: "Moonriver",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonriver/info/logo.png",
    color: "bg-pink-600",
  },
  harmony: {
    id: "harmony",
    name: "Harmony",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/harmony/info/logo.png",
    color: "bg-green-600",
  },
  aurora: {
    id: "aurora",
    name: "Aurora",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/info/logo.png",
    color: "bg-blue-300",
  },
  astar: {
    id: "astar",
    name: "Astar",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/astar/info/logo.png",
    color: "bg-purple-400",
  },
  acala: {
    id: "acala",
    name: "Acala",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/acala/info/logo.png",
    color: "bg-blue-200",
  },
  karura: {
    id: "karura",
    name: "Karura",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/karura/info/logo.png",
    color: "bg-red-400",
  },
  heco: {
    id: "heco",
    name: "HECO",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/heco/info/logo.png",
    color: "bg-green-400",
  },
  okexchain: {
    id: "okexchain",
    name: "OKX Chain",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/okexchain/info/logo.png",
    color: "bg-blue-600",
  },
  iotex: {
    id: "iotex",
    name: "IoTeX",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/iotex/info/logo.png",
    color: "bg-gray-500",
  },
  rsk: {
    id: "rsk",
    name: "RSK",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/rsk/info/logo.png",
    color: "bg-orange-600",
  },
  smartbch: {
    id: "smartbch",
    name: "SmartBCH",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartbch/info/logo.png",
    color: "bg-green-700",
  },
  oasis: {
    id: "oasis",
    name: "Oasis",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/oasis/info/logo.png",
    color: "bg-teal-500",
  },
  velas: {
    id: "velas",
    name: "Velas",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/velas/info/logo.png",
    color: "bg-red-700",
  },
  wanchain: {
    id: "wanchain",
    name: "Wanchain",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/wanchain/info/logo.png",
    color: "bg-blue-800",
  },
  waves: {
    id: "waves",
    name: "Waves",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/waves/info/logo.png",
    color: "bg-blue-900",
  },
  theta: {
    id: "theta",
    name: "Theta",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/theta/info/logo.png",
    color: "bg-indigo-700",
  },
  algorand: {
    id: "algorand",
    name: "Algorand",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/algorand/info/logo.png",
    color: "bg-black",
  },
  osmosis: {
    id: "osmosis",
    name: "Osmosis",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png",
    color: "bg-purple-900",
  },
  secret: {
    id: "secret",
    name: "Secret",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/secret/info/logo.png",
    color: "bg-gray-800",
  },
  thorchain: {
    id: "thorchain",
    name: "THORChain",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/thorchain/info/logo.png",
    color: "bg-red-800",
  },
  kujira: {
    id: "kujira",
    name: "Kujira",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kujira/info/logo.png",
    color: "bg-blue-700",
  },
  injective: {
    id: "injective",
    name: "Injective",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/injective/info/logo.png",
    color: "bg-blue-600",
  },
  juno: {
    id: "juno",
    name: "Juno",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/juno/info/logo.png",
    color: "bg-purple-600",
  },
  stargaze: {
    id: "stargaze",
    name: "Stargaze",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stargaze/info/logo.png",
    color: "bg-indigo-800",
  },
  chihuahua: {
    id: "chihuahua",
    name: "Chihuahua",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/chihuahua/info/logo.png",
    color: "bg-yellow-700",
  },
  comdex: {
    id: "comdex",
    name: "Comdex",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/comdex/info/logo.png",
    color: "bg-blue-500",
  },
  crescent: {
    id: "crescent",
    name: "Crescent",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/crescent/info/logo.png",
    color: "bg-indigo-500",
  },
  persistence: {
    id: "persistence",
    name: "Persistence",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/persistence/info/logo.png",
    color: "bg-purple-500",
  },
  quicksilver: {
    id: "quicksilver",
    name: "Quicksilver",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/quicksilver/info/logo.png",
    color: "bg-blue-400",
  },
  stride: {
    id: "stride",
    name: "Stride",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stride/info/logo.png",
    color: "bg-green-500",
  },
  terra: {
    id: "terra",
    name: "Terra",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/terra/info/logo.png",
    color: "bg-purple-700",
  },
  terraclassic: {
    id: "terraclassic",
    name: "Terra Classic",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/terraclassic/info/logo.png",
    color: "bg-purple-800",
  },
  evmos: {
    id: "evmos",
    name: "Evmos",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/evmos/info/logo.png",
    color: "bg-purple-600",
  },
  agoric: {
    id: "agoric",
    name: "Agoric",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/agoric/info/logo.png",
    color: "bg-blue-600",
  },
  assetmantle: {
    id: "assetmantle",
    name: "AssetMantle",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/assetmantle/info/logo.png",
    color: "bg-indigo-600",
  },
  axelar: {
    id: "axelar",
    name: "Axelar",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/axelar/info/logo.png",
    color: "bg-red-500",
  },
  band: {
    id: "band",
    name: "Band",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/band/info/logo.png",
    color: "bg-blue-500",
  },
  bitsong: {
    id: "bitsong",
    name: "BitSong",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitsong/info/logo.png",
    color: "bg-purple-500",
  },
  carbon: {
    id: "carbon",
    name: "Carbon",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/carbon/info/logo.png",
    color: "bg-green-600",
  },
  cheqd: {
    id: "cheqd",
    name: "Cheqd",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cheqd/info/logo.png",
    color: "bg-blue-700",
  },
  cosmos: {
    id: "cosmos",
    name: "Cosmos",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png",
    color: "bg-blue-600",
  },
  cryptoorg: {
    id: "cryptoorg",
    name: "Crypto.org",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cryptoorg/info/logo.png",
    color: "bg-purple-600",
  },
  emoney: {
    id: "emoney",
    name: "e-Money",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/emoney/info/logo.png",
    color: "bg-blue-500",
  },
  fetchai: {
    id: "fetchai",
    name: "Fetch.ai",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fetchai/info/logo.png",
    color: "bg-blue-600",
  },
  gravitybridge: {
    id: "gravitybridge",
    name: "Gravity Bridge",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/gravitybridge/info/logo.png",
    color: "bg-gray-700",
  },
  irisnet: {
    id: "irisnet",
    name: "IRISnet",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/irisnet/info/logo.png",
    color: "bg-purple-500",
  },
  likecoin: {
    id: "likecoin",
    name: "LikeCoin",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/likecoin/info/logo.png",
    color: "bg-blue-500",
  },
  sentinel: {
    id: "sentinel",
    name: "Sentinel",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/sentinel/info/logo.png",
    color: "bg-blue-600",
  },
  sifchain: {
    id: "sifchain",
    name: "Sifchain",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/sifchain/info/logo.png",
    color: "bg-purple-500",
  },
  umee: {
    id: "umee",
    name: "Umee",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/umee/info/logo.png",
    color: "bg-purple-600",
  },
  vidulum: {
    id: "vidulum",
    name: "Vidulum",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/vidulum/info/logo.png",
    color: "bg-blue-500",
  },
  xpla: {
    id: "xpla",
    name: "XPLA",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xpla/info/logo.png",
    color: "bg-blue-600",
  },
  zilliqa: {
    id: "zilliqa",
    name: "Zilliqa",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zilliqa/info/logo.png",
    color: "bg-blue-500",
  },
  berachain: {
    id: "berachain",
    name: "Berachain",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/berachain/info/logo.png",
    color: "bg-green-500",
  },
  telos: {
    id: "telos",
    name: "Telos",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/telos/info/logo.png",
    color: "bg-blue-500",
  },
}

export async function fetchYieldData(): Promise<YieldPool[]> {
  try {
    // Call our server-side API route instead of directly calling the DeFiLlama API
    const response = await fetch("/api/yield-data")

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching yield data:", error)
    throw error
  }
}

export function formatAPY(apy: number | null | undefined): string {
  if (apy === null || apy === undefined) {
    return "N/A"
  }
  return `${apy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%`
}

export function formatTVL(tvl: number | null | undefined): string {
  if (tvl === null || tvl === undefined) {
    return "N/A"
  }

  // Format as a number with commas for thousands separators
  return `$${tvl.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`
}

export function getChainInfo(chainId: string): ChainInfo {
  return (
    chains[chainId.toLowerCase()] || {
      id: chainId,
      name: chainId.charAt(0).toUpperCase() + chainId.slice(1),
      logoURI: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainId.toLowerCase()}/info/logo.png`,
      color: "bg-gray-500",
    }
  )
}
