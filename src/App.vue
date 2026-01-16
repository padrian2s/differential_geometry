<template>
  <div class="app-shell">
    <header class="header">
      <div class="header-left">
        <div class="header-title">
          <h1 class="book-title">Differential Geometry of Curves and Surfaces</h1>
          <span class="chapter-indicator">{{ currentChapterTitle }}</span>
        </div>
      </div>

      <div class="header-center">
        <Navigation
          :currentPage="currentPage"
          :totalPages="totalPages"
          :chapters="chapters"
          @update:page="setPage"
        />
      </div>

      <div class="header-right">
        <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="icon-btn"
          :class="{ active: isCurrentPageBookmarked }"
          @click="toggleBookmark"
          :title="isCurrentPageBookmarked ? 'Remove Bookmark' : 'Add Bookmark'"
        >
          {{ isCurrentPageBookmarked ? '★' : '☆' }}
        </button>
      </div>
    </header>

    <main class="app-content">
      <div class="main-content">
        <PageViewer
          :page="currentPage"
        />
        <PageNavigation
          :currentPage="currentPage"
          :totalPages="totalPages"
          @prev="goToPrevPage"
          @next="goToNextPage"
          @goto="setPage"
        />
      </div>

      <EnhancementPanel
        :pageData="currentPageData"
        :page="currentPage"
        :chapter="currentChapterTitle"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Navigation from './components/Navigation.vue'
import PageViewer from './components/PageViewer.vue'
import PageNavigation from './components/PageNavigation.vue'
import EnhancementPanel from './components/EnhancementPanel.vue'
import { usePageNavigation } from './composables/usePageNavigation'
import { useBookmarks } from './composables/useBookmarks'
import chaptersData from './data/chapters.json'

const totalPages = 518
const chapters = ref(chaptersData.chapters)

const { currentPage, setPage, goToNextPage, goToPrevPage } = usePageNavigation(totalPages)
const { bookmarks, isBookmarked, toggleBookmark: toggle } = useBookmarks()

const isCurrentPageBookmarked = computed(() => isBookmarked(currentPage.value))

const currentChapterTitle = computed(() => {
  const chapter = chapters.value.find(
    ch => currentPage.value >= ch.startPage && currentPage.value <= ch.endPage
  )
  return chapter ? chapter.title : ''
})

const toggleBookmark = () => {
  toggle(currentPage.value)
}

const currentPageData = ref(null)

// Load page data when page changes
watch(currentPage, async (page) => {
  try {
    const pageNum = String(page).padStart(3, '0')
    const module = await import(`./data/pages/page_${pageNum}.json`)
    currentPageData.value = module.default
  } catch (e) {
    // No enhancement data for this page yet
    currentPageData.value = null
  }
}, { immediate: true })

// Keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      goToNextPage()
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToPrevPage()
    }
  })
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.header-title {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-indicator {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.page-indicator {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.icon-btn.active {
  color: var(--color-warning);
}

.app-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .app-content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 var(--spacing-sm);
  }

  .book-title {
    font-size: 0.875rem;
  }

  .chapter-indicator {
    display: none;
  }

  .page-indicator {
    display: none;
  }
}
</style>
