import type { SchemaTypeDefinition } from 'sanity'
import contactBlock from './blocks/contactBlock'
import heroBlock from './blocks/heroBlock'
import imageGalleryBlock from './blocks/imageGalleryBlock'
import masonryGrid from './blocks/masonryGrid'
import mediaCardRowBlock from './blocks/mediaCardRowBlock'
import projectsBlock from './blocks/projectsBlock'
import sixUpGrid from './blocks/sixUpGrid'
import snapshotsBlock from './blocks/snapshotsBlock'
import contactSubmission from './contactSubmission'
import homepage from './homepage'
import legalPage from './legalPage'
import notFoundPage from './notFoundPage'
import project from './project'
import service from './service'
import imageAsset from './shared/imageAsset'
import { galleryVideoItem, videoItem } from './shared/videoItem'
import siteSettings from './siteSettings'
import snapshot from './snapshots'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    imageAsset,
    videoItem,
    galleryVideoItem,
    siteSettings,
    homepage,
    notFoundPage,
    legalPage,
    contactSubmission,
    project,
    service,
    snapshot,
    heroBlock,
    projectsBlock,
    mediaCardRowBlock,
    snapshotsBlock,
    contactBlock,
    imageGalleryBlock,
    masonryGrid,
    sixUpGrid,
  ],
}
