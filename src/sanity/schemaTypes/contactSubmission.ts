import { ArchiveIcon, CheckmarkCircleIcon, EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('A valid first name is required'),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('A valid last name is required'),
    }),
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('A valid business name is required'),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      validation: (Rule) => Rule.required().error('A valid email address is required'),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required().error('A valid phone number is required'),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'isSubscribed',
      title: 'Newsletter Subscription',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      initialValue: 'website-contact-form',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Reviewed', value: 'reviewed' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resendContactId',
      title: 'Resend Contact ID',
      type: 'string',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare(selection) {
      const { firstName, lastName, email, status, submittedAt } = selection
      const fullName = `${firstName || ''} ${lastName || ''}`.trim()
      const title = fullName || email || 'Unnamed submission'
      const dateLabel = submittedAt ? new Date(submittedAt).toLocaleString() : 'No date'
      const media =
        status === 'reviewed'
          ? CheckmarkCircleIcon
          : status === 'archived'
            ? ArchiveIcon
            : EnvelopeIcon

      return {
        title,
        subtitle: `${email || 'No email'} · ${status || 'new'} · ${dateLabel}`,
        media,
      }
    },
  },
})
