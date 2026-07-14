interface AssetRef {
  asset?: { _ref?: string } | null
}

/** Masonry array item: an image (`asset`) or a videoItem wrapper (`video.asset`). */
interface MediaItemRef extends AssetRef {
  video?: AssetRef | null
}

interface SixUpGridValue {
  topWide?: AssetRef
  centerTall?: AssetRef
  topRight?: AssetRef
  bottomLeft?: AssetRef
  bottomMidLeft?: AssetRef
  bottomRight?: AssetRef
  /** Sibling video cells (`<cell>Video`) added by mediaCellFields. */
  [key: string]: AssetRef | undefined
}

interface MasonryGridValue {
  images?: MediaItemRef[]
}

export const SIX_UP_CELLS = [
  'topWide',
  'centerTall',
  'topRight',
  'bottomLeft',
  'bottomMidLeft',
  'bottomRight',
] as const

/** Key of the sibling mux.video field for a six-up cell. */
export const sixUpVideoKey = (cell: (typeof SIX_UP_CELLS)[number]) => `${cell}Video` as const

/** Key of the sibling video-description field for a six-up cell. */
export const sixUpVideoAltKey = (cell: (typeof SIX_UP_CELLS)[number]) => `${cell}VideoAlt` as const

export function isMasonryGridFilled(value: unknown): boolean {
  const v = value as MasonryGridValue | null | undefined
  return (
    Array.isArray(v?.images) && v.images.some((item) => Boolean(item?.asset || item?.video?.asset))
  )
}

export function isSixUpGridFilled(value: unknown): boolean {
  const v = value as SixUpGridValue | null | undefined
  if (!v) return false
  return SIX_UP_CELLS.some((key) => Boolean(v[key]?.asset || v[sixUpVideoKey(key)]?.asset))
}

export const EXCLUSIVE_GRIDS_MESSAGE =
  'Only one of Masonry Grid or Six-Up Grid can be filled out. Clear the other to use this one.'
