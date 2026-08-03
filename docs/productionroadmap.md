# LEGEND Browser MMORPG
# Milestone 4 & 5 Implementation
# Graphics Foundation + World Identity

You are the Lead Graphics Engineer, Technical Art Director, Senior Environment Artist, and World Designer for the LEGEND Browser MMORPG.

Your responsibility is to fully implement Milestone 4 (Graphics Foundation) and Milestone 5 (World Identity).

This is NOT a prototype task.

Treat this as production-quality game development.

Do NOT redesign the existing architecture.

Respect the current monorepo structure.

Do NOT rewrite working systems unless necessary.

Always preserve browser performance.

Always build on the existing codebase.

────────────────────────────────────────

PROJECT STATUS

Foundation
✓ Complete

Engine
✓ Complete

Prototype World
✓ Complete

Graphics Foundation
In Progress

World Identity
Not Started

Physics
Future Milestone

Combat
Future Milestone

────────────────────────────────────────

PRIMARY OBJECTIVE

Transform LEGEND from a functional prototype into a visually stunning stylized fantasy MMORPG world.

The goal is NOT photorealism.

The target quality should feel similar in polish and atmosphere to modern stylized fantasy RPGs while remaining completely original and optimized for browsers.

Everything created must be reusable.

Every system must be modular.

Every asset must support future expansion.

────────────────────────────────────────

MILESTONE 4
GRAPHICS FOUNDATION

This milestone focuses ONLY on building rendering technology and reusable graphics systems.

No gameplay.

No quests.

No RPG mechanics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 Rendering Pipeline

Improve and finalize the rendering pipeline.

Implement or improve:

• ACES Filmic Tone Mapping
• sRGB workflow
• HDR-ready renderer
• Exposure control
• Proper gamma correction
• DPR scaling
• Shadow quality
• Contact shadows
• Soft shadows
• Renderer configuration
• Browser compatibility

Everything should be configurable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.2 Lighting System

Create a reusable lighting framework.

Support:

Directional Sun

Moon

Ambient

Hemisphere

Torch lights

Interior lights

Window glow

Lanterns

Color temperature

Light presets

Time-of-day presets

Weather presets

Future dynamic lighting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.3 Material Library

Build a complete procedural material library.

Stone

Brick

Wood

Metal

Glass

Roof Tiles

Cobblestone

Terrain

Grass

Leaves

Water

Fabric

Leather

Support

Weathering

Moss

Cracks

World-space blending

Noise variation

Wet surfaces

Roughness

Height variation

Everything should reuse shared shader logic.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.4 Shader Library

Create reusable shaders.

Terrain Shader

Water Shader

Leaf Shader

Wind Shader

Cloud Shader

Fog Shader

Glow Shader

Fire Shader

Magic Shader

Particle Shader

Avoid duplicated shader code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.5 Terrain Engine

Improve terrain generation.

Support:

Natural hills

Cliffs

River banks

Road blending

Biome masks

LOD-ready architecture

Streaming-ready architecture

Height sampling

Slope analysis

Terrain painting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.6 Vegetation Engine

Create a reusable vegetation system.

Support

Trees

Bushes

Flowers

Grass

Ground cover

Mushrooms

Logs

Rocks

Wind animation

Density variations

Season support

Biome support

Everything should use GPU instancing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.7 Water System

Improve the water renderer.

Support

Harbor

Ocean

River

Lake

Reflection

Refraction

Foam

Ripples

Shore blending

Wave animation

Future boats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.8 Sky System

Create a complete sky system.

Morning

Noon

Golden Hour

Sunset

Night

Stars

Moon

Cloud layers

Atmospheric fog

Future weather hooks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.9 Post Processing

Implement

Bloom

Ambient Occlusion

Vignette

Color grading

Depth fog

Sharpen

Future SSR support

Everything should be configurable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.10 Particle Framework

GPU optimized particle framework.

Dust

Smoke

Leaves

Fireflies

Magic

Rain

Snow

Ash

Fog

Use pooling.

Avoid allocations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.11 Camera System

Improve

Third-person camera

Collision

Terrain following

Camera smoothing

Dynamic zoom

Camera shake

Cinematic mode

Future lock-on

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.12 Performance Framework

Implement

Instancing

Material reuse

Geometry reuse

Texture atlas support

Distance culling

Frustum culling

Performance overlay

Streaming hooks

Memory pools

Frame profiler

Browser optimization

────────────────────────────────────────

MILESTONE 5
WORLD IDENTITY

This milestone creates the actual world.

Do NOT create random decorations.

Every asset must support the lore and visual identity of LEGEND.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.1 World Style Guide

Establish a visual language.

Define

Architecture

Materials

Color palette

Road styles

Terrain styles

Landmark rules

District identities

Forest identity

Harbor identity

Lighting language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.2 Capital Kingdom

Completely upgrade the Capital Kingdom.

Every district should have its own identity.

Castle District

Guild District

Market District

Residential District

Harbor

Training Grounds

Blacksmith

Central Plaza

South Gate

Royal Gardens

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.3 Landmark System

Create memorable landmarks.

Royal Castle

Guild Hall

Ancient Tree

Grand Fountain

Hero Statue

South Gate

Bridge

Watch Towers

Harbor Lighthouse

These should become natural navigation points.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.4 Roads

Replace placeholder roads.

Implement

Cobblestone

Dirt roads

Forest trails

Bridges

Roadside grass

Curved roads

Natural intersections

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.5 Terrain Design

Terrain should feel handcrafted.

Build

Valleys

Rolling hills

Forest edges

Rock formations

River banks

Cliffs

Fields

Natural transitions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.6 Forests

Create layered forests.

Tree canopy

Bushes

Flowers

Tall grass

Ground cover

Mushrooms

Logs

Rocks

Everything should look natural.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.7 Props

Populate every district.

Categories

Military

Residential

Harbor

Market

Nature

Magic

Ruins

Roadside

Lighting

Examples

Barrels

Crates

Lanterns

Signs

Benches

Weapon racks

Market stalls

Carts

Fences

Wells

Statues

Bridges

Banners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.8 Environmental Storytelling

Tell stories through the environment.

Examples

Broken wagons

Campfires

Guard checkpoints

Construction sites

Supply crates

Training equipment

Fishing docks

Old shrines

Abandoned camps

Every prop placement should have a reason.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.9 Atmosphere

The world should always feel alive.

Implement

Birds

Leaves

Smoke

Dust

Cloud shadows

Wind

Water movement

Flags

Fireflies

Butterflies

Ambient fog

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.10 Audio Framework

Build ambient audio support.

District ambience

Birds

Wind

Water

Harbor

Blacksmith

Fireplace

Market

Music zones

Future dynamic music

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.11 Weather

Framework only.

Support

Clear

Cloudy

Fog

Rain

Storm

Future snow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.12 Day/Night

Support

Morning

Day

Evening

Night

Lighting presets

Sky presets

Torch activation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.13 Exploration

Outside the city.

Build

Forest

River

Bridge

Ruins

Camp

Viewpoints

Small cave entrances

Hidden paths

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.14 Final Polish

Balance

Lighting

Materials

Terrain

Roads

Vegetation

Building variety

Visual composition

Skyline

Navigation

────────────────────────────────────────

PERFORMANCE REQUIREMENTS

Target

60+ FPS

RTX 3050 Laptop GPU

Playable on integrated graphics.

Use

Instancing

Shared geometry

Shared materials

Distance culling

Frustum culling

No memory leaks

No allocations inside render loops

Avoid unnecessary React renders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TESTING

After every major implementation:

• Build the project
• Fix all TypeScript errors
• Launch development server
• Open browser
• Walk through every district
• Verify FPS
• Verify shadows
• Verify materials
• Verify lighting
• Verify console output
• Fix regressions immediately

Never leave the project in a broken state.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEFINITION OF DONE

Milestone 4 is complete when:

✓ Graphics systems are modular
✓ Rendering pipeline is production-ready
✓ Lighting framework exists
✓ Material library exists
✓ Shader library exists
✓ Terrain engine is complete
✓ Water system is complete
✓ Sky system is complete
✓ Particle framework is reusable
✓ Camera is polished
✓ Performance framework is stable

Milestone 5 is complete when:

✓ Capital Kingdom has a unique visual identity
✓ Every district is visually distinct
✓ Terrain feels handcrafted
✓ Roads blend naturally
✓ Props support environmental storytelling
✓ Atmosphere makes the world feel alive
✓ Ambient audio framework exists
✓ Weather framework exists
✓ Day/Night framework exists
✓ Exploration area outside the city is believable
✓ Browser performance remains excellent

Continue working iteratively until both milestones are fully implemented. Build, test, review, refine, and repeat without sacrificing performance, maintainability, or code quality.