import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { SITE_URL } from '../../consts'
import { capitalize } from '../../lib/text'

interface WelcomeProps {
  email: string
  firstName: string
}

export default function Welcome({ email, firstName }: WelcomeProps) {
  const firstNameCapitalized = capitalize(firstName)

  return (
    <Html>
      <Head />
      <Preview>Welcome to JTB Imaginative LLC, {firstNameCapitalized}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${SITE_URL}/images/logo.png`}
            width="125"
            height="auto"
            alt="Ascend 360 Logo"
            style={logo}
          />

          <Hr style={hr} />

          <Section style={container}>
            <Text style={paragraph}>Hi {firstNameCapitalized},</Text>

            <Text style={paragraph}>Thank you for subscribing to JTB Imaginative LLC</Text>

            <Text style={paragraph}>
              We've received your information and will get back to you shortly. You've also been
              added to our mailing list. We limit our emails to only a few a year, and we never sell
              your information to others. If you ever find that these emails no longer fit your
              fancy, you can unsubscribe anytime.
            </Text>

            <Text style={paragraph}>
              Sincerely,
              <br />
              The JTB Imaginative LLC Team
            </Text>

            <Section>
              <Button style={button} href={`${SITE_URL}`} target="_blank">
                Learn More
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Link href={`${SITE_URL}/api/email/unsubscribe/${email}`} target="_blank">
            unsubscribe
          </Link>

          <Text style={footer}>JTB Imaginative LLC</Text>
          <Text style={footer}>
            PO Box 634
            <br />
            Chimacum, WA 98325
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const logo = {
  margin: '0 auto',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const button = {
  backgroundColor: '#2b86a5',
  borderRadius: '25px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
}
