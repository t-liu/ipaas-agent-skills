import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSkillsStore } from '@/stores/skills'

const mockSkillsData = [
  { id: '1', name: 'mulesoft-test-generator', displayName: 'MUnit Test Generator', downloads: 1420, tags: ['MUnit'], description: 'MUnit suite' },
  { id: '2', name: 'dataweave-optimizer', displayName: 'DataWeave Optimizer', downloads: 980, tags: ['DataWeave'], description: 'DataWeave 2.0' },
  { id: '3', name: 'api-spec-scaffolder', displayName: 'OAS to RAML Converter', downloads: 850, tags: ['RAML'], description: 'OAS to RAML' }
]

const mockResponse = {
  items: mockSkillsData,
  nextToken: null,
  count: 3
}

describe('skillsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      })
    ))
  })

  it('returns skills sorted by downloads after fetch', async () => {
    const store = useSkillsStore()
    await store.fetchSkillsFromApi()

    expect(store.skills).toHaveLength(3)
    expect(store.filteredSkills[0].name).toBe('mulesoft-test-generator')
  })

  it('filters by display name after fetch', async () => {
    const store = useSkillsStore()
    await store.fetchSkillsFromApi()

    store.searchQuery = 'MUnit'
    expect(store.filteredSkills).toHaveLength(1)
    expect(store.filteredSkills[0].name).toBe('mulesoft-test-generator')
  })

  it('supports append mode for pagination', async () => {
    const store = useSkillsStore()
    await store.fetchSkillsFromApi(50, false)
    expect(store.skills).toHaveLength(3)

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ items: [{ id: '4', name: 'new-skill', displayName: 'New Skill' }], nextToken: null, count: 1 }),
      })
    ))

    await store.fetchSkillsFromApi(50, true)
    expect(store.skills).toHaveLength(4)
  })

  it('tracks loading state', async () => {
    const store = useSkillsStore()

    let resolvePromise: (value: unknown) => void
    vi.stubGlobal('fetch', vi.fn(() => new Promise(resolve => { resolvePromise = resolve })))

    const promise = store.fetchSkillsFromApi()
    expect(store.isLoading).toBe(true)

    resolvePromise!({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await promise
    expect(store.isLoading).toBe(false)
  })

  it('tracks hasMore from nextToken', async () => {
    const store = useSkillsStore()

    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ items: mockSkillsData, nextToken: 'next-cursor', count: 3 }),
      })
    ))

    await store.fetchSkillsFromApi()
    expect(store.hasMore).toBe(true)
  })
})
