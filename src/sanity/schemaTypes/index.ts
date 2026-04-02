import type { SchemaTypeDefinition } from 'sanity'
import contactBlock from './blocks/contactBlock'
import heroBlock from './blocks/heroBlock'
import mediaCardRowBlock from './blocks/mediaCardRowBlock'
import projectsBlock from './blocks/projectsBlock'
import servicesBlock from './blocks/servicesBlock'
import contactSubmission from './contactSubmission'
import homepage from './homepage'
import legalPage from './legalPage'
import notFoundPage from './notFoundPage'
import project from './project'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    homepage,
    notFoundPage,
    legalPage,
    contactSubmission,
    project,
    heroBlock,
    projectsBlock,
    mediaCardRowBlock,
    servicesBlock,
    contactBlock,
  ],
}
