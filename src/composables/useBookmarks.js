import { ref, watch } from 'vue'

const STORAGE_KEY = 'geometry-bookmarks'

// Shared state across all component instances
const bookmarks = ref(new Set())

// Load bookmarks from localStorage
const loadBookmarks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      bookmarks.value = new Set(parsed)
    }
  } catch (e) {
    console.warn('Failed to load bookmarks:', e)
  }
}

// Save bookmarks to localStorage
const saveBookmarks = () => {
  try {
    const array = [...bookmarks.value]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(array))
  } catch (e) {
    console.warn('Failed to save bookmarks:', e)
  }
}

// Initialize on first import
loadBookmarks()

export function useBookmarks() {
  const addBookmark = (page) => {
    bookmarks.value.add(page)
    bookmarks.value = new Set(bookmarks.value) // Trigger reactivity
    saveBookmarks()
  }

  const removeBookmark = (page) => {
    bookmarks.value.delete(page)
    bookmarks.value = new Set(bookmarks.value) // Trigger reactivity
    saveBookmarks()
  }

  const toggleBookmark = (page) => {
    if (bookmarks.value.has(page)) {
      removeBookmark(page)
    } else {
      addBookmark(page)
    }
  }

  const isBookmarked = (page) => {
    return bookmarks.value.has(page)
  }

  const clearBookmarks = () => {
    bookmarks.value = new Set()
    saveBookmarks()
  }

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks
  }
}
