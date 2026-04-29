import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homepage: defineLocations({
      select: { _id: '_id' },
      resolve: () => ({
        locations: [{ title: 'Home', href: '/' }],
      }),
    }),
    project: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled project', href: `/project/${doc?.slug}` },
          { title: 'Home', href: '/' },
        ],
      }),
    }),
    legalPage: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Legal page', href: `/legal/${doc?.slug}` }],
      }),
    }),
    siteSettings: defineLocations({
      select: { _id: '_id' },
      resolve: () => ({
        locations: [{ title: 'Home', href: '/' }],
      }),
    }),
    notFoundPage: defineLocations({
      select: { _id: '_id' },
      resolve: () => ({
        locations: [{ title: '404 page', href: '/404' }],
      }),
    }),
  },
}
