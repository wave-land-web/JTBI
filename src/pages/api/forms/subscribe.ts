export const prerender = false

import { render } from '@react-email/render'
import type { APIRoute } from 'astro'
import Welcome from '../../../components/emails/Welcome'
import { resend } from '../../../lib/resend'
import { sanityClient } from '../../../sanity/lib/client'

export const POST: APIRoute = async ({ request }) => {
  try {
    // Extract form data
    const formData = await request.formData()
    const firstName = formData.get('firstName')?.toString()
    const lastName = formData.get('lastName')?.toString()
    const businessName = formData.get('businessName')?.toString()
    const email = formData.get('email')?.toString()
    const phone = formData.get('phone')?.toString()
    const message = formData.get('message')?.toString()
    const isSubscribed = formData.get('isSubscribed') === 'on' // Checkbox values are 'on' when checked

    // Validate required fields
    if (!firstName || !lastName || !businessName || !email || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All fields are required',
          missing: {
            firstName: !firstName,
            lastName: !lastName,
            businessName: !businessName,
            email: !email,
            phone: !phone,
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Create the user document in Sanity
    const userDoc = {
      _type: 'user',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      businessName: businessName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
      isSubscribed: isSubscribed || false,
      createdAt: new Date().toISOString(),
    }

    // Save to Sanity
    const result = await sanityClient.create(userDoc)

    // Add to Resend audience if subscribed
    let resendContactId = null
    if (userDoc.isSubscribed) {
      try {
        const resendResponse = await resend.contacts.create({
          email: userDoc.email,
          firstName: userDoc.firstName,
          lastName: userDoc.lastName,
          audienceId: import.meta.env.RESEND_AUDIENCE_ID,
        })

        // Handle successful response
        if (resendResponse.data) {
          resendContactId = resendResponse.data.id

          // Create params for the welcome email
          const emailParams = {
            email,
            firstName,
          }

          // Render the welcome email as plain text
          const text = await render(Welcome(emailParams), {
            plainText: true,
          })

          // Send welcome email
          const { data: welcomeEmailData, error: welcomeEmailError } = await resend.emails.send({
            from: 'JTBI <noreply@jtbimaginative.com>',
            to: [userDoc.email],
            subject: 'Welcome to JTB Imaginative LCC',
            react: Welcome(emailParams),
            text,
          })

          if (welcomeEmailError) {
            console.error('Error sending welcome email:', welcomeEmailError)
            // Don't fail the entire request if welcome email fails
          }
        }
      } catch (resendError) {
        console.error('Error adding contact to Resend audience:', resendError)
        // Don't fail the entire request if Resend fails
        // The contact is still saved in Sanity
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'We have received your message and will get back to you shortly.',
        id: result._id,
        isSubscribed: userDoc.isSubscribed,
        resendContactId,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
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
      }
    )
  }
}
