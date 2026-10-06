export function truncateMiddle(value: string, head = 8, tail = 8): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function formatPercent(part: number, total: number): string {
  if (total === 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function policyLabel(policy: string): string {
  switch (policy) {
    case "block_lottery_v1":
      return "Bitcoin Block Lottery";
    case "sequential":
      return "Sequential Issuer";
    default:
      return policy;
  }
}
