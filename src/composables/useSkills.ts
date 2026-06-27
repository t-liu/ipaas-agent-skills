import { useSkillsStore } from '@/stores/skills'
import { storeToRefs } from 'pinia'

export function useSkills() {
  const store = useSkillsStore()
  const { searchQuery, filteredSkills, isLoading, error } = storeToRefs(store)
  const { fetchSkillsFromApi } = store

  return {
    searchQuery,
    filteredSkills,
    isLoading,
    error,
    fetchSkillsFromApi
  }
}
