/**
 * Helpers for turning Sanity image fields into render-ready props.
 *
 * Three layers, lowest to highest level:
 *  - `urlForImage` / `imageProps`  — build URLs and dimensions
 *  - `hasAsset`                    — narrow optional images to "definitely has an asset"
 *  - `toPicture` / `toPictures`    — produce `{ src, width, height, alt }` ready for <Picture>
 *
 * In .astro pages, prefer `toPicture` / `toPictures` — they handle missing
 * assets, alt fallbacks, and the type cast in one place.
 */

import { sanityClient } from 'sanity:client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityAsset } from '@sanity/image-url/lib/types/types'

export const imageBuilder = imageUrlBuilder(sanityClient)

/**
 * Get a Sanity image URL builder for chaining (`.width()`, `.fit()`, etc.).
 * Returns the URL via `.url()`. Use this when you only need a URL string.
 *
 * @example
 * urlForImage(page.coverImage).width(1920).url()
 */
export function urlForImage(source: SanityAsset) {
  return imageBuilder.image(source)
}

/**
 * Build a Sanity image URL at a given width and return `{ src, width, height }`
 * so Astro's `<Picture>` doesn't need `inferSize` (which makes a network request).
 *
 * Dimensions are parsed from the asset ID embedded in the URL ({hash}-{W}x{H}).
 */
export function imageProps(
  source: SanityAsset,
  width: number,
  quality = 90,
): { src: string; width: number; height: number } {
  const builder = imageBuilder.image(source).width(width).quality(quality).auto('format')
  const src = builder.url()

  // Extract original dimensions from the Sanity asset URL: `{hash}-{W}x{H}.{ext}`
  const match = src.match(/-(\d+)x(\d+)\.[a-z]+/)
  if (!match) return { src, width, height: width }

  const [origW, origH] = [Number(match[1]), Number(match[2])]
  const w = Math.min(width, origW) // Sanity won't upscale
  const h = Math.round((origH / origW) * w)

  return { src, width: w, height: h }
}

/**
 * Minimal shape of any Sanity image field we hand to these helpers — both
 * raw references (`{ asset: { _ref } }`) and dereferenced ones (`{ asset: { _id, url } }`)
 * fit. Kept loose so both [slug].astro's local types and the shared types in
 * `lib/types.ts` are accepted without extra casts at call sites.
 */
interface ImageLike {
  asset?: unknown
  alt?: string | null
}

/** Render-ready props for Astro's <Picture> or any <img>. */
export interface PictureProps {
  src: string
  width: number
  height: number
  alt: string
}

/**
 * Type guard: returns `true` when the image has an `asset` reference.
 *
 * Use this before calling `toPicture` so TypeScript knows the asset is present
 * and you avoid rendering empty image tags for unset Sanity fields.
 *
 * @example
 * const hero = hasAsset(project.heroImage) ? toPicture(project.heroImage, 2400) : undefined
 */
export const hasAsset = <T extends ImageLike>(
  img: T | null | undefined,
): img is T & { asset: NonNullable<T['asset']> } => Boolean(img?.asset)

/**
 * Convert a single Sanity image field into render-ready `PictureProps`.
 *
 * `alt` falls back to the asset-level alt text via the GROQ projections in
 * `lib/queries.ts` (which coalesce per-use → asset-level → empty string).
 *
 * @example
 * const img = toPicture(block.image, 1600)
 * // <Picture src={img.src} width={img.width} height={img.height} alt={img.alt} />
 */
export function toPicture<T extends ImageLike>(
  img: T,
  width: number,
  quality?: number,
): PictureProps {
  return { ...imageProps(img as unknown as SanityAsset, width, quality), alt: img.alt ?? '' }
}

/**
 * Convert a list of Sanity image fields into render-ready `PictureProps`,
 * dropping any items missing an asset. Returns `[]` for `null`/`undefined`.
 *
 * @example
 * const gallery = toPictures(block.images, 1200)
 * // gallery.map((img) => <Picture {...img} />)
 */
export function toPictures<T extends ImageLike>(
  arr: T[] | null | undefined,
  width: number,
  quality?: number,
): PictureProps[] {
  return (arr ?? []).filter(hasAsset).map((img) => toPicture(img, width, quality))
}
