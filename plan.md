# LEGEND Browser MMORPG
# Performance Optimization & Code Refactoring Audit

You are the Principal Engine Programmer, Senior Graphics Engineer, Senior React Performance Engineer, and Three.js Optimization Specialist.

Your mission is NOT to add new gameplay features.

Your mission is to optimize the entire project so it becomes production-ready before additional world content is added.

The current prototype already experiences lag on hardware that should run it smoothly.

Find the root causes and fix them.

---

# Objective

Perform a complete optimization pass across the entire repository.

Think like an engine programmer working on a commercial MMORPG.

Do not assume any implementation is correct.

Profile, analyze, optimize, and refactor.

---

# Part 1 - Performance Audit

Inspect every subsystem.

Review:

- Rendering
- React
- React Three Fiber
- Three.js
- Rapier
- Zustand
- Socket.io
- Vite
- Scene Graph
- Camera
- Physics
- UI

Identify:

- unnecessary renders
- expensive hooks
- large allocations
- memory leaks
- duplicate updates
- excessive React state
- object creation every frame
- garbage collection pressure

---

# Part 2 - React Optimization

Review every component.

Check:

- unnecessary rerenders
- unstable props
- unstable callbacks
- missing memoization
- missing React.memo
- expensive computations
- context overuse

Use:

- React.memo
- useMemo
- useCallback

only where beneficial.

Do not over-optimize.

---

# Part 3 - React Three Fiber

Review every frame update.

Look for:

- object creation inside useFrame
- new Vector3 every frame
- new Euler every frame
- new Quaternion every frame
- unnecessary raycasts
- unnecessary physics sync
- expensive JSX trees

Everything inside useFrame should be allocation-free.

---

# Part 4 - Three.js Renderer

Review renderer configuration.

Optimize:

Pixel Ratio

Limit max DPR to 1.5 or 2.

Enable:

- ACES tone mapping
- Correct color space
- Efficient shadow settings

Disable unnecessary expensive renderer features.

---

# Part 5 - Scene Graph

Review every mesh.

Check:

- draw calls
- mesh count
- material count
- geometry reuse
- shadow casting
- shadow receiving

Merge where appropriate.

Reuse geometry.

Reuse materials.

---

# Part 6 - Instancing

Find repeated meshes.

Convert repeated objects into:

THREE.InstancedMesh

Examples:

- trees
- rocks
- crates
- fences
- grass
- lamps

Never render hundreds of identical meshes individually.

---

# Part 7 - Physics

Review Rapier.

Check:

- unnecessary rigid bodies
- sleeping bodies
- collider complexity
- update frequency
- collision filtering

Use the simplest collider possible.

---

# Part 8 - Camera

Optimize:

- smoothing
- interpolation
- update frequency

Avoid recalculating expensive vectors.

---

# Part 9 - Asset Loading

Review:

- textures
- models
- fonts
- shaders

Implement:

- lazy loading
- asset caching
- preload strategy

Fix the current font loading issue.

---

# Part 10 - Memory

Find:

- memory leaks
- event listener leaks
- socket leaks
- renderer leaks
- texture leaks
- geometry leaks

Dispose resources correctly.

---

# Part 11 - GPU Optimization

Reduce:

- draw calls
- overdraw
- shadow cost
- transparent objects
- material switches

Target:

RTX 3050 Laptop GPU

Integrated Intel UHD Graphics

Both should remain playable.

---

# Part 12 - CPU Optimization

Reduce:

- JavaScript work
- React work
- physics work
- allocations
- state updates

Target:

Stable frame time.

---

# Part 13 - Debug Tools

Add a development-only performance overlay.

Display:

FPS

Frame Time

Draw Calls

Triangles

Textures

Geometries

GPU Memory Estimate

Physics Bodies

React Renders

Socket Ping

Only in development mode.

---

# Part 14 - Build Optimization

Review:

Vite

Tree shaking

Code splitting

Chunk sizes

Bundle size

Unused packages

Dead code

---

# Deliverables

Provide a report containing:

1. Performance score before optimization
2. Performance score after optimization
3. Every optimization made
4. Files modified
5. Memory improvements
6. GPU improvements
7. CPU improvements
8. Remaining bottlenecks
9. FPS estimate on:
   - RTX 3050 Laptop GPU
   - Intel UHD Graphics
10. Recommended next optimization

Do NOT add new gameplay systems.

Focus entirely on making the engine efficient, scalable, and ready for future world expansion.