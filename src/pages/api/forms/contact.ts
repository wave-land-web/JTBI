export const prerender = false

import { render } from '@react-email/render'
import type { APIRoute } from 'astro'
import { z } from 'zod'
import Notification from '../../../components/emails/Notification'
import Welcome from '../../../components/emails/Welcome'
import { resend } from '../../../lib/resend'
import sanityClient from '../../../sanity/lib/client'
import { AKISMET_API_KEY, RESEND_AUDIENCE_ID } from 'astro:env/server'

// Validation schema
const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  businessName: z.string().trim().min(1, 'Business name is required'),
  email: z.string().trim().email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9()\-.\s]+$/, 'Invalid phone number') // Allow only common phone characters; actual digit count is enforced separately
    .refine(
      (value) => {
        const digitsOnly = value.replace(/\D/g, '')
        return digitsOnly.length >= 10 && digitsOnly.length <= 15
      },
      { message: 'Invalid phone number' },
    ),
  message: z.string().trim().optional().default(''),
  isSubscribed: z.boolean().optional().default(false),
  'bot-field': z.string().optional().default(''),
})

// Akismet spam check
async function checkSpamWithAkismet(
  email: string,
  name: string,
  message: string,
  userIp?: string | null,
): Promise<boolean> {
  try {
    if (!AKISMET_API_KEY) {
      console.warn('AKISMET_API_KEY not configured, skipping spam check')
      return false
    }

    const response = await fetch(`https://${AKISMET_API_KEY}.rest.akismet.com/1.1/comment-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        blog: 'https://jtbimaginative.com',
        user_ip: userIp || '127.0.0.1',
        user_agent: 'Astro Contact Form',
        comment_type: 'contact-form',
        comment_author: name,
        comment_author_email: email,
        comment_content: message,
      }).toString(),
    })

    const result = await response.text()
    return result.trim() === 'true'
  } catch (error) {
    console.error('Error checking spam with Akismet:', error)
    return false
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Extract form data
    const formData = await request.formData()
    const rawData = {
      firstName: formData.get('firstName')?.toString() ?? '',
      lastName: formData.get('lastName')?.toString() ?? '',
      businessName: formData.get('businessName')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? '',
      message: formData.get('message')?.toString() ?? '',
      isSubscribed: formData.get('isSubscribed') === 'on',
      'bot-field': formData.get('bot-field')?.toString() ?? '',
    }

    // Validate with Zod
    const validated = contactFormSchema.parse(rawData)

    // Honeypot spam protection - if bot-field is filled, it's likely a bot
    if (validated['bot-field'] && validated['bot-field'].trim() !== '') {
      console.log('Spam detected: honeypot field filled')
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Spam detected. Please try again.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Akismet spam check
    const userIp = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip')
    const isSpam = await checkSpamWithAkismet(
      validated.email,
      `${validated.firstName} ${validated.lastName}`,
      validated.message,
      userIp,
    )

    if (isSpam) {
      console.log('Spam detected by Akismet:', validated.email)
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Your submission was flagged as spam. Please try again.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Format contact data
    const contactData = {
      firstName: validated.firstName,
      lastName: validated.lastName,
      businessName: validated.businessName,
      email: validated.email,
      phone: validated.phone,
      message: validated.message,
      isSubscribed: validated.isSubscribed,
    }

    let submissionId: string | null = null

    try {
      const submission = await sanityClient.create({
        _type: 'contactSubmission',
        ...contactData,
        source: 'website-contact-form',
        status: 'new',
        submittedAt: new Date().toISOString(),
      })

      submissionId = submission._id
    } catch (sanityError) {
      console.error('Error saving contact submission to Sanity:', sanityError)

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to save your message. Please try again later.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Handle Resend audience management
    let resendContactId = null

    // Prepare emails to send using batch API
    const emailsToSend = []

    // If user opted in to subscribe, add them to Resend audience
    if (contactData.isSubscribed) {
      try {
        // Add contact to Resend audience
        const resendResponse = await resend.contacts.create({
          email: contactData.email,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          audienceId: RESEND_AUDIENCE_ID,
        })

        if (resendResponse.data) {
          resendContactId = resendResponse.data.id

          if (submissionId) {
            await sanityClient.patch(submissionId).set({ resendContactId }).commit()
          }
        }

        // Prepare welcome email to the new subscriber
        try {
          const emailParams = {
            email: contactData.email,
            firstName: contactData.firstName,
            isSubscribed: true,
          }

          const welcomeText = await render(Welcome(emailParams), {
            plainText: true,
          })

          // Add welcome email to batch (only if Resend contact creation succeeded)
          emailsToSend.push({
            from: 'JTBI <hello@jtbimaginative.com>',
            to: [contactData.email],
            subject: 'Welcome to JTB Imaginative LLC',
            react: Welcome(emailParams),
            text: welcomeText,
          })
        } catch (emailError) {
          console.error('Error preparing welcome email:', emailError)
        }
      } catch (resendError) {
        console.error('Error adding contact to Resend audience:', resendError)
        // Don't fail the entire request if Resend fails (user can still contact)
      }
    }

    // Prepare notification email to jtbimaginative@gmail.com
    try {
      const notificationParams = {
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        businessName: contactData.businessName,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
        isSubscribed: contactData.isSubscribed,
      }

      // Render the notification email as plain text
      const notificationText = await render(Notification(notificationParams), {
        plainText: true,
      })

      // Add notification email to batch
      emailsToSend.push({
        from: 'JTBI Website <noreply@jtbimaginative.com>',
        to: ['jtbimaginative@gmail.com'],
        subject: `New contact form submission from ${contactData.firstName} ${contactData.lastName}`,
        react: Notification(notificationParams),
        text: notificationText,
      })
    } catch (notificationError) {
      console.error('Error preparing notification email:', notificationError)
    }

    // Send all emails in a single batch request (if any emails to send)
    if (emailsToSend.length > 0) {
      try {
        const { data: batchData, error: batchError } = await resend.batch.send(emailsToSend)

        if (batchError) {
          console.error('Error sending batch emails:', batchError)
          // Don't fail the entire request if batch email fails
        } else {
          console.log(`Successfully sent ${emailsToSend.length} emails in batch`)
        }
      } catch (batchError) {
        console.error('Error sending batch emails:', batchError)
        // Don't fail the entire request if batch email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'We have received your message and will get back to you shortly.',
        email: contactData.email,
        isSubscribed: contactData.isSubscribed,
        submissionId,
        resendContactId,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      const message = firstError || 'Please check your form and try again'

      console.error('Validation error:', fieldErrors)
      return new Response(
        JSON.stringify({
          success: false,
          message,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // Handle other errors
    console.error('Error sending message:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to send your message. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
