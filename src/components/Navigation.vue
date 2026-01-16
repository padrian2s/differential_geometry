<template>
  <nav class="navigation">
    <select
      v-model="selectedChapter"
      @change="goToChapter"
      class="chapter-select"
    >
      <option value="">Jump to Chapter</option>
      <option
        v-for="chapter in chapters"
        :key="chapter.id"
        :value="chapter.id"
      >
        {{ chapter.title }}
      </option>
    </select>

    <div class="bookmarks-wrapper">
      <button @click="showBookmarks = !showBookmarks" class="bookmarks-btn">
        <span class="bookmark-icon">★</span>
        <span class="bookmark-label">Bookmarks</span>
        <span v-if="bookmarksList.length" class="bookmark-count">{{ bookmarksList.length }}</span>
      </button>

      <div v-if="showBookmarks" class="bookmarks-dropdown">
        <div class="bookmarks-header">
          <span>Bookmarks</span>
          <button @click="showBookmarks = false" class="close-btn">×</button>
        </div>
        <div v-if="bookmarksList.length === 0" class="no-bookmarks">
          No bookmarks yet
        </div>
        <ul v-else class="bookmarks-list">
          <li
            v-for="bookmark in bookmarksList"
            :key="bookmark"
            @click="goToPage(bookmark)"
            :class="{ active: bookmark === currentPage }"
          >
            <span class="bookmark-page">Page {{ bookmark }}</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBookmarks } from '../composables/useBookmarks'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  chapters: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:page'])

const { bookmarks } = useBookmarks()
const bookmarksList = computed(() => [...bookmarks.value].sort((a, b) => a - b))

const selectedChapter = ref('')
const showBookmarks = ref(false)

watch(() => props.currentPage, (page) => {
  const chapter = props.chapters.find(
    ch => page >= ch.startPage && page <= ch.endPage
  )
  selectedChapter.value = chapter ? chapter.id : ''
})

const goToPage = (page) => {
  emit('update:page', page)
  showBookmarks.value = false
}

const goToChapter = () => {
  const chapter = props.chapters.find(ch => ch.id === selectedChapter.value)
  if (chapter) {
    emit('update:page', chapter.startPage)
  }
}
</script>

<style scoped>
.navigation {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
}

.chapter-select {
  min-width: 180px;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
}

.bookmarks-wrapper {
  position: relative;
}

.bookmarks-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.bookmarks-btn:hover {
  border-color: var(--color-warning);
}

.bookmark-icon {
  color: var(--color-warning);
}

.bookmark-count {
  background-color: var(--color-accent);
  color: white;
  font-size: 0.6875rem;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.bookmarks-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-xs);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 200px;
  box-shadow: 0 4px 12px var(--color-shadow);
  z-index: 100;
  overflow: hidden;
}

.bookmarks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.875rem;
}

.close-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 1.25rem;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
}

.close-btn:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.no-bookmarks {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.bookmarks-list {
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
}

.bookmarks-list li {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  font-size: 0.875rem;
}

.bookmarks-list li:hover {
  background-color: var(--color-bg-secondary);
}

.bookmarks-list li.active {
  background-color: var(--color-accent);
  color: white;
}

@media (max-width: 768px) {
  .chapter-select {
    min-width: 120px;
  }

  .bookmark-label {
    display: none;
  }
}
</style>
