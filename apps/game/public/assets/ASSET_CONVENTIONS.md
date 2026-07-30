# LEGEND Asset Pipeline Conventions

Established Phase 2. Follow these before importing any models — retrofitting
conventions across hundreds of assets later is costly.

## Directory layout

```
apps/game/public/assets/
├── characters/   # Player + NPC GLB models, per-race folders
├── monsters/      # Slimes, wolves, bosses
├── weapons/       # Holdable meshes
├── armor/         # Equippable body pieces
├── buildings/     # City structures, props-as-buildings
├── vegetation/    # Trees, flowers, grass patches
├── terrain/       # Heightmaps, splat maps, ground textures
├── props/         # Barrels, lamps, crates
├── effects/       # Particle textures, shader assets
├── music/         # Score tracks (.ogg/.mp3)
├── ambient/       # World loops, SFX beds
└── ui/            # UI sprites, icons, fonts
```

## Naming conventions

- `snake_case` filenames, no spaces. Eg `knight_helm.gltf`, not `Knight Helm.gltf`.
- Prefix by role: `char_`, `mon_`, `wpn_`, `arm_`, `bldg_`, `veg_`, `fx_`, `mus_`, `sfx_`, `ui_`.
- LOD suffixes: `_lod0`, `_lod1`, `_lod2` (highest detail → lowest).
- Animation clips inside a GLB: `idle`, `walk`, `run`, `jump`, `fall`, `attack1`, `death`.
  Use the engine `AnimationState` keys where applicable (`AnimationFSM.ts`).

## GLB optimization

- Export **glTF binary (.glb)** over `.gltf`+bin — single-file load, smaller.
- Target **<2 MB** per character/monster; <500 KB per prop.
- Mesh: collapse non-deform joints pre-export; triangulate.
- Remove unused UV channels, vertex colors unless needed.
- Compress with `gltflify` / Draco (`meshopt` acceptable). Keep a debugable uncompressed cache.

## Texture compression

- Power-of-two dimensions (256², 512², 1024²). Avoid 4096² except hero assets.
- Color/albedo: `basisu` KTX2 (transcoded per-GPU). Fallback: BC7 desktop, ETC2 mobile.
- Normal: BC5/BC1.
- No `.png` > 1024² shipped — keep originals out of `public/`.

## LOD levels

- `_lod0`: ≤5m / hero. Full tris, full tex.
- `_lod1`: 5–20m. ~50% tris, 512² tex.
- `_lod2`: >20m. ~20% tris, 128² tex.
- Provide at least `lod0` + `lod1` for characters and buildings.

## Animation standards

- Frame rate **30 fps**, exported.
- Looping clips (idle, walk, run) must be seamless — no end-frame jump.
- One action per clip; blend handled in engine.
- Root motion OFF — movement driven by `PlayerController`; clips are additive visual.
- Store avatar retargeting as a shared skeleton where possible.

## Loading

- Stream via `useGLTF` (drei), preloaded during `PRELOAD` phase.
- Prefix all asset URLs with `/assets/...` (Vite serves `public/`).
- Add to the `Asset Preloader` preload list referenced by `BootSequence` (Epic 2.1).

## Future

- Asset registry manifest (`assets/manifest.json`) generated for versioned hot-loading.
- CDN base URL configurable via `VITE_ASSET_BASE`.
