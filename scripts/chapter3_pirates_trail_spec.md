# Chapter 3 Redesign Spec — “Chapter III — The Pirate’s Trail”
Status: DRAFT (Do NOT Mint)
Scope: Replace current Chapter 3 (tokens 121–140) with 20 new S3-XX cards emphasizing Seychelles tropical brightness + pirate engravings.

## Core Goals
- 20 unique NFT cards (no visual template reuse beyond shared helper primitives).
- Balanced visual mood: 11 bright tropical / 9 mystical & shadowed.
- At least 7 cards with explicit pirate engravings (exceeding min 5): skull carvings, runes, sigils, tally marks, bone arrows.
- Each card includes a coherent treasure clue.
- Titles: `S3-XX — <Clue Name>` (01–20).
- Descriptions contain phrase: “Chapter III — The Pirate’s Trail”.
- Setting authenticity: granite boulders, white sand, turquoise shallows, coconut palms, trail caves, tidal pools, horizon ships, warm sky gradients.

## Visual Variation Strategy
Dimensions: 1024x1024.
Scene Axes of Variation:
1. Time of day: sunrise, high sun, late afternoon, dusk, moonlit, storm light.
2. Landmark focal: boulder cluster, driftwood arc, reef shelf, tidal pool, palm cove, cliff face, cave threshold, inland trail bend, firepit circle, horizon ship channel.
3. Foreground artifact: skull carving, rune cluster, bone markers, compass rose etching, fragment glyph, torch bracket, parrot, map scrap, rope coil, cutlass half-buried.
4. Light accent: sun flare, torch glow, rune luminescence (cyan or amber), moon beam, bioluminescent surf, reflected lagoon shimmer.
5. Weather / atmosphere: clear, gentle mist, salt spray, low haze, thin storm veil.

## Rarity (Proposed)
- Legendary (4): S3-16, S3-17, S3-19, S3-20
- Epic (6): S3-01, 04, 06, 10, 13, 18
- Rare (10): Remaining cards.
(Adjustable.)

## Card List (Initial Draft)
| # | Token | Title | Mood | Rarity | Location Anchor | Pirate Engraving | Core Visual Hook | Clue Summary |
|---|-------|-------|------|--------|-----------------|------------------|------------------|-------------|
|01|121|S3-01 — Skull on the Shore|Bright|Epic|Anse Gaulette Sand|Skull etched in driftwood plank|White sand + turquoise + etched skull + rope coil|“The skull faces first light; follow its gaze.”|
|02|122|S3-02 — Rune of the Boulder|Bright|Rare|Baie Lazare Granite|Spiral rune carved|Sunlit pink granite cluster|“Count spiral turns to match reef steps.”|
|03|123|S3-03 — Parrot’s Palm Perch|Bright|Rare|Palm Cove|No (parrot clue)|Vibrant parrot with shell scatter|“Invert feather hues to cancel a false climb.”|
|04|124|S3-04 — Waterfall Sigil|Bright|Epic|Sans Souci Fall|Hidden sigil behind spray|Silver mist waterfall|“Torch reflection reveals the seventh shift.”|
|05|125|S3-05 — Driftwood Cipher|Bright|Rare|Shore Debris Line|Runic tally on driftwood|Interlocking drift shapes|“Tally marks confirm added bearing.”|
|06|126|S3-06 — Rock Pool Rings|Bright|Epic|Ros Sodyer Pool|Numeric ring scratch|Concentric luminous ripples|“Three six nine—store for stretched time.”|
|07|127|S3-07 — Bone Arrow Cairn|Mystic|Rare|Forest Edge|Bone arrow arrangement|Shallow shadow clearing|“Bone arrow rejects the ridge lure.”|
|08|128|S3-08 — Skull Cairn Ledger|Mystic|Rare|Coconut Grove|Skull + paired notch marks|Palm root base gloom|“Pair the hollows; reserve their sum.”|
|09|129|S3-09 — Echo Gate|Mystic|Epic|Cascade Trail Cave|No (echo forms clue)|Cave mouth echo glow|“Triad echoes divide saved minutes.”|
|10|130|S3-10 — Twilight Deviation|Mystic|Epic|Port Launay Bay|Compass face scratch|Dusk horizon ship|“Add four if dusk unopposed.”|
|11|131|S3-11 — False Ridge Marker|Mystic|Rare|Morne Blanc Rise|False arrow carved|Steep ridge haze|“Engraved ascent is a lie—ignore ten.”|
|12|132|S3-12 — Ambush Crossed Steel|Mystic|Epic|Coconut Grove Inner|Cutlass cross scorch|Torch-lit grove tension|“Crossed steel flips drift only if not annulled.”|
|13|133|S3-13 — Twin Torch Script|Mystic|Epic|Passage Alcove|Alternate rune glow|Dual torches + rune wall|“Every second rune subtracts two.”|
|14|134|S3-14 — Divergent Bearing Stone|Mystic|Rare|Granite Overlook|Dual bearing etch|Star-lit split slab|“Choose the cooler star path.”|
|15|135|S3-15 — Bearing Glyph Wall|Mystic|Rare|Script Wall|Filtered rune grid|Engraved wall + grid overlay|“Keep unlit runes to spell bearing.”|
|16|136|S3-16 — Fragment I Emergence|Mystic|Legendary|Dune Hollow|Fragment glyph|Glowing fragment in sand|“Add three at lunar crown.”|
|17|137|S3-17 — Ghost Veil|Mystic|Legendary|Mist Channel|Spectral subtraction sigil|Ghost silhouette + mist swirl|“Silence leaves one—subtract remainder.”|
|18|138|S3-18 — Fragment II Reversal|Mystic|Epic|Overlook Ledge|Mirror glyph fragment|Mirrored fragment over ridge|“Flip earliest gain; heading holds.”|
|19|139|S3-19 — Sea Cave Assembly|Mystic|Legendary|Hidden Sea Cave|Fragments aligned|Cave interior luminous tide|“Present all, apply time & silence—speak east.”|
|20|140|S3-20 — Torn Contour Map|Bright|Legendary|Shore Firepit|Edge contour mark|Ash-lit parchment edge|“Contour aims beyond to next isle.”|

## Metadata Template (Per Card)
name: "Chapter 3 — S3-01 — Skull on the Shore"
attributes: Chapter, TitleCode (S3-01), Rarity, Island, Coordinates, Bearing (if relevant), MysteryTag, ClueLinks
Mandatory phrase in description: “Chapter III — The Pirate’s Trail”.

## ClueLinks (Initial Mapping)
(Will mirror earlier logic; to refine after confirmation.)
- Spiral / bearing chain: 01→02→04→10→13→16→17→18→19→20
- Cancel path: 03 cancels 11; 07 rejects false arrow; 12 conditional flip.
- Time chain: 06 (3-6-9) + 16 (+3) + 17 (-1) → 19.
- Echo division: 09 + minutes from 08 + divisor 09 applied at 19.

## Awaiting Your Confirmation / Adjustments
Reply with:
- APPROVE PT SPEC
- EDIT (list changes: counts, titles, mood distribution, landmarks, wording)

After approval: implement generator, produce art placeholders + metadata for review. No mint before explicit OK.
