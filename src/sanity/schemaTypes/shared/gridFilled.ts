interface ImageRef {
  asset?: { _ref?: string } | null
}

interface MasonryGridValue {
  images?: ImageRef[]
}

interface SixUpGridValue {
  topWide?: ImageRef
  centerTall?: ImageRef
  topRight?: ImageRef
  bottomLeft?: ImageRef
  bottomMidLeft?: ImageRef
  bottomRight?: ImageRef
}

export const SIX_UP_CELLS = [
  'topWide',
  'centerTall',
  'topRight',
  'bottomLeft',
  'bottomMidLeft',
  'bottomRight',
] as const satisfies readonly (keyof SixUpGridValue)[]

export function isMasonryGridFilled(value: unknown): boolean {
  const v = value as MasonryGridValue | null | undefined
  return Array.isArray(v?.images) && v.images.some((img) => Boolean(img?.asset))
}

export function isSixUpGridFilled(value: unknown): boolean {
  const v = value as SixUpGridValue | null | undefined
  if (!v) return false
  return SIX_UP_CELLS.some((key) => Boolean(v[key]?.asset))
}

export const EXCLUSIVE_GRIDS_MESSAGE =
  'Only one of Masonry Grid or Six-Up Grid can be filled out. Clear the other to use this one.'
