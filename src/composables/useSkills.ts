import { ref, computed } from 'vue'
import type { AgentSkill } from '@/types'
import { config } from '../config/env'

const{ apiEndpointUrl } = config

export function useSkills() {
  // Initialize cleanly with an empty array
  const skills = ref<AgentSkill[]>([])
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredSkills = computed(() => {
      const query = searchQuery.value.toLowerCase().trim()

      // Guard clause: Ensure skills.value is treated as an array to prevent iteration errors
      const targetSkills = Array.isArray(skills.value) ? skills.value : []
      const sorted = [...targetSkills].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))

      if (!query) return sorted

      return sorted.filter(skill =>
        skill.displayName?.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query) ||
        skill.tags?.some(t => t.toLowerCase().includes(query))
      )
    })

  const fetchSkillsFromApi = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log("🚀 Initiating API fetch to:", `${apiEndpointUrl}/v1/skills`)
      const response = await fetch(`${apiEndpointUrl}/v1/skills`)

      console.log("📡 HTTP Status Received:", response.status)

      // 1. Guard clause for non-2xx responses
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Server responded with status ${response.status}`);
      }

      // 2. Safe parsing
      const data = await response.json()
      console.log("🎉 Live data successfully fetched:", data)

      skills.value = data
    } catch (err: unknown) {
      // 3. Force the error out into the console so you can see it
      console.error("❌ fetchSkillsFromApi encountered an error:", err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch skills'
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchQuery,
    filteredSkills,
    isLoading,
    error,
    fetchSkillsFromApi
  }
}
