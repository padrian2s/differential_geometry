<template>
  <span v-if="!block" class="math-inline" v-html="renderedFormula"></span>
  <div v-else class="math-block" v-html="renderedFormula"></div>
</template>

<script setup>
import { computed } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps({
  formula: {
    type: String,
    required: true
  },
  block: {
    type: Boolean,
    default: false
  }
})

const renderedFormula = computed(() => {
  try {
    return katex.renderToString(props.formula, {
      throwOnError: false,
      displayMode: props.block,
      trust: true
    })
  } catch (e) {
    console.warn('KaTeX render error:', e)
    return `<span class="math-error">${props.formula}</span>`
  }
})
</script>

<style scoped>
.math-inline {
  display: inline;
}

.math-block {
  display: block;
  text-align: center;
  margin: var(--spacing-md) 0;
  overflow-x: auto;
}

.math-error {
  color: var(--color-error);
  font-family: var(--font-mono);
}
</style>
