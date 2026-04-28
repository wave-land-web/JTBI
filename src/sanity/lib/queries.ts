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
