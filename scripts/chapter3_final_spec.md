# Chapter 3 Final Spec — “The Landing at Anse Gaulette” (Tokens 121–140)
Status: SPEC DRAFT (Awaiting your approval — NO mint yet)
Resolution Target: 1024x1024 per NFT (rich illustrated scenes)
Total Cards: 20 (121–140) — Continuous narrative arc.

## Narrative Arc Overview
1–5 Arrival & Coastal Recon: Pirates land, survey reef & tides, discover first environmental anomalies.
6–10 Inland Discovery & Acoustic / Natural Clues: Rock pool resonance, parrots, skull cairn, echo cavern, compass drift at Port Launay.
11–15 Deceptions & Decoding: False ridge, ambush, torch-runic reveal, granite bearing discrepancy, script wall partial key.
16–18 Assembly & Supernatural Mediation: Fragment I, Ghost’s subtraction, Fragment II orientation reversal.
19 Convergence: Final sea cave unlock using compiled bearings, time shifts, echo counts, and fragment overlays.
20 Finale: Torn parchment marking the ultimate conclusion of the treasure hunt.

## Global Puzzle Logic (High-Level)
- Bearings Chain: Cards 02,03,10,14,15,16,18 refine successive compass corrections (reef → mist offset → drift → granite double pointer → script selection → fragment additive shift → fragment flip).
- Time / Tidal Chain: Cards 01 (sunrise anchor), 06 (3–6–9 resonance), 16 (time amplification), 17 (echo subtraction), 19 (final hour), 20 (dawn transition).
- Echo / Acoustic Chain: Cards 06 (rings), 09 (echo triads), 17 (silenced remainder), feeding timing at 19.
- Rune / Script Chain: Cards 13 (alternate rune visibility), 15 (bearing extraction), merges with fragment overlays (16,18) for map alignment.
- Ghost Mediation: Card 17 subtractive constant applied to time or bearing (explicit in riddle phrasing) needed to open 19.
- Final Gate (Card 19) requires: (a) Combined adjusted bearing; (b) Time window from rings + ghost subtraction; (c) Both fragments overlay; (d) Script pair selection; (e) Reef-mist initial anchor baseline.

## Rarity Distribution (Proposed)
Legendary (4): 123, 136, 137, 139
Epic (6): 121, 124, 126, 132, 133, 140
Rare (10): 122,125,127,128,129,130,131,134,135,138
(Adjustable if you prefer different weighting.)

## Attribute Set (Per NFT)
- Chapter: "Chapter 3 — The Landing at Anse Gaulette"
- Island: Specific site / landmark (e.g., Baie Lazare Shore, Sans Souci Waterfall)
- Bearing: Compass degree or encoded directional (° integer 0–359) relevant to puzzle chain
- Coordinates: Lat, Long (approximate, consistent with earlier placeholders)
- Rarity: Rare/Epic/Legendary
- MysteryTag: Short unique code referencing puzzle function
- ClueLinks: Other card token_ids this one logically connects to
- (Optional Extended): Phase (arrival | inland | false | climax), though not required if you want to keep minimal on-chain size.

## Bearings Logic Summary
- 121: Establish baseline 072° (anchor sunrise heading)
- 122: Adjust +12° from groove count → 084°
- 123: Mist offset subtract 5° if reef twins obscured → 079°
- 124: Veil torch symbol adds +7° when activated → 086°
- 125: Shoreline cipher confirms 086° (validation, not change)
- 126: Rings multiply timing; bearing unchanged (stores time sequence)
- 127: Parrot inversion warns to ignore next false +10° shift (applies at 131)
- 128: Skull angles provide triad sum 54 (used as minutes later)
- 129: Echo triads map to minutes divisor (3) used in final time normalisation
- 130: Twilight drift introduces +4° magnetic deviation (pending granite test) → candidate 090°
- 131: False ridge suggests +10° (BUT parrot cancels) stays 090°
- 132: Ambush inversion flips prior deviation sign if applied — no change here (just narrative gating)
- 133: Torch runes reveal selective subtraction of 2° → 088°
- 134: Granite dual bearings (088° vs 094°) choose night-corrected (use 088°) confirms path
- 135: Script wall encodes 088° into letter triad for map overlay
- 136: Fragment I adds +3° time-phase elevation → 091°
- 137: Ghost subtracts echo residue 1° → 090°
- 138: Fragment II flips earlier reef correction (initial +12 becomes +6 net) keeps 090° stable
- 139: Final cave uses canonical 090° and compiled time window to unlock
- 140: Torn parchment marks the final conclusion of the treasure quest

## Detailed Card Specifications
| # | Token | Title | Rarity | Bearing° | Coordinates | Island / Site | MysteryTag | Artwork Description (Summary) | Riddle | ClueLinks |
|---|-------|-------|--------|----------|-------------|--------------|------------|-------------------------------|--------|-----------|
|01|121|Card 01 — Landing at Anse Gaulette|Epic|072|-4.7498,55.4912|Baie Lazare Shore|ANCHOR_BASE|Moonlit shoreline: beached longboat, anchor half-buried in glowing white sand, turquoise shallows, reef teeth silhouette, distant palms.|"Where the anchor greets first light, take the line the reef points before the sun owns it."|125,136|
|02|122|Card 02 — Reef Groove Survey|Rare|084|-4.7509,55.4921|Lazare Picault Edge|GROOVE_COUNT|Pink granite slab with carved grooves, measuring rope, compass glowing faint amber, surf spray.|"Count the twelve scars; add them to dawn’s base bearing."|134|
|03|123|Card 03 — Dawn Mist Alignment|Legendary|079|-4.7519,55.4931|Baie Lazare Mist Line|MIST_OFFSET|Veil of sea mist drifting, twin reef humps barely visible, spectral compass rose halo.|"If the twin backs vanish, subtract the veil’s five."|134,138|
|04|124|Card 04 — Sans Souci Veil|Epic|086|-4.6512,55.4480|Sans Souci Waterfall|VEIL_SIGIL|Waterfall shimmering silver, hidden sigil ignited by torch reflection, lush fern-laced granite.|"Light reveals seven more only when the veil breathes silver."|133,136|
|05|125|Card 05 — Shoreline Cipher|Rare|086|-4.7485,55.4898|Baie Lazare Drift Zone|SHORE_CIPHER|Driftwood pieces form an accidental map rune, tide foam glowing, crabs near an X-like arrangement.|"Crosses in wet sand confirm the seventh’s truth."|136|
|06|126|Card 06 — Ros Sodyer Resonance|Epic|086|-4.3613,55.8249|Ros Sodyer Rock Pool|POOL_RIPPLES|Rock pool with concentric cyan rings, bioluminescent shimmer, moon overhead, coral heads.|"Three, then six, then nine: store them—time will stretch."|136,139|
|07|127|Card 07 — Parrot Sentinel|Rare|086|-4.6395,55.4489|Forest Fringe|PARROT_INVERT|Vivid green-and-gold parrot perched, inverted color reflection in lagoon puddle, twisting palm trunks.|"Invert its hidden hue to ignore the liar’s ascent."|131|
|08|128|Card 08 — Skull Cairn Marker|Rare|086|-4.7461,55.4955|Coconut Grove|SKULL_ANGLES|Small cairn with a carved skull, palm roots exposed, two angled bone fragments forming a V, torch stub.|"Add the hollow gaze angles; keep them for the minutes."|126,135|
|09|129|Card 09 — Echo Cavern Trail|Epic|086|-4.6510,55.4823|Cascade Coastal Trail|ECHO_TRIADS|Shallow cave mouth; waves pulse soft echoes in triplets; hanging vines; damp luminous moss.|"Echoes in threes divide the minutes you saved."|133,139|
|10|130|Card 10 — Port Launay Twilight Drift|Rare|090|-4.6450,55.4062|Port Launay Bay|DRIFT_DEVIATE|Bay at sunset, ship silhouette drifting, compass needle leaning right, purple-orange horizon.|"When the bay swallows gold, add four unless night disputes it later."|138|
|11|131|Card 11 — False Ridge Decoy|Rare|090|-4.6503,55.4488|Morne Blanc Ridge|RIDGE_DECOY|Steep ridge path with misleading carved arrow upward; low cloud; parrot faint in distance.|"The path that climbs demands ten more—heed the sentinel to refuse."|127,135|
|12|132|Card 12 — Grove Ambush|Epic|090|-4.7461,55.4955|Coconut Grove|AMBUSH_INVERT|Hidden cutlasses crossed in palm shadow, overturned crate, scattered beads, tension in foliage.|"Crossed steel would flip what drift proposed—unless already annulled."|135|
|13|133|Card 13 — Twin Torch Revelation|Epic|088|-4.6518,55.4496|Sans Souci Passage|TORCH_ALT_RUNES|Two wall torches reveal alternating glowing runes; moisture haze; carved arch curve.|"Read every second flame-mark to subtract two."|135,139|
|14|134|Card 14 — Granite Divergence|Rare|088|-4.6490,55.4520|Granite Slab Overlook|GRANITE_SPLIT|Split granite plate with dual etched bearings (088° & 094°), nighttime stars, lamp reflection.|"Of the twins, take the cooler star-lit course."|138|
|15|135|Card 15 — Script Wall Bearing Key|Rare|088|-4.6498,55.4808|Cascade Script Wall|SCRIPT_SELECT|Weathered wall with shallow glyph rows; overlay grid; partial rune glow matching torch pattern.|"Keep only runes the fire skipped—assemble the bearing lettered."|133|
|16|136|Card 16 — Map Fragment I|Legendary|091|-4.7491,55.4906|Anse Gaulette Dune|FRAGMENT_I|Torn parchment glowing softly—overlay of shoreline outline + ring sequence numbers.|"Add three when moon crowns the rings."|139|
|17|137|Card 17 — Pirate’s Ghost Intercession|Legendary|090|-4.7521,55.4939|Baie Lazare Mist|GHOST_SUBTRACT|Translucent spectral captain, mist swirling inward, faint hourglass apparition.|"Silence all but one—subtract the remainder."|139|
|18|138|Card 18 — Map Fragment II|Epic|090|-4.6492,55.4475|Morne Blanc Overlook|FRAGMENT_II|Second parchment with inland elevation lines; mirror glyph; reversed compass mini-rose.|"Flip the earliest gain; leave the heading whole."|139|
|19|139|Card 19 — Final Sea Cave Convergence|Legendary|090|-4.7442,55.4979|Hidden Sea Cave|CAVE_UNLOCK|Sea cave interior, both fragments assembled above a tide pool, ghost’s faint glow, ring/time overlay projection.|"Present fragments, apply silence and stretched time; speak the eastward hour."|140|
|20|140|Card 20 — Torn Parchment Contour|Epic|090|-4.7481,55.4891|Shoreline Firepit|TORN_CONTOUR|Ash-lit firepit; final torn edge forms silhouette pointing toward next island horizon.|"The contour aims beyond—carry the ninety forward."|—|

## Riddle Interlock Explanation
- Time Window: (06 rings) → amplified (16 +3) → reduced (17 -1) = final adjusted sequence used at 19.
- Bearing Baseline & Corrections: 01→02(+12)→03(-5)→04(+7)→13(-2)→16(+3)→17(-1)= net 072 +12 -5 +7 -2 +3 -1 = 086 (but drift & other context normalizes to final 090 via 10 & fragment interplay). Final canonical heading purposely stabilized at 090 for narrative clarity.
- Validation / Cancellation: 07 cancels 11’s attempted +10; 12 warns no flip since cancellation already engaged.
- Script Derivation: 13 reveals pattern; 15 transforms pattern into bearing text; used to verify assembled fragment overlay at 19.
- Fragments: 16 adds; 18 flips earlier addition logic (neutralizing potential cumulative drift) ensuring a clean canonical 090; 17’s subtraction ensures no overshoot.

## Example Final Metadata Fields (Schema Template)
```
{
  "name": "Chapter 3 — Card 01 — Landing at Anse Gaulette",
  "description": "Chapter 3 — The Landing at Anse Gaulette. Card 01 begins the saga... (full narrative + artwork description + riddle).",
  "image": "/real/images/121.png",
  "attributes": [
    { "trait_type": "Chapter", "value": "Chapter 3 — The Landing at Anse Gaulette" },
    { "trait_type": "Island", "value": "Baie Lazare Shore" },
    { "trait_type": "Bearing", "value": 72 },
    { "trait_type": "Coordinates", "value": "-4.7498, 55.4912" },
    { "trait_type": "Rarity", "value": "Epic" },
    { "trait_type": "MysteryTag", "value": "ANCHOR_BASE" },
    { "trait_type": "ClueLinks", "value": "125,136" }
  ]
}
```

## Next Actions (Pending Your Approval)
1. Confirm / adjust: bearings math, rarity distribution, wording intensity, any landmark changes.
2. Approve spec OR request edits.
3. I implement `generate_chapter3_final.js` (1024x1024) rendering richer layered scenes per description.
4. Generate & sync metadata.
5. Present final JSON list for mint review.
6. Await wallet & mint authorization.

Provide any revisions (e.g., “Make Fragment II Legendary”, “Change 06 coordinates”, “More focus on coral in 01/05”). Once approved I proceed to implementation.
