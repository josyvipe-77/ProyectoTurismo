export function nextRouteStop(
  current: number | null,
  direction: -1 | 1,
  count: number,
): number | null {
  if (!count) return null;
  if (current === null) return direction === 1 ? 0 : count - 1;
  return Math.min(count - 1, Math.max(0, current + direction));
}
