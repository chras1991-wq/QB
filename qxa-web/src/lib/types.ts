export type IssuancePolicy = "sequential" | "block_lottery_v1";

export type AssetStatus = "open" | "closed";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  genesisBlock: number;
  genesisTxid: string;
  pqRoot: string;
  treeHeight: number;
  maxSerials: number;
  issued: number;
  nextSerial: number;
  policy: IssuancePolicy;
  status: AssetStatus;
  metadataHash: string;
}

export interface Unit {
  assetId: string;
  symbol: string;
  serial: number;
  xmssIndex: number;
  birthBlock: number;
  birthTxid: string;
  pqVerified: boolean;
  owner: string;
  tags: string[];
}

export interface BirthEvent {
  id: string;
  assetId: string;
  symbol: string;
  serial: number;
  xmssIndex: number;
  block: number;
  txid: string;
  recipient: string;
  policy: IssuancePolicy;
  at: string;
}

export interface SerialRange {
  assetId: string;
  symbol: string;
  start: number;
  end: number;
}

export interface WalletPreview {
  displayBalance: string;
  ranges: SerialRange[];
  singles: { symbol: string; serial: number; assetId: string }[];
}

export interface LaunchRound {
  assetId: string;
  symbol: string;
  anchorBlock: number;
  revealBlock: number;
  blockHashPreview: string;
  serialStart: number;
  serialEnd: number;
  batchSize: number;
  participants: number;
  status: "open" | "pending" | "settled";
  leaderboard: { rank: number; score: string; claimant: string; serial: number }[];
}
