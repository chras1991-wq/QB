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
  birthBlock: number;
  birthTxid: string;
  pqVerified: boolean;
  owner: string;
  tags: string[];
}

export interface LaunchRound {
  assetId: string;
  symbol: string;
  anchorBlock: number;
  serialStart: number;
  serialEnd: number;
  participants: number;
  status: "open" | "pending" | "settled";
}
