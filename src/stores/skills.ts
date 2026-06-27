import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AgentSkill } from '@/types'
import { config } from '../config/env'

const { apiEndpointUrl } = config

export const useSkillsStore = defineStore('skills', () => {
  const skills = ref<AgentSkill[]>([])
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const nextToken = ref<string | null>(null)

  const hasMore = computed(() => nextToken.value !== null)

  const filteredSkills = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const targetSkills = Array.isArray(skills.value) ? skills.value : []
    const sorted = [...targetSkills].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))

    if (!query) return sorted

    return sorted.filter(skill =>
      skill.displayName?.toLowerCase().includes(query) ||
      skill.description?.toLowerCase().includes(query) ||
      skill.tags?.some(t => t.toLowerCase().includes(query))
    )
  })

  async function fetchSkillsFromApi(limit = 50, append = false) {
    isLoading.value = true
    error.value = null

    try {
      if (!append) {
        skills.value = []
        nextToken.value = null
      }

      const params = new URLSearchParams()
      params.set('limit', String(limit))
      if (nextToken.value) params.set('nextToken', nextToken.value)

      const url = `${apiEndpointUrl}/v1/skills?${params}`
      const response = await fetch(url)

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody.detail || `Server responded with status ${response.status}`)
      }

      const data = await response.json()
      const items = Array.isArray(data) ? data : (data.items ?? [])
      if (append) {
        skills.value.push(...items)
      } else {
        skills.value = items
      }
      nextToken.value = Array.isArray(data) ? null : (data.nextToken ?? null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch skills'
      error.value = message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSkillByName(name: string): Promise<AgentSkill | null> {
    const existing = skills.value.find(s => s.name === name)
    if (existing) return existing

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${apiEndpointUrl}/v1/skills/${encodeURIComponent(name)}`)

      if (!response.ok) {
        if (response.status === 404) {
          error.value = 'Skill not found'
          return null
        }
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody.detail || `Server responded with status ${response.status}`)
      }

      const skill: AgentSkill = await response.json()
      skills.value.push(skill)
      return skill
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch skill'
      error.value = message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    skills,
    searchQuery,
    filteredSkills,
    isLoading,
    error,
    nextToken,
    hasMore,
    fetchSkillsFromApi,
    fetchSkillByName,
  }
})
