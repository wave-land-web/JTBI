import { Resend } from 'resend'
import { RESEND_API_KEY } from 'astro:env/server'

const resend = new Resend(RESEND_API_KEY)

export { resend }
