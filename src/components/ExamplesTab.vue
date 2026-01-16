<template>
  <div class="tab-content">
    <div v-if="!data || data.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>No Examples Yet</h3>
      <p>Practical examples for this page will be added soon.</p>
    </div>

    <div v-else class="examples-list">
      <div
        v-for="(example, index) in data"
        :key="index"
        class="example-card"
        :class="{ expanded: expandedIndex === index }"
      >
        <button class="example-header" @click="toggleExample(index)">
          <div class="example-header-content">
            <h4 class="example-title">{{ example.title }}</h4>
            <p class="example-description">{{ example.content }}</p>
          </div>
          <span class="expand-icon" :class="{ expanded: expandedIndex === index }">
            ▼
          </span>
        </button>

        <div class="example-body" :class="{ show: expandedIndex === index }">
          <div v-if="example.formula" class="example-math">
            <div class="math-header">Formula</div>
            <div class="math-content">
              <MathFormula :formula="example.formula" :block="true" />
            </div>
          </div>

          <div v-if="example.details" class="example-details">
            <div v-for="(detail, i) in example.details" :key="i" class="detail-item">
              {{ detail }}
            </div>
          </div>

          <div v-if="example.visual" class="example-visual">
            <img :src="example.visual" :alt="example.title" />
          </div>
        </div>
      </div>

      <div class="examples-footer">
        <p class="examples-count">{{ data.length }} example{{ data.length !== 1 ? 's' : '' }} available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MathFormula from './MathFormula.vue'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const expandedIndex = ref(0)

const toggleExample = (index) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}
</script>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  color: var(--color-text-muted);
  margin: 0;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.example-card {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.example-card:hover {
  border-color: var(--color-accent);
}

.example-card.expanded {
  border-color: var(--color-accent);
}

.example-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: var(--spacing-md);
}

.example-header:hover {
  background-color: var(--color-bg-tertiary);
}

.example-header-content {
  flex: 1;
  min-width: 0;
}

.example-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.example-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  font-size: 0.75rem;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.example-header:hover .expand-icon {
  background-color: var(--color-accent);
  color: white;
}

.example-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.example-body.show {
  max-height: 2000px;
  transition: max-height 0.5s ease-in;
}

.example-math {
  margin: 0 var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.math-header {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.math-content {
  padding: var(--spacing-md);
  background-color: var(--color-bg-primary);
  font-family: var(--font-mono);
  overflow-x: auto;
}

.math-content code {
  background: none;
  padding: 0;
  color: var(--color-accent);
}

.example-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin: 0 var(--spacing-md) var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.detail-item {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.example-visual {
  margin: 0 var(--spacing-md) var(--spacing-md);
}

.example-visual img {
  max-width: 100%;
  border-radius: var(--radius-md);
}

.examples-footer {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-align: center;
}

.examples-count {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0;
}
</style>
