import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSkills } from '@/composables/useSkills'

// Sample mock data matching your AgentSkill type
const mockSkillsData = [
  { id: '1', name: 'mulesoft-test-generator', displayName: 'MUnit Test Generator', downloads: 1420, tags: ['MUnit'], description: 'MUnit suite' },
  { id: '2', name: 'dataweave-optimizer', displayName: 'DataWeave Optimizer', downloads: 980, tags: ['DataWeave'], description: 'DataWeave 2.0' },
  { id: '3', name: 'api-spec-scaffolder', displayName: 'OAS to RAML Converter', downloads: 850, tags: ['RAML'], description: 'OAS to RAML' }
]

describe('useSkills', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    
    // Mock global fetch to return a successful response with our data
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSkillsData),
      })
    ))
  })

  it('returns mock skills sorted by downloads after fetch', async () => {
    const { filteredSkills, fetchSkillsFromApi } = useSkills()
    
    // Explicitly call the API fetch wrapper
    await fetchSkillsFromApi()
    
    const skills = filteredSkills.value
    expect(skills).toHaveLength(3)
    expect(skills[0].name).toBe('mulesoft-test-generator')
  })

  it('filters by display name after fetch', async () => {
    const { searchQuery, filteredSkills, fetchSkillsFromApi } = useSkills()
    await fetchSkillsFromApi()
    
    searchQuery.value = 'MUnit'
    expect(filteredSkills.value).toHaveLength(1)
    expect(filteredSkills.value[0].name).toBe('mulesoft-test-generator')
  })
})