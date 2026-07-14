import { PlayIcon } from '@sanity/icons'
import { createElement } from 'react'
import { defineField, defineType } from 'sanity'
import { colSpanField, rowSpanField } from './gallerySpans'

/**
 * Wrapper object types for Mux videos inside mixed image/video arrays.
 *
 * `mux.video` is a named plugin type, so per-use fields (alt, spans) can't be
 * attached to it inline — these wrappers carry them instead. Existing `image`
 * array members are untouched, so existing content needs no migration.
 *
 * - `videoItem`        → masonryGrid.images, heroBlock.carouselImages
 * - `galleryVideoItem` → imageGalleryBlock.images (adds colSpan/rowSpan)
 */

const videoFields = [
  defineField({
    name: 'video',
    title: 'Video',
    type: 'mux.video',
    validation: (Rule) => Rule.required().error('Choose or upload a video.'),
  }),
  defineField({
    name: 'alt',
    title: 'Description',
    type: 'string',
    description: 'Short description of the video for screen readers.',
    validation: (Rule) => Rule.required().error('A description is required for accessibility'),
  }),
]

interface VideoPreviewProps {
  alt?: string
  playbackId?: string
  status?: string
  filename?: string
  colSpan?: number
  rowSpan?: number
}

const videoPreviewSelect = {
  alt: 'alt',
  playbackId: 'video.asset.playbackId',
  status: 'video.asset.status',
  filename: 'video.asset.filename',
}

function prepareVideoPreview({ alt, playbackId, status, filename }: VideoPreviewProps) {
  return {
    title: alt || filename || 'Video',
    subtitle: status === 'ready' ? 'Video' : `Video · ${status ?? 'processing'}`,
    media: playbackId
      ? createElement('img', {
          src: `https://image.mux.com/${playbackId}/thumbnail.webp?width=160&fit_mode=smartcrop`,
          style: { objectFit: 'cover', width: '100%', height: '100%' },
        })
      : PlayIcon,
  }
}

export const videoItem = defineType({
  name: 'videoItem',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: videoFields,
  preview: {
    select: videoPreviewSelect,
    prepare: prepareVideoPreview,
  },
})

export const galleryVideoItem = defineType({
  name: 'galleryVideoItem',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [...videoFields, colSpanField, rowSpanField],
  preview: {
    select: { ...videoPreviewSelect, colSpan: 'colSpan', rowSpan: 'rowSpan' },
    prepare(props: VideoPreviewProps) {
      const base = prepareVideoPreview(props)
      const c = Number(props.colSpan ?? 1)
      const r = Number(props.rowSpan ?? 1)
      const featured = c > 1 || r > 1
      return {
        ...base,
        title: featured ? `${base.title} · ${c}×${r}` : base.title,
      }
    },
  },
})
