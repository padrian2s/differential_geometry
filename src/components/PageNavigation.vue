<template>
  <div class="page-navigation">
    <button
      class="nav-btn"
      :disabled="currentPage <= 1"
      @click="$emit('prev')"
    >
      <span class="nav-icon">‹</span>
      <span>Previous</span>
    </button>

    <div class="page-input-form">
      <span class="page-label">Page</span>
      <template v-if="isEditing">
        <input
          ref="inputRef"
          type="number"
          class="page-input"
          :value="currentPage"
          :min="1"
          :max="totalPages"
          @blur="handleBlur"
          @keydown.enter="handleSubmit"
          @keydown.escape="isEditing = false"
        />
      </template>
      <template v-else>
        <button class="page-display" @click="startEditing">
          {{ currentPage }}
        </button>
      </template>
      <span class="page-total">of {{ totalPages }}</span>
    </div>

    <button
      class="nav-btn"
      :disabled="currentPage >= totalPages"
      @click="$emit('next')"
    >
      <span>Next</span>
      <span class="nav-icon">›</span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['prev', 'next', 'goto'])

const isEditing = ref(false)
const inputRef = ref(null)

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  inputRef.value?.select()
}

const handleSubmit = (e) => {
  const value = parseInt(e.target.value, 10)
  if (value >= 1 && value <= props.totalPages) {
    emit('goto', value)
  }
  isEditing.value = false
}

const handleBlur = (e) => {
  const value = parseInt(e.target.value, 10)
  if (value >= 1 && value <= props.totalPages && value !== props.currentPage) {
    emit('goto', value)
  }
  isEditing.value = false
}
</script>

<style scoped>
.page-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-accent);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.page-input-form {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.page-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.page-display {
  min-width: 48px;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.page-display:hover {
  border-color: var(--color-accent);
}

.page-input {
  width: 60px;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.page-input::-webkit-inner-spin-button,
.page-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.page-total {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* Responsive */
@media (max-width: 480px) {
  .nav-btn span:not(.nav-icon) {
    display: none;
  }

  .page-navigation {
    gap: var(--spacing-md);
  }
}
</style>
