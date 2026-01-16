<template>
  <div class="tab-content">
    <div v-if="!data" class="empty-state">
      <div class="empty-icon">🎮</div>
      <h3>No Simulator Yet</h3>
      <p>Interactive 3D visualizations will be added progressively.</p>
    </div>

    <div v-else class="simulator-wrapper">
      <div class="simulator-container">
        <div class="simulator-header">
          <h3>{{ data.title || 'Geometric Surface' }}</h3>
          <span class="simulator-badge">Interactive</span>
        </div>

        <div v-if="data.description" class="simulator-description">
          {{ data.description }}
        </div>

        <div class="simulator-canvas" ref="canvasContainer">
          <div v-if="!initialized" class="simulator-loading">
            <div class="loading-spinner"></div>
            <span>Loading 3D view...</span>
          </div>
        </div>
      </div>

      <div class="simulator-controls">
        <button class="btn btn-secondary" @click="resetView">
          ⟲ Reset View
        </button>
        <button class="btn btn-secondary" @click="toggleWireframe">
          {{ wireframe ? '◼ Solid' : '▦ Wireframe' }}
        </button>
      </div>

      <div class="simulator-note">
        <strong>Tip:</strong> Drag to rotate, scroll to zoom, right-click to pan.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getSurfaceByName, createParametricSurface as createParamSurface } from '../utils/complexGeometry.js'

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const canvasContainer = ref(null)
const initialized = ref(false)
const wireframe = ref(false)

let scene, camera, renderer, mesh, controls, animationId

const initThreeJS = () => {
  if (!canvasContainer.value || !props.data) return

  const container = canvasContainer.value
  const width = container.clientWidth
  const height = container.clientHeight || 300

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf8f9fa)

  // Camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 2.5

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Create geometry
  createGeometry()

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
  backLight.position.set(-1, -1, -1)
  scene.add(backLight)

  initialized.value = true
  animate()

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    if (!container || !renderer || !camera) return
    const w = container.clientWidth
    const h = container.clientHeight || 300
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  })
  resizeObserver.observe(container)
}

const createGeometry = () => {
  const type = props.data?.type || 'sphere'
  let geometry

  // Try to get geometry from utility presets first
  const knownTypes = ['sphere', 'torus', 'klein-bottle', 'mobius', 'helicoid', 'catenoid',
                      'enneper', 'complex-plane', 'paraboloid', 'hyperboloid', 'saddle']

  if (knownTypes.includes(type)) {
    geometry = getSurfaceByName(type)
  } else {
    // Fallback to legacy geometry creation
    switch (type) {
      case 'surface':
        geometry = createParametricSurface(50, 50)
        break
      case 'helix':
        geometry = createHelixGeometry()
        break
      case 'curve':
        geometry = createCurveGeometry()
        break
      default:
        geometry = getSurfaceByName('sphere')
    }
  }

  const color = props.data?.color || 0x4263eb
  const material = new THREE.MeshPhongMaterial({
    color: color,
    wireframe: wireframe.value,
    side: THREE.DoubleSide,
    flatShading: false
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

const createCurveGeometry = () => {
  // Create a 3D parametric curve
  const config = props.data?.config || {}
  const curveType = config.curveType || 'helix'
  const points = []

  for (let t = 0; t < 4 * Math.PI; t += 0.05) {
    let x, y, z
    switch (curveType) {
      case 'trefoil':
        x = Math.sin(t) + 2 * Math.sin(2 * t)
        y = Math.cos(t) - 2 * Math.cos(2 * t)
        z = -Math.sin(3 * t)
        break
      case 'lissajous':
        x = Math.sin(3 * t)
        y = Math.sin(4 * t)
        z = Math.sin(5 * t)
        break
      default: // helix
        x = Math.cos(t)
        y = t / 4 - 1
        z = Math.sin(t)
    }
    points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5))
  }

  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 200, 0.05, 16, false)
}

const createParametricSurface = (slices, stacks) => {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const indices = []

  for (let i = 0; i <= slices; i++) {
    const u = i / slices
    for (let j = 0; j <= stacks; j++) {
      const v = j / stacks
      const point = surfaceFunction(u, v)
      vertices.push(point.x, point.y, point.z)
    }
  }

  for (let i = 0; i < slices; i++) {
    for (let j = 0; j < stacks; j++) {
      const a = i * (stacks + 1) + j
      const b = a + stacks + 1
      indices.push(a, b, a + 1)
      indices.push(b, b + 1, a + 1)
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

const surfaceFunction = (u, v) => {
  const uu = u * Math.PI * 2
  const vv = v * Math.PI * 2 - Math.PI

  const x = Math.cos(uu) * (2 + Math.cos(vv))
  const y = Math.sin(uu) * (2 + Math.cos(vv))
  const z = Math.sin(vv)

  return { x: x * 0.5, y: y * 0.5, z: z * 0.5 }
}

const createHelixGeometry = () => {
  const points = []
  for (let t = 0; t < 4 * Math.PI; t += 0.1) {
    points.push(new THREE.Vector3(Math.cos(t), t / 4 - 1, Math.sin(t)))
  }
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 100, 0.1, 16, false)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

const resetView = () => {
  if (camera && controls) {
    camera.position.set(0, 0, 2.5)
    controls.reset()
  }
}

const toggleWireframe = () => {
  wireframe.value = !wireframe.value
  if (mesh) {
    mesh.material.wireframe = wireframe.value
  }
}

const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
    if (canvasContainer.value && renderer.domElement) {
      canvasContainer.value.removeChild(renderer.domElement)
    }
  }
  if (mesh) {
    mesh.geometry.dispose()
    mesh.material.dispose()
  }
  initialized.value = false
}

onMounted(() => {
  if (props.data) {
    initThreeJS()
  }
})

onUnmounted(() => {
  cleanup()
})

watch(() => props.data, (newData) => {
  cleanup()
  wireframe.value = false
  if (newData) {
    setTimeout(initThreeJS, 100)
  }
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

.simulator-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.simulator-container {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.simulator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
}

.simulator-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.simulator-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-success);
  background-color: rgba(64, 192, 87, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.simulator-description {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

.simulator-canvas {
  min-height: 300px;
  position: relative;
}

.simulator-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.simulator-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.simulator-note {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.8125rem;
  background-color: rgba(66, 99, 235, 0.05);
  border-left: 3px solid var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--color-text-secondary);
}

.simulator-note strong {
  color: var(--color-accent);
}

@media (prefers-color-scheme: dark) {
  .simulator-canvas {
    background-color: var(--color-bg-primary);
  }
}
</style>
