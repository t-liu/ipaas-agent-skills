import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay: number = 300): Ref<T> {
  const debounced = ref<T>(source.value) as Ref<T>

  watch(source, (val) => {
    const handler = setTimeout(() => {
      debounced.value = val
    }, delay)

    watch(source, () => clearTimeout(handler), { once: true })
  })

  return debounced
}
