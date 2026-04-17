import {
  CloseIcon,
  CogIcon,
  DashboardIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  ProjectsIcon,
} from '@sanity/icons'

export const structure = (S: any) => {
  return S.list()
    .title('JTBI Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Homepage')
                .icon(HomeIcon)
                .child(
                  S.document().schemaType('homepage').documentId('homepage').title('Homepage'),
                ),
              S.divider(),
              S.listItem()
                .title('Legal Pages')
                .icon(DocumentTextIcon)
                .child(S.documentTypeList('legalPage').title('Legal Pages')),
              S.divider(),
              S.listItem()
                .title('404 Page')
                .icon(CloseIcon)
                .child(
                  S.document()
                    .schemaType('notFoundPage')
                    .documentId('notFoundPage')
                    .title('404 Page'),
                ),
            ]),
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
        .title('Services')
        .icon(DashboardIcon)
        .child(S.documentTypeList('service').title('Services')),
      S.divider(),
      S.listItem()
        .title('Contact Submissions')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('Contact Submissions')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
        ),
    ])
}
