# Chapter VI Etched Card Style Template

Use this template to generate or refine each card artwork so it matches the reference examples (see `example art/`).

## Core Visual Pillars
- Medium: hybrid of engraved map etching + subtle painterly washes.
- Surface: aged parchment / weathered chart fiber, faint deckle edges, micro-fiber noise.
- Line Quality: fine copperplate hatching, cross‑hatch for shadow, sparse stipple for atmospheric depth.
- Palette: muted sepia base (#C2B49B), indigo shadows (#1E2F48), teal accents (#2E6F73), bone/ivory highlights, tiny restrained glints of warm gold.
- Lighting: directional low sun or moon glow; volumetric mist/light rays extremely soft.
- Mood: ritualistic, archaeological, haunted, narrative puzzle.

## Required Composition Layers (Stack)
1. Background terrain / structure silhouette (granite, ruins, waterfall, cave wall).
2. Secondary environmental symbols (anchors, chains, drums, petroglyphs, bats, shards, keys).
3. Primary characters (Naia, Kassim, Maliya, revenant apparition) OR focal artifact (mask shard) — always central or rule-of-thirds intersection.
4. Numeric clue objects (must be countable at a glance; spacing even, no occlusion).
5. Atmospheric overlays (mist swirls, smoke curls, dim candle halos) low opacity.
6. Edge treatment: faint compass ticks, map glyph micro-ornaments (DO NOT clutter counting props).

## Character Reminders
- Naia: cartographer — indigo scarf, brass compass, folio. Calm analytical posture.
- Kassim: ex-privateer — weathered coat or bare torso (scars), shark-tooth necklace, pragmatic strength.
- Maliya: mambo witch — sea‑green shawl, copper bangles, bone rune charms; gestures in ritual.
- Revenant: bone‑iron mask fragments, faint ethereal glow, NOT fully corporeal until final card.

## Prop Accuracy Guidelines
Represent each numeric prop clearly. Avoid half‑hidden counts. If perspective might hide items, reposition.
Examples:
- "5 drums" → all five visible arcs.
- "7 chalk ticks" → linear or circular tally band.
- "4 cracks" → distinct radiating fissures, no branching ambiguity.

## Typography / Text Handling
No literal text on artwork (cipher/riddle handled in metadata). Subtle engraved compass rose or runic edging is acceptable.

## Negative Prompts (Exclude)
blurry, noisy JPEG artifacts, modern technology, saturated neon colors, anime style, low-detail flat shading, photoreal glossy surfaces, clutter that obscures prop counts, random extra limbs, watermark, signature.

`NEGATIVE_PROMPT`
"photoreal, neon, oversaturated, glitch, watermark, signature, text blocks, soft cartoon, low detail, extra limbs, malformed anatomy, duplicate props, motion blur"

## Prompt Assembly Template
```
Etched parchment engraved map-card of [SCENE SUMMARY]. Cinematic moody lighting, muted sepia + indigo + teal, microline copperplate hatching, faint gold rune glints. Clear countable props: [NUMERIC PROPS]. Characters: [CHARACTER SET]. Atmosphere: light mist, subtle volumetric rays, spectral undertone. Style: 17th-century nautical chart + occult reliquary illustration, high detail, balanced composition.
NEGATIVE: photoreal, neon, oversaturated, glitch, watermark, text, low-detail, extra limbs, duplicate objects.
```

## Quality Targets
- Prop count readability at 480px width.
- No prop overlaps reducing clarity below 80% visibility.
- At least 3 depth planes (foreground/mid/background) indicated by contrast + line density.

## Review Checklist Before Accepting an Image
- [ ] All numeric props match metadata counts.
- [ ] Palette within spec (no stray bright modern colors).
- [ ] Characters (if present) match clothing / identity.
- [ ] Shard or mask fragments glow subtly (only when specified).
- [ ] No stray text or signatures.
- [ ] Negative prompt artifacts absent.

---
Use this file as the single source of truth; update if stylistic direction changes.
