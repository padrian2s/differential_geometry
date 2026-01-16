# Execution Plan

Sequential task list for Claude to implement. Execute in order, verify each step before proceeding.

---

## Phase 1: Foundation

### 1.1 Install KaTeX
```bash
npm install katex
```

### 1.2 Create MathFormula Component
Create `src/components/MathFormula.vue`:
- Accept `formula` prop (string, LaTeX)
- Accept `block` prop (boolean, default false)
- Use KaTeX `renderToString()` with `v-html`
- Import KaTeX CSS

### 1.3 Update ExamplesTab
- Import MathFormula component
- Replace `<code>{{ example.formula }}</code>` with `<MathFormula :formula="example.formula" />`

### 1.4 Update LearningTab
- Import MathFormula component
- Wrap any formula content in exercises/concepts with MathFormula

### 1.5 Add OrbitControls to SimulatorTab
- Import: `import { OrbitControls } from 'three/addons/controls/OrbitControls.js'`
- Create controls after camera: `controls = new OrbitControls(camera, renderer.domElement)`
- Set `controls.enableDamping = true`
- Call `controls.update()` in animate loop
- Remove rotation/zoom sliders (controls replace them)
- Add resize handler for renderer

### 1.6 Verify Phase 1
- Run `npm run build` - no errors
- Run `npm run dev`
- Test page 1: formula renders, 3D can be rotated with mouse

---

## Phase 2: Chapter 1 Content (Curves)

### 2.1 Update chapters.json
Review images and set accurate page ranges. Current structure to verify:
```json
{
  "chapters": [
    { "id": "preface", "title": "Preface", "startPage": 1, "endPage": ? },
    { "id": "ch1", "title": "Chapter 1: Curves", "startPage": ?, "endPage": ? },
    ...
  ]
}
```

### 2.2 Create Curve Simulator Utility
Create `src/utils/curveGeometry.js`:
```javascript
export function createCurveGeometry(curveFunction, tMin, tMax, segments)
export function createFrenetFrame(curve, t) // returns { T, N, B, position }
export function createTubeAroundCurve(curve, radius, segments)
```

### 2.3 Create Page Content Files
For each page in Chapter 1, create `src/data/pages/page_XXX.json`:

Required structure:
```json
{
  "page": <number>,
  "chapter": "Curves",
  "examples": [...],
  "simulator": { "type": "curve", "config": {...} },
  "applications": [...],
  "learning": { "prerequisites": [], "concepts": [], "exercises": [] },
  "interactive": { "diagrams": [...] }
}
```

Content topics by page range (adjust after 2.1):
- Parametrized curves definition
- Tangent vector, velocity
- Arc length
- Reparametrization
- Curvature
- Normal vector, Frenet frame
- Torsion
- Fundamental theorem of curves

### 2.4 Extend SimulatorTab Geometry Types
Add to switch statement in `createGeometry()`:
```javascript
case 'curve':
  geometry = createCurveFromConfig(props.data.config)
  break
case 'helix':
  // parametric helix
case 'frenet':
  // curve with T, N, B vectors displayed
```

### 2.5 Extend InteractiveTab Diagram Types
Add to `renderDiagram()` switch:
```javascript
case 'curvature-graph':
  // synchronized curvature κ(t) graph
case 'osculating-circle':
  // circle of curvature at point
case 'frenet-2d':
  // 2D curve with frame vectors
```

### 2.6 Verify Phase 2
- All Chapter 1 pages have JSON files
- Navigate through Chapter 1, each page shows relevant content
- Simulators render curves correctly
- Interactive diagrams animate

---

## Phase 3: Surface Geometries

### 3.1 Create Surface Utility
Create `src/utils/surfaceGeometry.js`:
```javascript
export function createParametricSurface(uFunc, vFunc, uRange, vRange, segments)
export function createSurfaceWithNormals(surface)
export function computeGaussianCurvature(surface, u, v)
export function computeMeanCurvature(surface, u, v)
```

### 3.2 Add Surface Types to SimulatorTab
Implement in createGeometry():
- `sphere-coords` - sphere with lat/long lines
- `torus-coords` - torus with coordinate curves
- `paraboloid`
- `hyperboloid-one`
- `hyperboloid-two`
- `saddle`
- `mobius-strip`
- `catenoid`
- `helicoid`

### 3.3 Create Tangent Plane Visualization
Add to SimulatorTab:
- Raycaster for click detection on surface
- On click: display tangent plane at point
- Show normal vector
- Display u,v coordinates

### 3.4 Create Curvature Color Map
Add shader material option:
- Color vertices by Gaussian curvature
- Color scale: blue (negative) → white (zero) → red (positive)
- Toggle button in controls

### 3.5 Verify Phase 3
- All surface types render correctly
- Click shows tangent plane
- Curvature coloring works

---

## Phase 4: Remaining Chapter Content

### 4.1 Chapter 2: Regular Surfaces
Create page JSON files for Chapter 2 pages.
Simulator configs: surface patches, tangent planes, first fundamental form.

### 4.2 Chapter 3: Gauss Map
Create page JSON files.
Simulator configs: Gauss map animation, principal directions, curvature maps.

### 4.3 Chapter 4: Intrinsic Geometry
Create page JSON files.
Simulator configs: parallel transport, geodesics, Gauss-Bonnet.

### 4.4 Chapter 5: Global Differential Geometry
Create page JSON files.
Simulator configs: topological surfaces, Euler characteristic.

### 4.5 Appendix/Index
Create reference pages with formula summaries.

---

## Phase 5: UX Features

### 5.1 Search
```bash
npm install fuse.js
```

Create `src/composables/useSearch.js`:
- Build index from all page JSON on init
- Fuzzy search function
- Return matching pages with snippets

Create `src/components/SearchModal.vue`:
- Trigger with Ctrl+K / Cmd+K
- Input field with results list
- Click result navigates to page

Add to App.vue:
- Import SearchModal
- Add keyboard listener for shortcut

### 5.2 Progress Tracking
Create `src/composables/useProgress.js`:
- Track `viewedPages` Set in localStorage
- `markViewed(page)` - called on page change
- `getChapterProgress(chapterId)` - returns percentage

Update Navigation.vue:
- Show progress dots/bar per chapter
- Visual indicator for viewed pages

### 5.3 Mobile Touch
Update PageViewer.vue:
- Add touch event handlers
- Swipe left/right for prev/next page
- Pinch-to-zoom with touch

Update App.vue:
- Detect mobile viewport
- Bottom sheet layout for enhancement panel on mobile

Update SimulatorTab.vue:
- OrbitControls already supports touch
- Ensure canvas is touch-responsive

### 5.4 Accessibility
Update all components:
- Add `aria-label` to buttons
- Add `role` attributes where needed
- Ensure focus visible styles
- Add `aria-live` region for page change announcements

Check `prefers-reduced-motion`:
- Disable auto-rotation in SimulatorTab
- Disable animations in InteractiveTab

---

## Phase 6: Performance & Polish

### 6.1 Code Splitting
Update imports to dynamic:
```javascript
// In SimulatorTab.vue
const THREE = await import('three')
const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

// In InteractiveTab.vue
const d3 = await import('d3')
```

### 6.2 Image Lazy Loading
Update PageViewer.vue:
- Use Intersection Observer
- Load image only when container visible
- Show placeholder/skeleton while loading

### 6.3 Service Worker
```bash
npm install vite-plugin-pwa -D
```

Update vite.config.js:
```javascript
import { VitePWA } from 'vite-plugin-pwa'
plugins: [vue(), VitePWA({ ... })]
```

### 6.4 Final Verification
- `npm run build` succeeds
- Lighthouse score > 90 performance
- All pages have content
- Works offline after first load
- Mobile layout correct

---

## Execution Notes

- After completing each numbered task, verify before proceeding
- If a task fails, debug and fix before continuing
- Create git commits at phase boundaries
- Run `npm run build` after any dependency changes
- Test in browser after component changes
