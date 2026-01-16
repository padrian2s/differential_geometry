# Not Yet Implemented

This document outlines features that are stubbed, partially implemented, or not yet built for the Interactive Differential Geometry Platform.

---

## Content (High Priority)

### Page Enhancement Data
- **Status:** Only `page_001.json` exists as a sample
- **Needed:** 517 additional JSON files (`page_002.json` through `page_518.json`)
- **Work required:**
  - Analyze each book page
  - Create relevant examples, applications, exercises
  - Design appropriate 3D visualizations
  - Build interactive diagrams specific to each concept

### Chapter Mapping
- **Status:** ✅ Updated with accurate page ranges
- **Book:** Complex Analytic and Differential Geometry by Jean-Pierre Demailly
- **Chapters:**
  - Front Matter: 1-6
  - Chapter I (Basic Concepts): 7-72
  - Chapter II (Coherent Sheaves): 73-147
  - Chapter III (Positive Currents): 148-252
  - Chapter IV (Sheaf Cohomology): 253-327
  - Chapter V (Hermitian Vector Bundles): 328-377
  - Chapter VI (Hodge Theory): 378-432
  - Chapter VII (Vanishing Theorems): 433-479
  - Chapter VIII (L² Estimates): 480-518

### Mathematical Notation
- **Status:** ✅ Implemented (KaTeX)
- **Completed:** MathFormula component with KaTeX integration
- **Working in:**
  - Examples tab
  - Learning tab

---

## 3D Simulator (SimulatorTab.vue)

### Geometry Types
- **Implemented:** sphere, torus, klein-bottle, mobius, helicoid, catenoid, enneper, complex-plane, paraboloid, hyperboloid, saddle, helix, curve (with variants: trefoil, lissajous)
- **Not implemented:**
  - Geodesics on surfaces
  - Gaussian curvature visualization
  - Principal curvature directions
  - Parallel transport animation
  - Ruled surfaces
  - Developable surfaces

### Interactivity
- **Implemented:**
  - ✅ OrbitControls (mouse drag to rotate, scroll to zoom, right-click to pan)
- **Not implemented:**
  - Touch controls for mobile (partially supported via OrbitControls)
  - Parameter sliders for parametric surfaces
  - Real-time surface deformation
  - Point selection on surface
  - Tangent plane visualization at selected point
  - Normal vector display
  - Curvature color mapping

### Performance
- **Not implemented:**
  - WebGL context loss handling
  - Responsive canvas resize
  - Level-of-detail for complex geometries

---

## Interactive Diagrams (InteractiveTab.vue)

### Diagram Types
- **Implemented:** vector-field, curve (with tangent), manifold (torus projection)
- **Not implemented:**
  - Coordinate charts and atlases
  - Stereographic projection
  - Geodesic paths
  - Parallel transport along curves
  - Christoffel symbols visualization
  - Frenet-Serret frame animation
  - Curvature/torsion graphs
  - First/Second fundamental form visualization
  - Gauss map animation
  - Shape operator visualization

### Interactivity
- **Not implemented:**
  - Click-to-place points
  - Drag control points
  - Parameter input fields
  - Animation speed control
  - Pause/play/step controls
  - Export diagram as SVG/PNG

---

## Navigation & UX

### Search
- **Status:** Not implemented
- **Needed:**
  - Full-text search across page content
  - Jump to page by concept name
  - Search within current chapter

### Table of Contents
- **Status:** Chapter dropdown exists but no detailed TOC
- **Needed:**
  - Expandable section tree
  - Sub-section navigation
  - Visual page thumbnails

### Progress Tracking
- **Status:** Not implemented
- **Needed:**
  - Track pages viewed
  - Mark pages as "understood"
  - Visual progress bar per chapter
  - Overall completion percentage

### Reading History
- **Status:** Only current page saved
- **Needed:**
  - Recently viewed pages
  - Reading sessions timeline
  - Time spent per page

---

## Mobile & Accessibility

### Responsive Design
- **Implemented:** Basic breakpoint at 1024px
- **Not implemented:**
  - Swipe gestures for page navigation
  - Pinch-to-zoom on images
  - Bottom sheet for enhancement panel on mobile
  - Landscape/portrait optimization

### Accessibility
- **Not implemented:**
  - ARIA labels
  - Screen reader support
  - Keyboard focus management
  - High contrast mode
  - Reduced motion preference
  - Alt text for page images (OCR-based)

---

## Export & Sharing

### Not implemented:
- Export notes/bookmarks
- Share specific page with URL hash
- Print-friendly view
- PDF export of notes
- Integration with note-taking apps

---

## Backend Integration (Future)

### Not in current scope but potential features:
- User accounts for cross-device sync
- Community annotations
- Discussion/comments per page
- Spaced repetition for exercises
- AI-powered concept explanations
- Quiz/assessment mode

---

## Technical Debt

### Code Quality
- Large bundle size (~590KB) due to Three.js + D3.js
  - Consider dynamic imports
  - Tree-shake unused D3 modules
- No unit tests
- No E2E tests
- No TypeScript (plain JavaScript)

### Build Configuration
- No PWA support (offline mode)
- No service worker
- No image optimization for page PNGs
- No lazy loading for page images

---

## Priority Order for Implementation

1. **Mathematical notation** (MathJax/KaTeX) - enables proper formula display
2. **OrbitControls for 3D** - essential for geometry exploration
3. **Content for key pages** (Chapter 1 first) - provides immediate value
4. **Verify chapter mapping** - improves navigation accuracy
5. **Mobile touch controls** - expands accessibility
6. **More geometry types** - enriches learning experience
7. **Search functionality** - helps find specific topics
8. **Progress tracking** - motivates completion

---

*Last updated: January 2026*
