/**
 * Complex Geometry Utilities
 * Provides functions for creating 3D visualizations of complex manifolds and surfaces
 */

import * as THREE from 'three'

/**
 * Create a parametric surface from a function (u,v) -> (x,y,z)
 * @param {Function} paramFunc - Function (u, v) => [x, y, z]
 * @param {number} uMin - Minimum u parameter
 * @param {number} uMax - Maximum u parameter
 * @param {number} vMin - Minimum v parameter
 * @param {number} vMax - Maximum v parameter
 * @param {number} uSegments - Number of u segments
 * @param {number} vSegments - Number of v segments
 * @returns {THREE.BufferGeometry}
 */
export function createParametricSurface(paramFunc, uMin, uMax, vMin, vMax, uSegments = 50, vSegments = 50) {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const indices = []
  const normals = []
  const uvs = []

  const du = (uMax - uMin) / uSegments
  const dv = (vMax - vMin) / vSegments

  // Generate vertices
  for (let i = 0; i <= uSegments; i++) {
    const u = uMin + i * du
    for (let j = 0; j <= vSegments; j++) {
      const v = vMin + j * dv
      const [x, y, z] = paramFunc(u, v)
      vertices.push(x, y, z)
      uvs.push(i / uSegments, j / vSegments)
    }
  }

  // Generate indices
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j
      const b = a + 1
      const c = a + (vSegments + 1)
      const d = c + 1
      indices.push(a, b, c)
      indices.push(b, d, c)
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

/**
 * Create a Riemann sphere (stereographic projection visualization)
 * @param {number} radius - Sphere radius
 * @param {number} segments - Number of segments
 * @returns {THREE.BufferGeometry}
 */
export function createRiemannSphere(radius = 1, segments = 64) {
  return new THREE.SphereGeometry(radius, segments, segments)
}

/**
 * Create a complex torus (product of two circles in complex space)
 * @param {number} R - Major radius
 * @param {number} r - Minor radius
 * @param {number} segments - Number of segments
 * @returns {THREE.BufferGeometry}
 */
export function createComplexTorus(R = 1, r = 0.4, segments = 64) {
  return new THREE.TorusGeometry(R, r, segments, segments)
}

/**
 * Create a surface visualization of |f(z)|² for a complex function
 * @param {Function} complexFunc - Function z => w (complex to complex)
 * @param {number} range - Range of real and imaginary parts
 * @param {number} segments - Grid segments
 * @returns {THREE.BufferGeometry}
 */
export function createComplexFunctionSurface(complexFunc, range = 2, segments = 50) {
  return createParametricSurface(
    (u, v) => {
      const z = { re: u, im: v }
      const w = complexFunc(z)
      const modulus = Math.sqrt(w.re * w.re + w.im * w.im)
      return [u, v, Math.min(modulus, range)] // Cap height for visualization
    },
    -range, range, -range, range, segments, segments
  )
}

/**
 * Create coordinate grid lines on a surface
 * @param {Function} paramFunc - Parametric function
 * @param {number} uMin - Min u
 * @param {number} uMax - Max u
 * @param {number} vMin - Min v
 * @param {number} vMax - Max v
 * @param {number} numLines - Number of grid lines in each direction
 * @returns {THREE.LineSegments}
 */
export function createCoordinateGrid(paramFunc, uMin, uMax, vMin, vMax, numLines = 10) {
  const points = []
  const segments = 50

  // U-lines (constant u, varying v)
  for (let i = 0; i <= numLines; i++) {
    const u = uMin + (i / numLines) * (uMax - uMin)
    for (let j = 0; j < segments; j++) {
      const v1 = vMin + (j / segments) * (vMax - vMin)
      const v2 = vMin + ((j + 1) / segments) * (vMax - vMin)
      const [x1, y1, z1] = paramFunc(u, v1)
      const [x2, y2, z2] = paramFunc(u, v2)
      points.push(x1, y1, z1, x2, y2, z2)
    }
  }

  // V-lines (constant v, varying u)
  for (let j = 0; j <= numLines; j++) {
    const v = vMin + (j / numLines) * (vMax - vMin)
    for (let i = 0; i < segments; i++) {
      const u1 = uMin + (i / segments) * (uMax - uMin)
      const u2 = uMin + ((i + 1) / segments) * (uMax - uMin)
      const [x1, y1, z1] = paramFunc(u1, v)
      const [x2, y2, z2] = paramFunc(u2, v)
      points.push(x1, y1, z1, x2, y2, z2)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x4488ff, opacity: 0.5, transparent: true }))
}

/**
 * Predefined surfaces for the simulator
 */
export const surfacePresets = {
  sphere: () => createRiemannSphere(1.5, 64),

  torus: () => createComplexTorus(1, 0.4, 64),

  'klein-bottle': () => {
    // Klein bottle immersion in 3D (with self-intersection)
    return createParametricSurface((u, v) => {
      const a = 2
      const x = (a + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v)) * Math.cos(u)
      const y = (a + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v)) * Math.sin(u)
      const z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v)
      return [x * 0.5, y * 0.5, z * 0.5]
    }, 0, 2 * Math.PI, 0, 2 * Math.PI, 50, 50)
  },

  mobius: () => {
    // Möbius strip
    return createParametricSurface((u, v) => {
      const x = (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u)
      const y = (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u)
      const z = v / 2 * Math.sin(u / 2)
      return [x, y, z]
    }, 0, 2 * Math.PI, -0.5, 0.5, 50, 10)
  },

  helicoid: () => {
    return createParametricSurface((u, v) => {
      return [u * Math.cos(v), u * Math.sin(v), v * 0.3]
    }, -1.5, 1.5, -Math.PI, Math.PI, 30, 50)
  },

  catenoid: () => {
    return createParametricSurface((u, v) => {
      const c = 0.5
      return [c * Math.cosh(v / c) * Math.cos(u), c * Math.cosh(v / c) * Math.sin(u), v]
    }, 0, 2 * Math.PI, -1, 1, 50, 30)
  },

  enneper: () => {
    // Enneper's minimal surface
    return createParametricSurface((u, v) => {
      const x = u - u * u * u / 3 + u * v * v
      const y = v - v * v * v / 3 + v * u * u
      const z = u * u - v * v
      return [x * 0.3, y * 0.3, z * 0.3]
    }, -1.5, 1.5, -1.5, 1.5, 40, 40)
  },

  'complex-plane': () => {
    // Visualization of |z|² as height
    return createParametricSurface((u, v) => {
      const height = Math.sqrt(u * u + v * v) * 0.3
      return [u, v, height]
    }, -2, 2, -2, 2, 40, 40)
  },

  paraboloid: () => {
    return createParametricSurface((u, v) => {
      const r = v
      const theta = u
      return [r * Math.cos(theta), r * Math.sin(theta), r * r * 0.5]
    }, 0, 2 * Math.PI, 0, 1.5, 50, 30)
  },

  hyperboloid: () => {
    return createParametricSurface((u, v) => {
      const a = 1, b = 1, c = 0.5
      return [a * Math.cosh(v) * Math.cos(u), b * Math.cosh(v) * Math.sin(u), c * Math.sinh(v)]
    }, 0, 2 * Math.PI, -1, 1, 50, 30)
  },

  saddle: () => {
    return createParametricSurface((u, v) => {
      return [u, v, u * u - v * v]
    }, -1.5, 1.5, -1.5, 1.5, 40, 40)
  }
}

/**
 * Get a surface geometry by name
 * @param {string} name - Surface name
 * @returns {THREE.BufferGeometry}
 */
export function getSurfaceByName(name) {
  const preset = surfacePresets[name]
  if (preset) {
    return preset()
  }
  console.warn(`Unknown surface type: ${name}, defaulting to sphere`)
  return surfacePresets.sphere()
}
