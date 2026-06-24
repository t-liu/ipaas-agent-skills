import { ref, watch, onUnmounted, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay: number = 300): Ref<T> {
  const debounced = ref<T>(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(source, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = val
    }, delay)
  })

  onUnmounted(() => clearTimeout(timer))

  return debounced
}