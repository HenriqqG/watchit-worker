export function addJitter(base: number, maxJitterMs: number = 90_000): number {
  return base + Math.floor(Math.random() * maxJitterMs);
}