<template>
  <div class="enhancement-panel" :class="{ fullscreen: isFullscreen }">
    <div class="panel-header">
      <div class="panel-header-content">
        <h2>Enhancements</h2>
        <span v-if="chapter" class="section-badge">{{ chapter }}</span>
      </div>
      <button class="fullscreen-toggle" @click="isFullscreen = !isFullscreen" :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
        {{ isFullscreen ? '✕' : '⛶' }}
      </button>
    </div>

    <div class="panel-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['panel-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div class="panel-content">
      <div v-if="!pageData" class="no-data">
        <div class="no-data-icon">📚</div>
        <h3>No Enhancements Yet</h3>
        <p>Enhancement content for page {{ page }} will be added progressively.</p>
      </div>

      <template v-else>
        <ExamplesTab
          v-if="activeTab === 'examples'"
          :data="pageData.examples"
        />
        <SimulatorTab
          v-if="activeTab === 'simulator'"
          :data="pageData.simulator"
        />
        <ApplicationsTab
          v-if="activeTab === 'applications'"
          :data="pageData.applications"
        />
        <LearningTab
          v-if="activeTab === 'learning'"
          :data="pageData.learning"
        />
        <InteractiveTab
          v-if="activeTab === 'interactive'"
          :data="pageData.interactive"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExamplesTab from './ExamplesTab.vue'
import SimulatorTab from './SimulatorTab.vue'
import ApplicationsTab from './ApplicationsTab.vue'
import LearningTab from './LearningTab.vue'
import InteractiveTab from './InteractiveTab.vue'

defineProps({
  pageData: {
    type: Object,
    default: null
  },
  page: {
    type: Number,
    required: true
  },
  chapter: {
    type: String,
    default: ''
  }
})

const tabs = [
  { id: 'examples', label: 'Examples', icon: '📝' },
  { id: 'simulator', label: 'Simulator', icon: '🎮' },
  { id: 'applications', label: 'Applications', icon: '🌍' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'interactive', label: 'Interactive', icon: '✋' }
]

const activeTab = ref('examples')
const isFullscreen = ref(false)
</script>

<style scoped>
.enhancement-panel {
  width: var(--panel-width);
  min-width: var(--panel-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
  border-left: 1px solid var(--color-border);
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.panel-header-content {
  flex: 1;
  min-width: 0;
}

.panel-header h2 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.section-badge {
  font-size: 0.75rem;
  color: var(--color-accent);
  background-color: rgba(66, 99, 235, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  display: inline-block;
}

.fullscreen-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1rem;
}

.fullscreen-toggle:hover {
  background-color: var(--color-accent);
  color: white;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--spacing-sm);
  gap: var(--spacing-xs);
  overflow-x: auto;
}

.panel-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.panel-tab:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
}

.panel-tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.tab-icon {
  font-size: 1rem;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--spacing-xl);
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.no-data h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.no-data p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .enhancement-panel {
    width: 100%;
    min-width: auto;
    max-height: 50vh;
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}

@media (max-width: 768px) {
  .enhancement-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60vh;
    z-index: 100;
  }

  .tab-label {
    display: none;
  }

  .panel-tab {
    padding: var(--spacing-sm);
  }

  .tab-icon {
    font-size: 1.25rem;
  }
}

/* Fullscreen mode */
.enhancement-panel.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  min-width: 100%;
  height: 100vh;
  max-height: 100vh;
  z-index: 1000;
  border: none;
  border-radius: 0;
}

.enhancement-panel.fullscreen .panel-header {
  padding: var(--spacing-lg);
}

.enhancement-panel.fullscreen .panel-header h2 {
  font-size: 1.125rem;
}

.enhancement-panel.fullscreen .panel-content {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.enhancement-panel.fullscreen .panel-tabs {
  padding: 0 var(--spacing-lg);
  justify-content: center;
}

.enhancement-panel.fullscreen .panel-tab {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.9375rem;
}

.enhancement-panel.fullscreen .tab-label {
  display: inline;
}
</style>
