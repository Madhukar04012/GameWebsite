# Milestone 5.1 Capital Kingdom AAA Pass — Implementation Summary

## Files Created
- `apps/game/src/world/CapitalDetails.tsx` — Royal Gardens district + per-district skyline markers/banners
- `apps/game/src/materials/createDistrictMaterials.ts` — District-specific material palettes (wall, roof, wood, glass, banner, metal, accent) using existing patched material system

## Files Modified
- `apps/game/src/world/CapitalKingdom.tsx` — Integrated `CapitalDetails` into city composition
- `apps/game/src/world/CityBuilding.tsx` — District materials, glazed windows with frames/shutters/grilles, detailed doors with metal handles, roof chimneys, gable/dome/tower/flat roof variants with parapets and keystones
- `apps/game/src/world/CityDistrict.tsx` — Passes `district.name` to `CityBuilding` for material selection
- `apps/game/src/world/Roads.tsx` — Stone curbs on main/plaza/district roads, grass verges on main/plaza, gold edging preserved, intersection roundels with compass markers at crossings
- `apps/game/src/world/Walls.tsx` — Battlements (merlons) along all walls, machicolations on corner towers, South Gatehouse with portcullis (iron bars), murder holes, arrow slits, guard room windows, wooden gates, heraldic lintel
- `apps/game/src/world/CityLandmarks.tsx` — Enhanced Sunwell Fountain, Oathkeeper Statue, Heartwood Tree, Guild Monument; added Royal Arch landmark; watchtowers with banners
- `packages/shared/src/constants/index.ts` — (existing) CITY_LAYOUT provides 10 districts; Royal Gardens added via CapitalDetails overlay

## Architecture Notes
- **No new shader code** — all materials use existing `createPatchedMaterial` factories (stone, wood, metal, glass, fabric, cobble, terrain)
- **Performance-first** — materials memoized per-district (GPU reuse), roads/walls/landmarks use shared material instances, Props already use `<Instances>`
- **Data-driven** — district identity derived from `CITY_LAYOUT` in shared constants
- **Build verification** — `npm run build --workspace @legend/game` passes (last successful build: Aug 5 2026 14:06)

## Visual Identity Achieved
- ✅ Royal Gardens district with hedges, ornamental trees, central pool
- ✅ Per-district material palettes (castle=marble/gold, market=tile/bronze, noble=plaster/silver, etc.)
- ✅ Glazed windows with frames, shutters, metal grilles
- ✅ Curbed roads with grass verges and intersection roundels
- ✅ Battlemented walls with machicolations
- ✅ Gatehouse with portcullis, murder holes, arrow slits
- ✅ Hero landmarks (Sunwell, Oathkeeper, Heartwood, Guild Monument, Royal Arch)
- ✅ Gold banner watchtowers at city corners

## Next Steps (Milestone 5.2+)
- Environmental storytelling props (broken wagons, guard checkpoints, construction sites, market vignettes)
- Ambient audio framework per district
- Weather/day-night integration with landmark lighting
- Exploration area outside city (biomes already scaffolded)