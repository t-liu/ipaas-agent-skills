import { vi } from 'vitest'

vi.mock('@/config/env', () => ({
  config: {
    apiEndpointUrl: 'http://localhost:3000',
    cloudinaryBaseUrl: 'https://res.cloudinary.com/test',
    personalWebsiteUrl: 'https://localhost',
    dynamoDbTableName: 'test-table',
    socialLinks: []
  }
}))