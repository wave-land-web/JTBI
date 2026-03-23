import { CogIcon, EnvelopeIcon, FolderIcon } from '@sanity/icons'

export const structure = (S: any) => {
  return S.list()
    .title('Sanity Studio')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
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
