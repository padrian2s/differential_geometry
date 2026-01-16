<template>
  <div class="tab-content">
    <div v-if="!data || !data.diagrams?.length" class="empty-state">
      <div class="empty-icon">✋</div>
      <h3>No Interactive Diagrams Yet</h3>
      <p>Click-and-explore diagrams will be added progressively.</p>
    </div>

    <div v-else class="diagrams-list">
      <div
        v-for="(diagram, index) in data.diagrams"
        :key="index"
        class="diagram-container"
      >
        <div class="diagram-header">
          <h3>{{ diagram.title }}</h3>
          <span class="diagram-badge">Interactive</span>
        </div>

        <p v-if="diagram.description" class="diagram-description">
          {{ diagram.description }}
        </p>

        <div class="diagram-canvas" :ref="el => setCanvasRef(el, index)">
          <!-- D3.js diagram rendered here -->
        </div>

        <div v-if="diagram.instructions" class="diagram-instructions">
          <span class="instruction-icon">💡</span>
          {{ diagram.instructions }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const canvasRefs = ref({})
const animationIds = ref([])

const setCanvasRef = (el, index) => {
  if (el) {
    canvasRefs.value[index] = el
  }
}

const renderDiagram = (container, diagram, index) => {
  if (!container) return

  d3.select(container).selectAll('*').remove()

  const width = container.clientWidth || 300
  const height = 250

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)

  switch (diagram.type) {
    case 'vector-field':
      renderVectorField(svg, width, height, diagram.config)
      break
    case 'curve':
      animationIds.value[index] = renderCurve(svg, width, height, diagram.config)
      break
    case 'manifold':
      renderManifold(svg, width, height, diagram.config)
      break
    default:
      renderPlaceholder(svg, width, height)
  }
}

const renderVectorField = (svg, width, height, config = {}) => {
  const gridSize = config.gridSize || 25
  const scale = config.scale || 12

  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#4263eb')

  for (let x = gridSize; x < width; x += gridSize) {
    for (let y = gridSize; y < height; y += gridSize) {
      const nx = (x - width / 2) / 100
      const ny = (y - height / 2) / 100
      const vx = -ny
      const vy = nx
      const mag = Math.sqrt(vx * vx + vy * vy)

      if (mag > 0.01) {
        svg.append('line')
          .attr('x1', x)
          .attr('y1', y)
          .attr('x2', x + vx * scale)
          .attr('y2', y + vy * scale)
          .attr('stroke', '#4263eb')
          .attr('stroke-width', 1.5)
          .attr('marker-end', 'url(#arrowhead)')
          .attr('opacity', 0.7)
          .style('cursor', 'pointer')
          .on('mouseover', function() {
            d3.select(this).attr('stroke', '#364fc7').attr('stroke-width', 2.5).attr('opacity', 1)
          })
          .on('mouseout', function() {
            d3.select(this).attr('stroke', '#4263eb').attr('stroke-width', 1.5).attr('opacity', 0.7)
          })
      }
    }
  }
}

const renderCurve = (svg, width, height, config = {}) => {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 3

  const points = []
  const numPoints = 100

  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI
    const x = centerX + radius * Math.cos(t)
    const y = centerY + radius * Math.sin(t) * Math.cos(t * 2)
    points.push([x, y])
  }

  const line = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveBasisClosed)

  svg.append('path')
    .datum(points)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#40c057')
    .attr('stroke-width', 3)

  svg.append('defs').append('marker')
    .attr('id', 'tangent-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#fab005')

  const point = svg.append('circle')
    .attr('cx', points[0][0])
    .attr('cy', points[0][1])
    .attr('r', 8)
    .attr('fill', '#4263eb')

  const tangent = svg.append('line')
    .attr('x1', points[0][0])
    .attr('y1', points[0][1])
    .attr('x2', points[0][0] + 30)
    .attr('y2', points[0][1])
    .attr('stroke', '#fab005')
    .attr('stroke-width', 2.5)
    .attr('marker-end', 'url(#tangent-arrow)')

  let t = 0
  const animate = () => {
    t = (t + 0.004) % 1
    const idx = Math.floor(t * numPoints)
    const nextIdx = (idx + 1) % numPoints

    const px = points[idx][0]
    const py = points[idx][1]
    const dx = points[nextIdx][0] - px
    const dy = points[nextIdx][1] - py
    const mag = Math.sqrt(dx * dx + dy * dy)

    point.attr('cx', px).attr('cy', py)
    tangent
      .attr('x1', px)
      .attr('y1', py)
      .attr('x2', px + (dx / mag) * 40)
      .attr('y2', py + (dy / mag) * 40)

    return requestAnimationFrame(animate)
  }

  return requestAnimationFrame(animate)
}

const renderManifold = (svg, width, height, config = {}) => {
  const centerX = width / 2
  const centerY = height / 2
  const a = 50
  const b = 25

  for (let u = 0; u <= 2 * Math.PI; u += 0.15) {
    for (let v = 0; v <= 2 * Math.PI; v += 0.4) {
      const x = centerX + (a + b * Math.cos(v)) * Math.cos(u)
      const y = centerY + (a + b * Math.cos(v)) * Math.sin(u) * 0.5 + b * Math.sin(v) * 0.5

      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 2.5)
        .attr('fill', d3.interpolateViridis(u / (2 * Math.PI)))
        .attr('opacity', 0.8)
    }
  }

  for (let u = 0; u <= 2 * Math.PI; u += Math.PI / 4) {
    const linePoints = []
    for (let v = 0; v <= 2 * Math.PI; v += 0.1) {
      const x = centerX + (a + b * Math.cos(v)) * Math.cos(u)
      const y = centerY + (a + b * Math.cos(v)) * Math.sin(u) * 0.5 + b * Math.sin(v) * 0.5
      linePoints.push([x, y])
    }

    const line = d3.line().curve(d3.curveBasisClosed)
    svg.append('path')
      .datum(linePoints)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.2)')
      .attr('stroke-width', 1)
  }
}

const renderPlaceholder = (svg, width, height) => {
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#6c757d')
    .text('Interactive diagram')
}

const renderAllDiagrams = async () => {
  await nextTick()
  if (props.data?.diagrams) {
    props.data.diagrams.forEach((diagram, index) => {
      const container = canvasRefs.value[index]
      if (container) {
        renderDiagram(container, diagram, index)
      }
    })
  }
}

const cleanup = () => {
  animationIds.value.forEach(id => {
    if (id) cancelAnimationFrame(id)
  })
  animationIds.value = []
}

onMounted(() => {
  renderAllDiagrams()
})

onUnmounted(() => {
  cleanup()
})

watch(() => props.data, () => {
  cleanup()
  renderAllDiagrams()
}, { deep: true })
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

.diagrams-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.diagram-container {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.diagram-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
}

.diagram-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.diagram-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-success);
  background-color: rgba(64, 192, 87, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.diagram-description {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin: 0;
  border-bottom: 1px solid var(--color-border);
}

.diagram-canvas {
  min-height: 250px;
  background-color: var(--color-bg-primary);
}

.diagram-instructions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-tertiary);
  border-top: 1px solid var(--color-border);
}

.instruction-icon {
  font-size: 1rem;
}
</style>
