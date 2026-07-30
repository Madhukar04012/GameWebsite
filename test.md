# LEGEND Browser MMORPG - Comprehensive Project Audit

You are acting as the Lead Software Architect, Principal Game Engine Engineer, Senior Full-Stack Engineer, Technical Director, and QA Lead for the LEGEND Browser MMORPG.

Your task is NOT to add new features.

Your task is to perform a complete engineering audit of the entire project built so far.

---

# Objective

Review the entire repository from top to bottom and verify that every existing system has been implemented correctly.

Think like a AAA game studio performing an internal milestone review before approving the next phase.

Do NOT assume anything is correct.

Challenge every decision.

---

# Areas to Review

## 1. Monorepo Structure

Verify:

- npm workspaces
- package boundaries
- dependency graph
- shared packages
- tsconfig references
- path aliases
- build outputs
- scripts
- workspace isolation

Confirm whether the repository is scalable for a large MMORPG.

---

## 2. Website

Review:

- Next.js architecture
- routing
- layouts
- page structure
- SEO
- performance
- lazy loading
- asset optimization
- component organization
- accessibility
- animations

Check whether everything follows Next.js best practices.

---

## 3. Game Client

Review every file inside:

apps/game

Verify:

- React Three Fiber usage
- Three.js architecture
- component hierarchy
- Canvas configuration
- renderer configuration
- scene graph
- camera
- lighting
- physics
- state management
- rendering loop

Look for:

- incorrect patterns
- memory leaks
- render loops
- unnecessary rerenders
- performance issues
- architectural problems

---

## 4. Game State Machine

Review the complete game lifecycle.

Expected states:

BOOT

↓

PRELOAD

↓

AUTH

↓

CONNECT_SERVER

↓

LOAD_WORLD

↓

CINEMATIC

↓

SPAWNING

↓

PLAYING

↓

PAUSED

↓

DISCONNECTED

Verify:

- transitions
- invalid states
- race conditions
- async handling
- edge cases

---

## 5. Multiplayer Backend

Review:

apps/server

Verify:

- Express setup
- Socket.io
- CORS
- architecture
- scalability
- security
- separation of concerns
- future multiplayer support

---

## 6. Shared Packages

Review:

packages/shared

packages/ui

packages/engine

Verify:

- folder structure
- exports
- naming
- scalability
- coupling
- dependency direction

---

## 7. Rendering Pipeline

Review:

- renderer configuration
- shadows
- lighting
- tone mapping
- gamma
- color space
- HDR
- performance

Verify the renderer follows modern Three.js standards.

---

## 8. Camera System

Check:

- PerspectiveCamera
- controls
- clipping planes
- spawn position
- follow camera
- camera smoothing

Verify nothing can produce a black screen.

---

## 9. Scene

Review:

- lighting
- objects
- meshes
- helpers
- physics
- visibility
- transforms

Explain why the scene currently renders as a black screen.

Find the root cause instead of applying random fixes.

---

## 10. Physics

Review Rapier implementation.

Check:

- world
- gravity
- rigid bodies
- colliders
- update order

---

## 11. Zustand Store

Review:

gameStore.ts

Check:

- state organization
- selectors
- updates
- unnecessary rerenders
- future scalability

---

## 12. TypeScript

Verify:

- strict mode
- any usage
- unsafe casts
- interfaces
- generics
- shared types

---

## 13. Build System

Verify:

- production build
- Vite
- Next.js
- workspace compilation
- package references

---

## 14. Performance

Review:

- unnecessary renders
- memory allocations
- React performance
- Three.js performance
- GPU usage
- texture loading
- asset loading

Identify all bottlenecks.

---

## 15. Code Quality

Review every file.

Check:

- naming
- readability
- maintainability
- comments
- dead code
- duplicated code
- folder organization

---

## 16. Security

Review:

- websocket validation
- CORS
- environment variables
- dependency vulnerabilities
- unsafe patterns

---

## 17. Future Scalability

Determine whether this architecture can realistically support:

- 10,000+ assets
- multiple cities
- streaming world
- multiplayer
- inventory
- quests
- combat
- guilds
- dungeons

If not, explain exactly what should change now before more code is written.

---

# Black Screen Investigation

The game currently reaches:

BOOT
↓

PRELOAD
↓

AUTH
↓

CONNECT_SERVER
↓

LOAD_WORLD
↓

CINEMATIC
↓

SPAWNING
↓

PLAYING

However the screen remains black.

Do NOT guess.

Trace the execution path.

Find the exact file and exact line causing the issue.

Determine whether the problem is:

- Camera
- Renderer
- Scene
- Physics
- Canvas
- Lighting
- State
- Asset loading
- CSS
- Render loop
- Game state
- Mount order

Provide the exact fix.

---

# Deliverables

Produce a professional engineering audit containing:

## 1. Executive Summary

Overall project health (score out of 100)

---

## 2. Architecture Score

Rate:

- Structure
- Scalability
- Maintainability
- Performance
- Multiplayer readiness

---

## 3. Critical Issues

List every critical issue.

For each issue include:

- Severity
- File
- Root Cause
- Recommended Fix

---

## 4. Warnings

List architectural improvements.

---

## 5. Performance Report

Identify:

- CPU bottlenecks
- GPU bottlenecks
- React bottlenecks
- Three.js bottlenecks

---

## 6. Code Smells

Find every bad practice.

---

## 7. Technical Debt

Estimate future risks if current code remains unchanged.

---

## 8. Recommended Refactoring

Suggest improvements before continuing development.

---

## 9. Phase Approval

Decide whether the project is ready to move to the next phase.

Respond with one of:

✅ APPROVED

⚠ APPROVED WITH CHANGES

❌ REJECTED

Explain why.

---

# Important Rules

- Do NOT rewrite working code unnecessarily.
- Do NOT introduce breaking changes.
- Preserve the existing architecture unless a clear improvement exists.
- Explain every recommendation with technical reasoning.
- Prioritize long-term scalability over short-term convenience.
- Assume this project will eventually become a production MMORPG with thousands of concurrent players.

# LEGEND - Player Controller Audit & Polish

You are a Senior Gameplay Programmer specializing in third-person action RPGs and MMORPGs.

Your task is NOT to add new features.

Your only objective is to make the current player controller feel smooth, responsive, and production-ready.

---

## Step 1 - Audit

Review the entire player movement system.

Check:

- Keyboard input
- Mouse input
- Camera rotation
- Camera smoothing
- Movement calculations
- Physics
- Collision
- Character movement
- Delta time usage
- Frame-rate independence
- Rapier integration
- Camera follow logic

Identify everything that makes the controls feel awkward.

Do not guess.

Explain the exact cause of every issue.

---

## Step 2 - Fix

Improve movement until it feels like a modern third-person game.

Requirements:

### Movement

- Smooth acceleration
- Smooth deceleration
- Consistent movement speed
- No jitter
- No sliding
- Frame-rate independent
- Proper diagonal movement normalization
- Sprint support
- Walk support

Movement should feel similar to:

- Genshin Impact
- Wuthering Waves
- Tower of Fantasy

---

### Camera

Improve:

- Mouse sensitivity
- Orbit speed
- Rotation smoothing
- Zoom
- Collision prevention
- Camera interpolation
- Camera damping

The camera should never fight the player.

---

### Character Rotation

The player should:

- Rotate smoothly
- Face movement direction
- Avoid snapping
- Interpolate rotation naturally

---

### Physics

Review:

- Capsule collider
- Gravity
- Friction
- Ground detection
- Slopes
- Jump readiness

Ensure movement remains stable.

---

### Input

Review:

- WASD
- Shift
- Space
- Mouse

Add configurable sensitivity values.

---

### Code Quality

Refactor the controller if necessary.

Ensure:

- Modular code
- Readable structure
- No duplicated logic
- Easy future extension

---

## Step 3 - Testing

Test:

- Walking
- Running
- Turning
- Diagonal movement
- Camera orbit
- Camera zoom
- Low FPS behavior
- High FPS behavior

---

## Deliverables

Provide:

1. Problems found
2. Root causes
3. Files changed
4. Improvements made
5. Final movement characteristics
6. Any remaining limitations

Do not add combat, inventory, monsters, quests, or any unrelated systems.
Only improve the player controller and camera.