import {
  BellIcon,
  CloseIcon,
  CogIcon,
  DashboardIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  ImagesIcon,
  ProjectsIcon,
  StarIcon,
  TagIcon,
} from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) => {
  return S.list()
    .title('JTBI Content')
    .items([
      // ── Notifications ───────────────────────────────
      S.listItem()
        .title('Notifications')
        .icon(BellIcon)
        .child(
          S.list()
            .title('Notifications')
            .items([
              S.listItem()
                .title('New Contact Submissions')
                .icon(EnvelopeIcon)
                .child(
                  S.documentList()
                    .title('New Contact Submissions')
                    .schemaType('contactSubmission')
                    .filter('_type == "contactSubmission" && status == "new"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('In Progress')
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title('In Progress Submissions')
                    .schemaType('contactSubmission')
                    .filter('_type == "contactSubmission" && status == "in-progress"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                ),
            ]),
        ),
      S.divider(),

      // ── Quick Edit ────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homepage').documentId('homepage').title('Homepage')),
      S.divider(),

      // ── Content ───────────────────────────────────────
      S.listItem()
        .title('Projects')
        .icon(ProjectsIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
        ),
      S.listItem()
        .title('Snapshots')
        .icon(DashboardIcon)
        .child(S.documentTypeList('snapshot').title('Snapshots')),
      S.listItem()
        .title('Services')
        .icon(TagIcon)
        .child(S.documentTypeList('service').title('Services')),
      S.divider(),

      // ── Other Pages ───────────────────────────────────
      S.listItem()
        .title('Other Pages')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Other Pages')
            .items([
              S.listItem()
                .title('Legal Pages')
                .icon(DocumentTextIcon)
                .child(S.documentTypeList('legalPage').title('Legal Pages')),
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

      // ── All ───────────────────────────────────────────
      S.listItem()
        .title('All Images')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('sanity.imageAsset')
            .title('All Images')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('All Contact Submissions')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('All Contact Submissions')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
        ),
    ])
}
