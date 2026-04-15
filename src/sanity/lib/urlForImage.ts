import imageUrlBuilder from '@sanity/image-url'
import type { SanityAsset } from '@sanity/image-url/lib/types/types'
import { sanityClient } from 'sanity:client'

export const imageBuilder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityAsset) {
  return imageBuilder.image(source)
}

/**
 * Build a Sanity image URL at a given width and return { src, width, height }
 * so Astro's <Picture> doesn't need `inferSize` (which makes a network request).
 *
 * Dimensions are parsed from the asset ID embedded in the URL ({hash}-{W}x{H}).
 */
export function imageProps(
  source: SanityAsset,
  width: number,
  quality = 90,
): { src: string; width: number; height: number } {
  const builder = imageBuilder.image(source).width(width).quality(quality)
  const src = builder.url()

  // Extract original dimensions from the Sanity asset URL: `{hash}-{W}x{H}.{ext}`
  const match = src.match(/-(\d+)x(\d+)\.[a-z]+/)
  if (!match) return { src, width, height: width }

  const [origW, origH] = [Number(match[1]), Number(match[2])]
  const w = Math.min(width, origW) // Sanity won't upscale
  const h = Math.round((origH / origW) * w)

  return { src, width: w, height: h }
}
