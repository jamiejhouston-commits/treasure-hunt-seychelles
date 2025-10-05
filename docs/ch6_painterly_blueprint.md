# Chapter VI Painterly Rendering Blueprint

## Narrative & Art Goals
- Translate each lore fragment into a dense Seychellois tableau that feels hand-painted and culturally grounded.
- Blend symbolic motifs (masks, runes, shards, chains, drums, bats) into living environments rather than floating overlays.
- Ensure human presence, ritual energy, and regional ecology animate every composition.
- Preserve puzzle legibility: counted props must remain readable inside lush scenes.

## Rarity-Driven Visual Hierarchy
| Rarity | Scene Density | Human / Spirit Presence | Lighting & FX | Intended Impact |
| --- | --- | --- | --- | --- |
| **Common** | Layered but readable backgrounds (2–3 environment bands). | Silhouettes or implied figures (1–2). | Warm daylight or moonlit washes; subtle rim glow. | Entry points into the saga, still painterly yet calm. |
| **Rare** | Rich mid/foreground foliage, textiles, carved structures. | Active characters (2–3) interacting with props; spirit hints. | Dramatic color contrast, volumetric light shafts, embers/surf spray. | Heightened tension and ritual motion. |
| **Legendary** | Fully immersive panoramas with parallax depth and cultural motifs in every plane. | Crowd scenes, ceremonies, or revenant confrontations (3+ figures/spirits). | Intensified bloom, rune auroras, refracted waterlight; animated glow layers. | Signature centerpieces collectors display proudly. |

## Environment Modules
Each manifest entry will select a primary module and optional secondary accents:
- **Coastal / Reef**: Layered lagoons, crashing surf, fishing skiffs, coral fans; integrate anchors, chains, lanterns.
- **Jungle / Mangrove**: Palm fronds, takamaka trunks, hanging lianas, mist shafts; embed drums, runes, masks in tree hollows.
- **Highlands / Granite**: Boulders, moss, cloud halos, waterfalls; carve tallies into stone, seat shards in fissures.
- **Village / Market**: Textile awnings, woven baskets, spice smoke, lantern strings; nest clues among stalls and dancers.
- **Ceremony / Ancestral**: Torch circles, bone totems, salt lines, spirit silhouettes; emphasize communal choreography.
- **Cavern / Tidal**: Stalactites, tide pools, bioluminescence, echo ripples; set rune light in water reflections.

## Color & Lighting Strategy
- Base palettes draw from Seychellois references (see `example art/`): saturated greens, cobalt/ocean blues, turmeric yellows, hibiscus reds, indigo twilight, gold firelight.
- Per module gradient washes (sky/water) underpaint the scene; layered translucent foliage blocks create tonal depth.
- Rim lighting (warm vs cool) separates characters from background; rune glows use additive cyan/gold for mystic feel.
- Atmospheric particles: salt spray, pollen motes, ember flecks tuned by rarity (more dense for rares/legendaries).

## Cultural & Faunal Motifs
- People: fisher silhouettes hauling nets, drummers, cartographers marking maps, mambo priests dancing in salt circles.
- Fauna: fruit bats, black parrots, flying foxes, reef fish, tortoises; align counts with puzzle numbers when possible.
- Textiles & Patterns: woven mats, sega skirts, braided rope—use to frame key items.
- Spiritual Touches: ancestral mask projections, translucent revenant doubles, guiding cat spirits.

## Symbol Integration Guidelines
- **Masks** emerge from foliage clusters or ritual altars, half-submerged or carried by characters.
- **Runes** carved into stone, painted on bodies, or glowing along water edges.
- **Shards** set within carved pedestals, market stalls, or cliff crevices; radiant glow spills onto surroundings.
- **Chains & Anchors** tangle through boats, tidepools, or dragged footprints; interact with sand/water.
- **Drums** ringed by dancers, smoke, and firelight rather than isolated.
- **Bats** woven into sky gradients in arcs or rivers that mirror coastline shapes.

## Data & Code Hooks
To support the painterly pass we will extend `ch6_revenant_manifest.js` with:
- `rarity`: `'common' | 'rare' | 'legendary'` per card.
- `environment`: `'coastal' | 'jungle' | 'highland' | 'village' | 'ceremony' | 'cavern'`.
- `humanPresence`: qualitative note (e.g., `'trio_dancers'`, `'fisher_warning'`, `'spirit_procession'`).
- `fauna`: array of key animals/spirit elements for renderer placement.
- `propHighlights`: override notes for puzzle-readable assets (ensures counts stay visible).

Renderer updates (`render_ch6_manifest_cards.mjs`) will:
- Generate background washes based on `environment` using layered noise, brush-texture strokes, and parallax silhouettes.
- Instantiate modular foliage/architecture brushes (palms, takamaka, market stalls, anchors, boats).
- Place human/animal silhouettes using seeded composition templates per environment.
- Adjust density by `rarity`, e.g., number of foliage layers, particle systems, glow intensity.
- Blend symbolic icons within environment modules rather than drawing them floating—e.g., clip masks to foliage, project runes onto surfaces.
- Apply painterly stroke textures (multi-frequency Perlin strokes) and canvas grain to replace flat gradients.

## Execution Sequence
1. **Manifest Augmentation**: add the new metadata fields and enrich descriptive cues to match modules above.
2. **Brush Library**: implement reusable drawing helpers (foliage strokes, textile banners, silhouettes, waves, boats).
3. **Environment Pipelines**: create pipeline functions per environment that compose background, midground, foreground, and narrative props.
4. **Rarity Tweaks**: parameterize layer counts, glow strength, particle density, and human/animal presence by rarity.
5. **Validation Hooks**: ensure prop counts remain clear (outline numbers, highlight puzzle elements) and keep metadata consistent.

This blueprint anchors the painterly transformation; subsequent steps will wire the manifest data and renderer implementation to realize the Seychellois-inspired visual overhaul.
