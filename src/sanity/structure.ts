import { CogIcon, EnvelopeIcon, FolderIcon, HomeIcon, ProjectsIcon } from '@sanity/icons'

export const structure = (S: any) => {
  return S.list()
    .title('Sanity Studio')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homepage').documentId('homepage').title('Homepage')),
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Projects')
        .icon(ProjectsIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.divider(),
      S.listItem()
        .title('Forms')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Forms')
            .items([
              S.listItem()
                .title('Contact')
                .icon(EnvelopeIcon)
                .child(
                  S.documentTypeList('contactSubmission')
                    .title('Contact')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
            ]),
        ),
    ])
}
