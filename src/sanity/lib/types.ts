import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
  alt?: string
}

/**
 * A Mux video projected via `muxVideoWithMeta` (lib/queries.ts).
 * Only render when `status === 'ready'` — use `hasPlayableVideo`/`toVideo`
 * from `lib/video.ts`, which fall back to undefined otherwise.
 */
export interface MuxVideo {
  playbackId?: string | null
  status?: string | null
  /** Mux-reported ratio, e.g. "16:9". */
  aspectRatio?: string | null
  duration?: number | null
  thumbTime?: number | null
}

/** Array member projected via `mediaArrayMember` (image or video wrapper). */
export interface SanityMediaItem {
  _type: 'image' | 'videoItem' | 'galleryVideoItem'
  _key: string
  // image members
  asset?: { _type: 'reference'; _ref: string }
  hotspot?: unknown
  crop?: unknown
  alt?: string | null
  // video members
  video?: MuxVideo | null
  // gallery members
  colSpan?: number | null
  rowSpan?: number | null
}

export interface BlockBase {
  _key: string
  sectionId?: string
}

export interface HeroBlock extends BlockBase {
  _type: 'heroBlock'
  hidden?: boolean
  backgroundImage?: SanityImage
  backgroundVideo?: MuxVideo
  carouselImages?: SanityMediaItem[]
  headline1?: string
  headline1Color?: 'light' | 'dark'
  headline2?: string
  headline2Color?: 'light' | 'dark'
}

export interface ProjectsBlock extends BlockBase {
  _type: 'projectsBlock'
  hidden?: boolean
  heading?: string
  projects?: {
    _id: string
    title: string
    slug?: { current: string }
    description: string
    featureText: PortableTextBlock[]
    cardImage?: SanityImage
    cardVideo?: MuxVideo
    ctaLabel?: string
    reversed?: boolean
    styling?: { accentColor?: string; cardBackgroundColor?: string; cardTextColor?: string }
  }[]
}

export interface MediaCardRowBlock extends BlockBase {
  _type: 'mediaCardRowBlock'
  hidden?: boolean
  heading?: string
  featureText?: PortableTextBlock[]
  title?: string
  description?: string
  image?: SanityImage
  video?: MuxVideo
  href?: string
  ctaLabel?: string
  reversed?: boolean
  styling?: { accentColor?: string; cardBackgroundColor?: string; cardTextColor?: string }
}

export interface SnapshotsBlock extends BlockBase {
  _type: 'snapshotsBlock'
  hidden?: boolean
  heading?: string
  items?: {
    _id: string
    title: string
    description: string
    image?: SanityImage
    video?: MuxVideo
    href?: string
    ctaLabel?: string
    styling?: {
      accentColor?: string
      mediaBackgroundColor?: string
      cardBackgroundColor?: string
      cardTextColor?: string
      titleColor?: string
    }
  }[]
}

export interface ContactBlock extends BlockBase {
  _type: 'contactBlock'
  hidden?: boolean
  heading?: string
  subheading?: string
  subheadingAccent?: string
  body?: string
}

export type PageBlock =
  | HeroBlock
  | ProjectsBlock
  | MediaCardRowBlock
  | SnapshotsBlock
  | ContactBlock
