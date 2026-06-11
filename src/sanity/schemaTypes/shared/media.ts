import { defineField } from 'sanity'

export const VIDEO_FIELD_DESCRIPTION =
  'Optional video. When set and finished processing, it plays instead of the image. ' +
  'Keep the image filled in as a fallback/poster.'

/**
 * Sibling `mux.video` field for an existing image field.
 *
 * Pattern: every image field keeps its data exactly where it is; an optional
 * video field is added next to it. The frontend renders the video when it is
 * set AND its Mux asset has finished processing — otherwise it falls back to
 * the image. Presence of the video is the toggle (no mediaType radio),
 * matching the heroBlock backgroundImage/carouselImages precedence convention.
 */
export const videoField = (name: string, title: string, description = VIDEO_FIELD_DESCRIPTION) =>
  defineField({ name, title, description, type: 'mux.video' })

/**
 * Factory for an image + video cell pair (used by sixUpGrid).
 * Returns `[imageField, videoField]` to spread into a `fields` array.
 */
export const mediaCellFields = (
  name: string,
  title: string,
  description: string,
  options: { hotspot?: boolean } = { hotspot: true },
) => [
  defineField({
    name,
    title,
    description,
    type: 'image',
    options,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
      }),
    ],
  }),
  videoField(`${name}Video`, `${title} — Video`),
]
