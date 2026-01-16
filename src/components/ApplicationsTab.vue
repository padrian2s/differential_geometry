<template>
  <div class="tab-content">
    <div v-if="!data || data.length === 0" class="empty-state">
      <div class="empty-icon">🌍</div>
      <h3>No Applications Yet</h3>
      <p>Real-world applications for this concept will be added soon.</p>
    </div>

    <div v-else class="applications-list">
      <div
        v-for="(app, index) in data"
        :key="index"
        class="application-card"
      >
        <div class="application-header">
          <span class="field-badge">{{ app.field }}</span>
          <h4 class="application-title">
            <span class="app-icon">{{ app.icon || '🔬' }}</span>
            {{ app.title }}
          </h4>
        </div>

        <p class="application-description">{{ app.description }}</p>

        <div v-if="app.examples?.length" class="application-examples">
          <h5>Examples</h5>
          <ul>
            <li v-for="(ex, i) in app.examples" :key="i">{{ ex }}</li>
          </ul>
        </div>

        <div v-if="app.relevance" class="application-relevance">
          <strong>Why it matters:</strong> {{ app.relevance }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
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

.applications-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.application-card {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
}

.application-header {
  margin-bottom: var(--spacing-sm);
}

.field-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  background-color: rgba(66, 99, 235, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  display: inline-block;
}

.application-title {
  font-size: 1rem;
  font-weight: 600;
  margin: var(--spacing-xs) 0 0 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-icon {
  font-size: 1.25rem;
}

.application-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.application-examples {
  margin-bottom: var(--spacing-md);
}

.application-examples h5 {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.application-examples ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.application-examples li {
  font-size: 0.8125rem;
  padding: var(--spacing-xs) 0;
  padding-left: var(--spacing-md);
  position: relative;
  color: var(--color-text-secondary);
}

.application-examples li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-accent);
}

.application-relevance {
  font-size: 0.8125rem;
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-accent);
  color: var(--color-text-secondary);
}

.application-relevance strong {
  color: var(--color-text-primary);
}
</style>
