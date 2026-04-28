import type { SchemaTypeDefinition } from 'sanity'
import contactBlock from './blocks/contactBlock'
import heroBlock from './blocks/heroBlock'
import imageGalleryBlock from './blocks/imageGalleryBlock'
import masonryGrid from './blocks/masonryGrid'
import mediaCardRowBlock from './blocks/mediaCardRowBlock'
import projectsBlock from './blocks/projectsBlock'
import servicesBlock from './blocks/servicesBlock'
import sixUpGrid from './blocks/sixUpGrid'
import contactSubmission from './contactSubmission'
import homepage from './homepage'
import legalPage from './legalPage'
import notFoundPage from './notFoundPage'
import project from './project'
import service from './service'
import imageAsset from './shared/imageAsset'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    imageAsset,
    siteSettings,
    homepage,
    notFoundPage,
    legalPage,
    contactSubmission,
    project,
    service,
    heroBlock,
    projectsBlock,
    mediaCardRowBlock,
    servicesBlock,
    contactBlock,
    imageGalleryBlock,
    masonryGrid,
    sixUpGrid,
  ],
}
