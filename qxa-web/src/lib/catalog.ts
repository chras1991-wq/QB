import { assets as mockAssets, birthEvents as mockBirthEvents } from "./data";
import type { Asset, BirthEvent, IssuancePolicy } from "./types";

interface ApiAsset {
  asset_id: string;
  symbol: string;
  genesis_txid: string;
  genesis_vout: number;
  xmss_root: number[] | string;
  tree_height: number;
  max_serials: number;
  next_index: number;
  issued: number;
  policy: string;
  status: string;
}

interface ApiBirth {
  asset_id: string;
  serial: number;
  birth_txid: string;
  birth_vout: number;
  block_height: number;
  recipient_script_hex: string;
}

function apiBase(): string | null {
  const url = process.env.NEXT_PUBLIC_QXA_API_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : null;
}

function rootHex(xmss_root: ApiAsset["xmss_root"]): string {
  if (typeof xmss_root === "string") return xmss_root;
  return Buffer.from(xmss_root).toString("hex");
}

function mapPolicy(p: string): IssuancePolicy {
  return p === "block_lottery_v1" ? "block_lottery_v1" : "sequential";
}

function mapAsset(row: ApiAsset): Asset {
  return {
    id: row.asset_id,
    symbol: row.symbol,
    name: row.symbol,
    genesisBlock: 0,
    genesisTxid: row.genesis_txid,
    pqRoot: rootHex(row.xmss_root),
    treeHeight: row.tree_height,
    maxSerials: row.max_serials,
    issued: row.issued,
    nextSerial: row.next_index,
    policy: mapPolicy(row.policy),
    status: row.status === "closed" ? "closed" : "open",
    metadataHash: "0".repeat(64),
  };
}

function mapBirth(row: ApiBirth, symbol: string): BirthEvent {
  return {
    id: `${row.asset_id}:${row.serial}`,
    assetId: row.asset_id,
    symbol,
    serial: row.serial,
    xmssIndex: row.serial,
    block: row.block_height,
    txid: row.birth_txid,
    recipient: row.recipient_script_hex,
    policy: "sequential",
    at: `h${row.block_height}`,
  };
}

export async function loadAssets(): Promise<Asset[]> {
  const base = apiBase();
  if (!base) return mockAssets;
  try {
    const res = await fetch(`${base}/v1/assets`, { next: { revalidate: 5 } });
    if (!res.ok) return mockAssets;
    const rows = (await res.json()) as ApiAsset[];
    if (!Array.isArray(rows) || rows.length === 0) return mockAssets;
    return rows.map(mapAsset);
  } catch {
    return mockAssets;
  }
}

export async function loadBirthEvents(knownAssets?: Asset[]): Promise<BirthEvent[]> {
  const base = apiBase();
  if (!base) return mockBirthEvents;
  const assets = knownAssets ?? (await loadAssets());
  const sym = new Map(assets.map((a) => [a.id, a.symbol]));
  try {
    const res = await fetch(`${base}/v1/births`, { next: { revalidate: 5 } });
    if (!res.ok) return mockBirthEvents;
    const rows = (await res.json()) as ApiBirth[];
    if (!Array.isArray(rows)) return mockBirthEvents;
    return rows
      .map((b) => mapBirth(b, sym.get(b.asset_id) ?? "?"))
      .sort((a, b) => b.block - a.block || b.serial - a.serial);
  } catch {
    return mockBirthEvents;
  }
}

export function usesLiveApi(): boolean {
  return apiBase() !== null;
}
