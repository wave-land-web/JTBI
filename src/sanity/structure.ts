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
import type { ComponentType } from 'react'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'

// Image "folders": each one lists the images its pages currently use, worked out
// from references, so new uploads and moved images land in the right place.
function imageList(
  S: StructureBuilder,
  title: string,
  where: string,
  params: Record<string, unknown> = {},
) {
  return S.documentList()
    .title(title)
    .schemaType('sanity.imageAsset')
    .filter(`_type == "sanity.imageAsset" && ${where}`)
    .params(params)
    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
}

function imagesUsedBy(S: StructureBuilder, title: string, types: string[], icon: ComponentType) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(imageList(S, title, 'count(*[_type in $types && references(^._id)]) > 0', { types }))
}

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
        .title('Images')
        .icon(ImagesIcon)
        .child(
          S.list()
            .title('Images')
            .items([
              S.listItem()
                .title('All Images')
                .icon(ImagesIcon)
                .child(
                  S.documentTypeList('sanity.imageAsset')
                    .title('All Images')
                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]),
                ),
              S.divider(),
              imagesUsedBy(S, 'Homepage', ['homepage'], HomeIcon),
              S.listItem()
                .title('Projects')
                .icon(ProjectsIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Projects')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                    .child((id) =>
                      imageList(S, 'Images', 'count(*[_id in [$id, "drafts." + $id] && references(^._id)]) > 0', { id }),
                    ),
                ),
              imagesUsedBy(S, 'Snapshots', ['snapshot'], DashboardIcon),
              imagesUsedBy(S, 'Services', ['service'], TagIcon),
              imagesUsedBy(S, 'Other Pages', ['siteSettings', 'legalPage', 'notFoundPage'], FolderIcon),
              S.divider(),
              S.listItem()
                .title('Not Used on the Site')
                .icon(CloseIcon)
                .child(imageList(S, 'Not Used on the Site', 'count(*[references(^._id)]) == 0')),
            ]),
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
