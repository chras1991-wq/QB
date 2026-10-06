import type { Asset, LaunchRound, Unit } from "./types";

export const assets: Asset[] = [
  {
    id: "a7f3c2e8910d4b5a6c7d8e9f00112233445566778899aabbccddeeff",
    symbol: "QX",
    name: "QX Genesis",
    genesisBlock: 872_441,
    genesisTxid: "4f8b2c1d9e0a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3",
    pqRoot: "87af3b2c1d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f70819",
    treeHeight: 12,
    maxSerials: 4096,
    issued: 2304,
    nextSerial: 2304,
    policy: "block_lottery_v1",
    status: "open",
    metadataHash: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "b81234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    symbol: "VIRGIN",
    name: "Virgin Root #3",
    genesisBlock: 871_902,
    genesisTxid: "1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091",
    pqRoot: "12ab34cd56ef7890ab12cd34ef567890ab12cd34ef567890ab12cd34ef5678",
    treeHeight: 10,
    maxSerials: 1024,
    issued: 0,
    nextSerial: 0,
    policy: "sequential",
    status: "open",
    metadataHash: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  },
  {
    id: "c901234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
    symbol: "FIN",
    name: "Final Serial Demo",
    genesisBlock: 860_100,
    genesisTxid: "9f8e7d6c5b4a3928172635483928172635483928172635483928172635483928",
    pqRoot: "aa11bb22cc33dd44ee55ff6600112233445566778899aabbccddeeff001122",
    treeHeight: 10,
    maxSerials: 1024,
    issued: 1014,
    nextSerial: 1014,
    policy: "block_lottery_v1",
    status: "open",
    metadataHash: "1111111111111111111111111111111111111111111111111111111111111111",
  },
];

export const units: Unit[] = [
  {
    assetId: assets[0].id,
    symbol: "QX",
    serial: 0,
    birthBlock: 872_512,
    birthTxid: "0000000000000000000000000000000000000000000000000000000000000a01",
    pqVerified: true,
    owner: "bc1p5xy2x3q8v4m9k2n7w1r6t4y8u3i0o9p2a5s8d1f4g7h0j3k6l9z2x5c8v1m4",
    tags: ["first-unit", "genesis-serial"],
  },
  {
    assetId: assets[0].id,
    symbol: "QX",
    serial: 481,
    birthBlock: 875_201,
    birthTxid: "0000000000000000000000000000000000000000000000000000000000000b21",
    pqVerified: true,
    owner: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    tags: [],
  },
  {
    assetId: assets[2].id,
    symbol: "FIN",
    serial: 1023,
    birthBlock: 861_440,
    birthTxid: "0000000000000000000000000000000000000000000000000000000000000f01",
    pqVerified: true,
    owner: "bc1p0l5xy2x3q8v4m9k2n7w1r6t4y8u3i0o9p2a5s8d1f4g7h0j3k6l9z2x5c8v1",
    tags: ["final-serial"],
  },
];

export const launchRounds: LaunchRound[] = [
  {
    assetId: assets[0].id,
    symbol: "QX",
    anchorBlock: 1_042_881,
    serialStart: 2304,
    serialEnd: 2559,
    participants: 18421,
    status: "open",
  },
];

export function getAsset(id: string): Asset | undefined {
  return assets.find((a) => a.id === id);
}

export function getUnitsForAsset(assetId: string): Unit[] {
  return units.filter((u) => u.assetId === assetId);
}

export function getUnit(assetId: string, serial: number): Unit | undefined {
  return units.find((u) => u.assetId === assetId && u.serial === serial);
}
