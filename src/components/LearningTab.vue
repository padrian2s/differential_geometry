<template>
  <div class="tab-content">
    <div v-if="!data" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>No Learning Content Yet</h3>
      <p>Learning resources for this page will be added soon.</p>
    </div>

    <div v-else class="learning-content">
      <!-- Prerequisites -->
      <section v-if="data.prerequisites?.length" class="section prerequisites">
        <h3>Prerequisites</h3>
        <div class="concept-list">
          <div
            v-for="(prereq, index) in data.prerequisites"
            :key="index"
            class="concept-card"
          >
            <span class="concept-icon">📖</span>
            <span class="concept-name">{{ prereq }}</span>
          </div>
        </div>
      </section>

      <!-- Key Concepts -->
      <section v-if="data.concepts?.length" class="section concepts">
        <h3>Key Concepts</h3>
        <div class="concept-list">
          <div
            v-for="(concept, index) in data.concepts"
            :key="index"
            class="concept-card current"
          >
            <div class="concept-info">
              <span class="concept-name">{{ concept.name }}</span>
              <p class="concept-description">{{ concept.definition }}</p>
              <div v-if="concept.formula" class="concept-formula">
                <MathFormula :formula="concept.formula" :block="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Exercises -->
      <section v-if="data.exercises?.length" class="section exercises">
        <h3>Practice Exercises</h3>
        <div class="exercise-list">
          <div
            v-for="(exercise, index) in data.exercises"
            :key="index"
            class="exercise-card"
          >
            <div class="exercise-header">
              <span class="exercise-number">Exercise {{ index + 1 }}</span>
              <span class="exercise-difficulty" :class="exercise.difficulty">
                {{ exercise.difficulty }}
              </span>
            </div>
            <p class="exercise-question">{{ exercise.question }}</p>
            <details v-if="exercise.hint" class="exercise-hint">
              <summary>Show Hint</summary>
              <p>{{ exercise.hint }}</p>
            </details>
          </div>
        </div>
      </section>

      <!-- Further Reading -->
      <section v-if="data.furtherReading?.length" class="section further-reading">
        <h3>Further Reading</h3>
        <ul class="reading-list">
          <li v-for="(item, index) in data.furtherReading" :key="index">
            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener">
              {{ item.title }}
            </a>
            <span v-else>{{ item.title }}</span>
            <span v-if="item.author" class="author">— {{ item.author }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import MathFormula from './MathFormula.vue'

defineProps({
  data: {
    type: Object,
    default: null
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

.learning-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
}

/* Concepts */
.concept-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.concept-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.concept-card.current {
  border-color: var(--color-accent);
  background-color: rgba(66, 99, 235, 0.05);
}

.concept-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.concept-info {
  flex: 1;
}

.concept-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.concept-description {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: 1.5;
}

.concept-formula {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

/* Exercises */
.exercise-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.exercise-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.exercise-number {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-accent);
}

.exercise-difficulty {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.exercise-difficulty.easy {
  background-color: rgba(64, 192, 87, 0.1);
  color: var(--color-success);
}

.exercise-difficulty.medium {
  background-color: rgba(250, 176, 5, 0.1);
  color: var(--color-warning);
}

.exercise-difficulty.hard {
  background-color: rgba(250, 82, 82, 0.1);
  color: var(--color-error);
}

.exercise-question {
  font-size: 0.875rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.exercise-hint {
  font-size: 0.8125rem;
}

.exercise-hint summary {
  cursor: pointer;
  color: var(--color-accent);
  font-weight: 500;
}

.exercise-hint p {
  margin-top: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
}

/* Further Reading */
.reading-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reading-list li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}

.reading-list li:last-child {
  border-bottom: none;
}

.reading-list a {
  color: var(--color-accent);
  text-decoration: none;
}

.reading-list a:hover {
  text-decoration: underline;
}

.author {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}
</style>
