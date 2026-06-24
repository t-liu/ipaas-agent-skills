import type { IconProp } from '@fortawesome/fontawesome-svg-core'

interface SocialLink {
  label: string
  url: string
  icon: IconProp
  ariaLabel: string
}

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Add it to .env.local for local development, or as a GitHub Actions secret for CI.`
    )
  }
  return value
}

const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/thomas-liu-tech', icon: ['fab', 'linkedin'], ariaLabel: 'Visit my LinkedIn profile' },
  { label: 'Twitter', url: 'https://twitter.com/tliu301', icon: ['fab', 'twitter'], ariaLabel: 'Visit my Twitter page' },
  { label: 'GitHub', url: 'https://github.com/t-liu', icon: ['fab', 'github'], ariaLabel: 'Visit my GitHub page' },
  { label: 'Email', url: 'mailto:thomas.s.liu@gmail.com?subject=Hey%20T-Liu%2C%20I%20Found%20You%20on%20the%20Internet', icon: ['far', 'envelope'], ariaLabel: 'Send me an email' },
]

export const config = {
  cloudinaryBaseUrl: import.meta.env.VITE_CLOUDINARY_BASE_URL || 'https://res.cloudinary.com/decbhr3np/image/upload/f_auto,q_auto',
  personalWebsiteUrl: 'https://thomasliu.click',
  apiEndpointUrl: requireEnv('VITE_API_BASE_URL'),
  dynamoDbTableName: 'mulesoft-agent-skills-dev',
  socialLinks
} as const