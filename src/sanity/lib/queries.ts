// Shared GROQ projections.
//
// Both image projections expose a single `alt` field that falls back from
// the per-use override to the asset-level `altText` declared on
// `sanity.imageAsset` in `schemaTypes/shared/imageAsset.ts`.

// Asset is left as a raw reference. Use this for image fields rendered via
// `@sanity/image-url` (the URL builder accepts the reference shape).
export const imageWithAlt = `{ asset, "alt": coalesce(alt, asset->altText) }`

// Asset is dereferenced inline so `asset.url` is available directly.
// Use this for fields accessed via `urlForImage(...)` or simple <img src>.
export const imageDerefWithAlt = `{
  asset->{ _id, url, altText },
  "alt": coalesce(alt, asset->altText)
}`

// Mux video projection: flattens the mux.videoAsset reference into render-ready
// metadata. `status` must be 'ready' before rendering — `toVideo` in
// `lib/video.ts` enforces this and returns undefined otherwise, so callers
// fall back to the sibling image.
export const muxVideoWithMeta = `{
  "playbackId": asset->playbackId,
  "status": asset->status,
  "aspectRatio": asset->data.aspect_ratio,
  "duration": asset->data.duration,
  "thumbTime": asset->thumbTime
}`

// Member projection for mixed image/video arrays (image + videoItem /
// galleryVideoItem). `colSpan`/`rowSpan` only exist on gallery members and
// project as null elsewhere — harmless. Pair with `toMediaItems` in
// `lib/video.ts`.
export const mediaArrayMember = `{
  _type,
  _key,
  _type == "image" => {
    asset,
    hotspot,
    crop,
    "alt": coalesce(alt, asset->altText),
    colSpan,
    rowSpan
  },
  _type in ["videoItem", "galleryVideoItem"] => {
    alt,
    colSpan,
    rowSpan,
    "video": video ${muxVideoWithMeta}
  }
}`
