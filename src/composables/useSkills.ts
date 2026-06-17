import { ref, computed } from 'vue'
import type { AgentSkill } from '@/types'

const mockSkills: AgentSkill[] = [
  {
    id: 'de3b56ff-a4da-4eff-8a81-ba9c907c1909' as AgentSkill['id'],
    name: 'mulesoft-test-generator' as AgentSkill['name'],
    displayName: 'MUnit Test Generator',
    version: '3.1.0' as AgentSkill['version'],
    author: 'Lead Automation Guild',
    description: 'Automatically scaffolds and generates comprehensive MUnit 3.x test suites and JSON fixtures for Mule 4.x flows. Supports external dependency mocking and automatic PII scrubbing.',
    tags: ['MUnit', 'Test Gen', 'Automation', 'Mule 4'],
    category: 'testing',
    downloads: 1420,
    installationCmd: 'agents install mulesoft-test-generator',
    createdAt: '2025-11-03T08:00:00Z' as AgentSkill['createdAt'],
    updatedAt: '2026-06-12T14:30:00Z' as AgentSkill['updatedAt']
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' as AgentSkill['id'],
    name: 'dataweave-optimizer' as AgentSkill['name'],
    displayName: 'DataWeave Optimizer',
    version: '1.2.4' as AgentSkill['version'],
    author: 'Core Integrations Team',
    description: 'Analyzes memory utilization maps and refactors complex DataWeave 2.0 scripts for enhanced mapping throughput and reduced CPU overhead within cloud runtimes.',
    tags: ['DataWeave', 'Performance', 'DW 2.0'],
    category: 'mapping',
    downloads: 980,
    installationCmd: 'agents install dataweave-optimizer',
    createdAt: '2025-08-15T10:30:00Z' as AgentSkill['createdAt'],
    updatedAt: '2026-06-14T09:15:00Z' as AgentSkill['updatedAt']
  },
  {
    id: 'a8b7c6d5-e4f3-4a2b-1c0d-9e8f7a6b5c4d' as AgentSkill['id'],
    name: 'api-spec-scaffolder' as AgentSkill['name'],
    displayName: 'OAS to RAML Converter',
    version: '2.0.1' as AgentSkill['version'],
    author: 'Mule Architect Alliance',
    description: 'Accelerates API-led connectivity design by smoothly converting OpenAPI 3.0 specifications to standardized RAML 1.0 fragments with common trait implementations.',
    tags: ['RAML', 'OAS', 'Design Layer'],
    category: 'design',
    downloads: 850,
    installationCmd: 'agents install api-spec-scaffolder',
    createdAt: '2025-06-20T12:00:00Z' as AgentSkill['createdAt'],
    updatedAt: '2026-05-29T11:00:00Z' as AgentSkill['updatedAt']
  }
]

export function useSkills() {
  const skills = ref<AgentSkill[]>([...mockSkills])
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredSkills = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const sorted = [...skills.value].sort((a, b) => b.downloads - a.downloads)

    if (!query) return sorted

    return sorted.filter(skill =>
      skill.displayName.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.tags.some(t => t.toLowerCase().includes(query))
    )
  })

  const fetchSkillsFromApi = async () => {
    isLoading.value = true
    error.value = null
    try {
      // Phase 2: replace with real API call
      // const response = await fetch('https://api.skills-marketplace.cc/v1/skills')
      // skills.value = [...await response.json()]
    } catch (err: unknown) {
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
