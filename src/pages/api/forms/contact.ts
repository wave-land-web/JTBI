import type { APIRoute } from 'astro'
import { sanityClient } from '../../../sanity/lib/client'

export const prerender = false // Disable prerendering for API route

export const POST: APIRoute = async ({ request }) => {
  try {
    // Extract form data
    const formData = await request.formData()
    const firstName = formData.get('firstName')?.toString()
    const lastName = formData.get('lastName')?.toString()
    const businessName = formData.get('businessName')?.toString()
    const email = formData.get('email')?.toString()
    const phone = formData.get('phone')?.toString()
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
      isSubscribed: isSubscribed || false,
      createdAt: new Date().toISOString(),
    }

    // Save to Sanity
    const result = await sanityClient.create(userDoc)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'We have received your message and will get back to you shortly.',
        id: result._id,
        isSubscribed: userDoc.isSubscribed,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error saving contact form:', error)

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
