<template>
  <div class="page-viewer">
    <div
      class="page-container"
      :class="{ zoomable: zoom !== 1, dragging: isDragging }"
      ref="containerRef"
      @wheel.prevent="handleWheel"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <img
        v-if="!error"
        :src="imageSrc"
        :alt="`Page ${page}`"
        :style="imageStyle"
        class="page-image"
        @load="onImageLoad"
        @error="onImageError"
        draggable="false"
      />

      <div v-if="loading" class="page-loading">
        <div class="loading-spinner"></div>
        <span>Loading page...</span>
      </div>

      <div v-if="error" class="page-error">
        <span class="error-icon">⚠</span>
        <span>Failed to load page {{ page }}</span>
      </div>
    </div>

    <div class="zoom-controls">
      <button class="icon-btn" @click="zoomOut" :disabled="zoom <= 0.5" title="Zoom Out">
        −
      </button>
      <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
      <button class="icon-btn" @click="zoomIn" :disabled="zoom >= 3" title="Zoom In">
        +
      </button>
      <button class="icon-btn" @click="resetZoom" title="Reset View">
        ⟲
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  page: {
    type: Number,
    required: true
  }
})

const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const loading = ref(true)
const error = ref(false)
const containerRef = ref(null)

const imageSrc = computed(() => {
  const pageNum = String(props.page).padStart(3, '0')
  return `./pages/geometry_${pageNum}.png`
})

const imageStyle = computed(() => ({
  transform: `scale(${zoom.value}) translate(${panX.value}px, ${panY.value}px)`,
  opacity: loading.value ? 0 : 1
}))

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.25, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.25, 0.5)
}

const resetZoom = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

const handleWheel = (e) => {
  if (e.ctrlKey || e.metaKey) {
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    zoom.value = Math.max(0.5, Math.min(3, zoom.value + delta))
  } else {
    panX.value -= e.deltaX / zoom.value
    panY.value -= e.deltaY / zoom.value
  }
}

const startDrag = (e) => {
  isDragging.value = true
  dragStart.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
}

const onDrag = (e) => {
  if (!isDragging.value) return
  panX.value = e.clientX - dragStart.value.x
  panY.value = e.clientY - dragStart.value.y
}

const endDrag = () => {
  isDragging.value = false
}

const onImageLoad = () => {
  loading.value = false
  error.value = false
}

const onImageError = () => {
  loading.value = false
  error.value = true
}

watch(() => props.page, () => {
  loading.value = true
  error.value = false
  resetZoom()
})
</script>

<style scoped>
.page-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.page-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  position: relative;
}

.page-container.zoomable {
  cursor: grab;
}

.page-container.dragging {
  cursor: grabbing;
}

.page-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  transition: opacity var(--transition-normal);
  box-shadow: 0 4px 20px var(--color-shadow);
}

.page-loading,
.page-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.error-icon {
  font-size: 2rem;
  color: var(--color-error);
}

.zoom-controls {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  box-shadow: 0 2px 8px var(--color-shadow);
}

.zoom-label {
  min-width: 50px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* Page shadow effect */
.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(0, 0, 0, 0.05) 100%
  );
  pointer-events: none;
}
</style>
