import { describe, it, expect } from 'vitest'
import { useSkills } from '@/composables/useSkills'

describe('useSkills', () => {
  it('returns mock skills sorted by downloads', () => {
    const { filteredSkills } = useSkills()
    const skills = filteredSkills.value
    expect(skills).toHaveLength(3)
    expect(skills[0].name).toBe('mulesoft-test-generator')
    expect(skills[1].name).toBe('dataweave-optimizer')
    expect(skills[2].name).toBe('api-spec-scaffolder')
  })

  it('filters by display name', () => {
    const { searchQuery, filteredSkills } = useSkills()
    searchQuery.value = 'MUnit'
    expect(filteredSkills.value).toHaveLength(1)
    expect(filteredSkills.value[0].name).toBe('mulesoft-test-generator')
  })

  it('filters by description', () => {
    const { searchQuery, filteredSkills } = useSkills()
    searchQuery.value = 'DataWeave 2.0'
    expect(filteredSkills.value).toHaveLength(1)
    expect(filteredSkills.value[0].name).toBe('dataweave-optimizer')
  })

  it('filters by tag', () => {
    const { searchQuery, filteredSkills } = useSkills()
    searchQuery.value = 'RAML'
    expect(filteredSkills.value).toHaveLength(1)
    expect(filteredSkills.value[0].name).toBe('api-spec-scaffolder')
  })

  it('returns empty array when no match', () => {
    const { searchQuery, filteredSkills } = useSkills()
    searchQuery.value = 'zzznothing'
    expect(filteredSkills.value).toHaveLength(0)
  })

  it('returns all skills when search is empty', () => {
    const { searchQuery, filteredSkills } = useSkills()
    searchQuery.value = ''
    expect(filteredSkills.value).toHaveLength(3)
  })
})
