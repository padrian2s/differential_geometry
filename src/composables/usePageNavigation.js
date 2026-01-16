import { ref, computed } from 'vue'

export function usePageNavigation(totalPages = 518) {
  // Try to restore last page from localStorage
  const savedPage = localStorage.getItem('geometry-current-page')
  const currentPage = ref(savedPage ? parseInt(savedPage, 10) : 1)

  const setPage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page))
    currentPage.value = pageNum
    localStorage.setItem('geometry-current-page', pageNum.toString())
  }

  const goToNextPage = () => {
    if (currentPage.value < totalPages) {
      setPage(currentPage.value + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage.value > 1) {
      setPage(currentPage.value - 1)
    }
  }

  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value === totalPages)

  return {
    currentPage,
    setPage,
    goToNextPage,
    goToPrevPage,
    isFirstPage,
    isLastPage,
    totalPages
  }
}
