/**
 * Clamps `value` to the inclusive range `[min, max]`.
 */
export function clamp(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}
