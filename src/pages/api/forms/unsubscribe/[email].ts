export const prerender = false

import { render } from '@react-email/components'
import type { APIRoute } from 'astro'
import { z } from 'zod'
import Unsubscribe from '../../../../components/emails/Unsubscribe'
import { resend } from '../../../../lib/resend'

// Validation schema
const unsubscribeParamsSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
})

/**
 * GET request handler for unsubscribing an email.
 *
 * @param params The request parameters.
 * @param redirect The redirect function.
 * @returns The response object.
 */
export const GET: APIRoute = async ({ params, redirect }) => {
  try {
    // Validate email parameter
    const { email } = unsubscribeParamsSchema.parse({
      email: params.email,
    })

    const sanitizedEmail = email.toLowerCase()

    // Fetch contact from Resend audience to get firstName
    let firstName = 'there'
    try {
      const { data: contactData } = await resend.contacts.get({
        email: sanitizedEmail,
        audienceId: import.meta.env.RESEND_AUDIENCE_ID,
      })
      if (contactData?.first_name) {
        firstName = contactData.first_name
      }
    } catch (error) {
      console.error("Error fetching contact from Resend, using default greeting 'there':", error)
    }

    // Handle unsubscription from the Resend audience
    const { data: unsubscribeData, error: unsubscribeError } = await resend.contacts.update({
      email: sanitizedEmail,
      audienceId: import.meta.env.RESEND_AUDIENCE_ID,
      unsubscribed: true,
    })

    // Log the response from Resend
    console.log(unsubscribeData, unsubscribeError)

    // Render the Unsubscribe email as plain text
    const text = await render(Unsubscribe({ firstName }), {
      plainText: true,
    })

    // Send an email to the user confirming their unsubscription
    const { data: unsubscribeEmailData, error: unsubscribeEmailError } = await resend.emails.send({
      from: 'JTBI <hello@jtbimaginative.com>',
      to: sanitizedEmail,
      subject: 'You have been unsubscribed from JTB Imaginative LLC',
      react: Unsubscribe({ firstName }),
      text,
    })

    // Log the response from Resend
    console.log(unsubscribeEmailData, unsubscribeEmailError)

    // If there was an error unsubscribing the user >> return an error
    if (unsubscribeError?.message) {
      return new Response(
        JSON.stringify({
          error: `There was an error unsubscribing ${sanitizedEmail}. Please try again later. Error: ${unsubscribeError.message}`,
        }),
        { status: 500 },
      )
    }

    // If there was an error sending the unsubscription email >> return an error
    if (unsubscribeEmailError?.message) {
      return new Response(
        JSON.stringify({
          error: `There was an error sending the unsubscription email to ${sanitizedEmail}. Please try again later. Error: ${unsubscribeEmailError.message}`,
        }),
        { status: 500 },
      )
    }

    // If unsubscription was successful >> redirect to the `/unsubscribed` page
    return redirect('/unsubscribed', 303)
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(null, {
        status: 404,
        statusText: 'Invalid email',
      })
    }

    // Handle other errors
    console.error('Error in unsubscribe route:', error)
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again later.',
      }),
      { status: 500 },
    )
  }
}
