/**
 * Helpers for turning Mux video fields into render-ready props — the video
 * counterpart of `urlForImage.ts`.
 *
 * Layers, lowest to highest level:
 *  - `hasPlayableVideo` — narrow optional videos to "definitely playable"
 *  - `toVideo`          — produce `VideoProps` ready for <MuxVideo>
 *  - `toMediaItems`     — convert mixed image/video arrays (projected via
 *                         `mediaArrayMember` in lib/queries.ts) into a
 *                         discriminated `MediaItem[]` for grids/carousels
 *
 * A video only renders when its Mux asset has finished processing
 * (`status === 'ready'`) — otherwise these helpers return undefined / skip it
 * so callers fall back to the sibling image.
 */

import type { SanityAsset } from '@sanity/image-url/lib/types/types'
import type { MuxVideo, SanityMediaItem } from './types'
import {
  hasAsset,
  toPicture,
  toPictureCropped,
  type PictureProps,
} from './urlForImage'

/** Render-ready props for the <MuxVideo> component. */
export interface VideoProps {
  playbackId: string
  /** CSS aspect-ratio value, e.g. "16 / 9". */
  aspectRatio: string
  /** Poster dimensions — reserve layout space like an image would. */
  width: number
  height: number
  /** Mux thumbnail URL (respects the editor-picked thumbTime). */
  poster: string
  duration?: number
  alt: string
}

/**
 * Type guard: video exists, has finished processing, and has a playback ID.
 *
 * @example
 * const video = hasPlayableVideo(project.cardVideo) ? toVideo(project.cardVideo, 1400) : undefined
 */
export const hasPlayableVideo = (
  v: MuxVideo | null | undefined,
): v is MuxVideo & { playbackId: string } => Boolean(v?.playbackId) && v?.status === 'ready'

/**
 * Convert a projected Mux video (`muxVideoWithMeta`) into render-ready
 * `VideoProps`. Returns undefined unless the asset is ready, so call sites can
 * write `toVideo(x) ?? imageFallback`.
 */
export function toVideo(
  v: MuxVideo | null | undefined,
  posterWidth = 1200,
  alt = '',
): VideoProps | undefined {
  if (!hasPlayableVideo(v)) return undefined
  const [w, h] = (v.aspectRatio ?? '16:9').split(':').map(Number)
  const safeW = w || 16
  const safeH = h || 9
  const time = typeof v.thumbTime === 'number' ? `&time=${v.thumbTime}` : ''
  return {
    playbackId: v.playbackId,
    aspectRatio: `${safeW} / ${safeH}`,
    width: posterWidth,
    height: Math.round((safeH / safeW) * posterWidth),
    poster: `https://image.mux.com/${v.playbackId}/thumbnail.webp?width=${posterWidth}&fit_mode=preserve${time}`,
    duration: v.duration ?? undefined,
    alt,
  }
}

/**
 * Mux thumbnail cropped to an exact `width × height` — the video counterpart
 * of `toPictureCropped` for fixed-aspect grid cells.
 */
export function videoPosterCropped(playbackId: string, width: number, height: number): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?width=${width}&height=${height}&fit_mode=smartcrop`
}

/** Item of a mixed media array, ready to render. */
export type MediaItem = (
  | ({ kind: 'image' } & PictureProps)
  | ({ kind: 'video' } & VideoProps)
) & { colSpan?: number; rowSpan?: number }

/**
 * Convert a mixed image/video array (projected via `mediaArrayMember`) into
 * render-ready `MediaItem[]`. Drops images without assets and videos that are
 * still processing. When `height` is given, both images and video posters are
 * cropped to `width × height` (hotspot/smartcrop aware).
 */
export function toMediaItems(
  arr: SanityMediaItem[] | null | undefined,
  width: number,
  height?: number,
): MediaItem[] {
  const items: MediaItem[] = []
  for (const item of arr ?? []) {
    if (item._type === 'image') {
      if (!hasAsset(item)) continue
      const picture = height
        ? toPictureCropped(item as unknown as SanityAsset & { alt?: string }, width, height)
        : toPicture(item as unknown as SanityAsset & { alt?: string }, width)
      items.push({ kind: 'image', ...picture, colSpan: item.colSpan ?? undefined, rowSpan: item.rowSpan ?? undefined })
    } else {
      const video = toVideo(item.video, width, item.alt ?? '')
      if (!video) continue
      if (height) {
        video.poster = videoPosterCropped(video.playbackId, width, height)
        video.height = height
      }
      items.push({ kind: 'video', ...video, colSpan: item.colSpan ?? undefined, rowSpan: item.rowSpan ?? undefined })
    }
  }
  return items
}
