const manifest = [
  {
    id: "ch6_001",
    name: "Port Launay: The Fisherman’s Warning",
  rarity: "rare",
    environment: "ceremony",
    humanPresence: "ritual_circle",
    fauna: [
      { type: "spirit_cat", count: 1, color: "#1f1216", opacity: 0.78 },
      { type: "fireflies", count: 3, center: { x: 0.48, y:0.44 }, spread: { x: 0.3, y: 0.18 }, color: "#ffd784" }
    ],
    propHighlights: [
      {
        shape: "waxCircle",
        count: 4,
        distribution: "ring",
        center: { x: 0.46, y: 0.66 },
        radius: 0.26,
        size: 140,
        color: "#ffe1aa",
        opacity: 0.48
      },
      {
        shape: "rune",
        count: 2,
        distribution: "cluster",
        center: { x: 0.38, y: 0.58 },
        spread: { x: 0.1, y: 0.08 },
        size: 140,
        color: "#ffd27e",
        opacity: 0.6
      }
    ],
  scene: "Brine-slick dusk at Port Launay clings to four rust-scabbed anchors while three fruit bats orbit a sickle moon and a far pirogue silhouette rocks beyond the breakwater. Diesel smoke, wet kelp, and old rum sting the trio as Tibo shoves a damp chart scrap into Naia\'s hands, begging them to hold the 43° bearing before the revenant\'s chains drag him under.",
    props: [
      { name: "anchors", value: 4, description: "Rusted anchors sunk in shallows" },
      { name: "bats", value: 3, description: "Fruit bats wheeling over the moon" },
      { name: "crackedLanternPane", value: 1, description: "Lantern with cracked glass" }
    ],
    hiddenClue: "4 + 3 = 43°",
    bearingDeg: 43,
    cipherOutput: "R",
    cipherIndex: 1,
  riddle: "Four anchors bite, three wings flee—steer where their sum gnaws moonlit tide.",
    art: {
      palette: {
        background: "#121014",
        gradientFrom: "#1b2835",
        gradientTo: "#274356",
        glow: "#f2d7a4",
        accent: "#4f8a99"
      },
      overlays: {
        horizon: 0.62,
        shimmer: 0.28,
        compass: true
      },
      painterly: {
        canvasTexture: 0.68,
        brushDensity: 0.74,
        impastoDepth: 0.58,
        glazeHue: "#f2d7a4",
        silhouetteMotifs: ["pirogue", "anchor", "bat"],
        culturalNotes: "Brush-render the pirogue silhouette, salt-scarred anchors, and fruit bat arc as oil strokes swimming through diesel dusk.",
        brushLayers: [
          { role: "sky_wash", color: "#1b2835", blend: "multiply", opacity: 0.82, texture: "dry-brush", noise: 0.22 },
          { role: "horizon_glow", color: "#f2d7a4", blend: "screen", opacity: 0.38, texture: "soft-glaze", noise: 0.1 },
          { role: "surf_body", color: "#274356", blend: "overlay", opacity: 0.64, texture: "palette-knife", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "pirogue", count: 1, placement: { type: "absolute", x: 0.28, y: 0.26 }, brush: { style: "knife", color: "#1a2630", edgeSoftness: 0.28, strokeAngle: -12 } },
          { shape: "anchor", count: 4, placement: { type: "arc", center: { x: 0.48, y: 0.7 }, radius: 0.28, startAngle: 200, endAngle: 340 }, brush: { style: "loaded", color: "#d9b776", edgeSoftness: 0.35, strokeAngle: 48 } },
          { shape: "bat", count: 3, placement: { type: "arc", center: { x: 0.58, y: 0.26 }, radius: 0.24, startAngle: -160, endAngle: -40 }, brush: { style: "sable", color: "#f2edd7", edgeSoftness: 0.55, strokeAngle: -75 } }
        ],
        glowAccents: [
          { motif: "moon_glint", color: "#f8e6bc", intensity: 0.65, radius: 0.18, center: { x: 0.72, y: 0.18 } },
          { motif: "spray_motes", color: "#f2d7a4", intensity: 0.42, band: { yStart: 0.68, yEnd: 0.86 } }
        ]
      },
      icons: [
        {
          shape: "moon",
          count: 1,
          positions: [{ x: 0.72, y: 0.18 }],
          size: 220,
          color: "#f8e6bc",
          opacity: 0.7
        },
        {
          shape: "wave",
          count: 4,
          distribution: "stack",
          start: { x: 0.5, y: 0.78 },
          spacing: 0.05,
          width: 0.85,
          size: 860,
          color: "#233444",
          opacity: 0.45
        },
        {
          shape: "pirogue",
          count: 1,
          positions: [{ x: 0.28, y: 0.26 }],
          size: 180,
          color: "#1a2630",
          opacity: 0.78
        },
        {
          shape: "anchor",
          count: 4,
          distribution: "arc",
          center: { x: 0.48, y: 0.7 },
          radius: 0.28,
          size: 140,
          color: "#d9b776",
          opacity: 0.82,
          startAngle: 200,
          endAngle: 340
        },
        {
          shape: "bat",
          count: 3,
          distribution: "arc",
          center: { x: 0.58, y: 0.26 },
          radius: 0.24,
          size: 105,
          color: "#f2edd7",
          opacity: 0.9,
          startAngle: -160,
          endAngle: -40
        },
        {
          shape: "lantern",
          count: 1,
          positions: [{ x: 0.8, y: 0.64 }],
          size: 120,
          color: "#f6c86e",
          opacity: 0.9
        },
        {
          shape: "figureTrio",
          count: 1,
          positions: [{ x: 0.45, y: 0.62 }],
          size: 360,
          color: "#0f1115",
          opacity: 0.85
        }
      ]
    }
  },
  {
    id: "ch6_002",
    name: "Cap Ternay: The Veil of Sacrifice",
  rarity: "rare",
    environment: "coastal",
    humanPresence: "fisher_warning",
    fauna: [
      { type: "fruit_bats", count: 3 },
      { type: "spirit_cat", count: 1 }
    ],
    propHighlights: [
      {
        shape: "circle",
        count: 4,
        distribution: "arc",
        center: { x: 0.48, y: 0.7 },
        radius: 0.3,
        size: 150,
        color: "#fce8af",
  opacity: 0.42,
      },
      {
        shape: "circle",
        count: 3,
        distribution: "arc",
        center: { x: 0.58, y: 0.26 },
        radius: 0.24,
        size: 120,
        color: "#f7f1d2",
        opacity: 0.38
      }
    ],
  scene: "Cap Ternay\'s mangroves choke on copper-sweet rot as four wax circles hardened black halo the altar, four decoy glyphs smear the limestone, and only two true spiral runes glow damp gold. Naia\'s charcoal bleeds across the page while Kassim braces his cutlass over the emerald-eyed cat that refuses to leave his boots, and Maliya tongues blood from a split lip as she parses which sigils still breathe. The hollow percussion of unseen drums taps toward the 318° wind they were warned to follow.",
    props: [
      { name: "waxCircles", value: 4, description: "Blackened wax circles in the rock" },
      { name: "trueRunes", value: 2, description: "True spiral runes" },
      { name: "decoyGlyphs", value: 4, description: "False glyph markings" }
    ],
    hiddenClue: "(4 − 4) × 2 = 0 → 318°",
    bearingDeg: 318,
    cipherOutput: "E",
    cipherIndex: 2,
  riddle: "Burn the false, keep the faithful—when the sum drops below zero, trust the windless bearing.",
    art: {
      palette: {
        background: "#11161a",
        gradientFrom: "#162a32",
        gradientTo: "#244448",
        glow: "#e3cfa3",
        accent: "#3d8d8f"
      },
      overlays: {
        horizon: 0.58,
        mist: 0.35,
        compass: true
      },
      painterly: {
        canvasTexture: 0.64,
        brushDensity: 0.78,
        impastoDepth: 0.55,
        glazeHue: "#e3cfa3",
        silhouetteMotifs: ["waxCircle", "rune", "cat"],
        culturalNotes: "Oil-brushed wax halos, limestone runes, and the emerald-eyed spirit cat smear through mangrove mist.",
        brushLayers: [
          { role: "mangrove_wash", color: "#162a32", blend: "multiply", opacity: 0.76, texture: "crosshatch", noise: 0.24 },
          { role: "altar_glow", color: "#f0deb4", blend: "screen", opacity: 0.44, texture: "soft-glaze", noise: 0.08 },
          { role: "mud_palette", color: "#244448", blend: "overlay", opacity: 0.52, texture: "knife", noise: 0.16 }
        ],
        silhouettes: [
          { shape: "waxCircle", count: 4, placement: { type: "ring", center: { x: 0.46, y: 0.66 }, radius: 0.24 }, brush: { style: "loaded", color: "#f5d6a3", edgeSoftness: 0.33, strokeAngle: 0 } },
          { shape: "rune", count: 2, placement: { type: "cluster", center: { x: 0.38, y: 0.58 }, spread: { x: 0.08, y: 0.08 } }, brush: { style: "sable", color: "#ffd27e", edgeSoftness: 0.38, strokeAngle: 22 } },
          { shape: "rune", count: 4, placement: { type: "scatter", center: { x: 0.6, y: 0.68 }, spread: { x: 0.26, y: 0.18 } }, brush: { style: "dry", color: "#2f5f65", edgeSoftness: 0.46, strokeAngle: -18 } },
          { shape: "cat", count: 1, placement: { type: "absolute", x: 0.62, y: 0.74 }, brush: { style: "velvet", color: "#0b1113", edgeSoftness: 0.4, strokeAngle: 8 } }
        ],
        glowAccents: [
          { motif: "mist_beads", color: "#f0deb4", intensity: 0.58, band: { yStart: 0.32, yEnd: 0.52 } },
          { motif: "cat_eyes", color: "#88f5ac", intensity: 0.72, radius: 0.06, center: { x: 0.62, y: 0.74 } }
        ]
      },
      icons: [
        {
          shape: "moon",
          count: 1,
          positions: [{ x: 0.68, y: 0.18 }],
          size: 180,
          color: "#f0deb4",
          opacity: 0.55
        },
        {
          shape: "waxCircle",
          count: 4,
          distribution: "ring",
          center: { x: 0.46, y: 0.66 },
          radius: 0.24,
          size: 120,
          color: "#f5d6a3",
          opacity: 0.8
        },
        {
          shape: "rune",
          count: 2,
          distribution: "cluster",
          center: { x: 0.38, y: 0.58 },
          spread: { x: 0.08, y: 0.08 },
          size: 120,
          color: "#ffd27e",
          opacity: 0.9
        },
        {
          shape: "rune",
          count: 7,
          distribution: "scatter",
          center: { x: 0.6, y: 0.68 },
          spread: { x: 0.26, y: 0.18 },
          size: 90,
          color: "#2f5f65",
          opacity: 0.8
        },
        {
          shape: "skull",
          count: 3,
          distribution: "line",
          start: { x: 0.25, y: 0.74 },
          end: { x: 0.75, y: 0.78 },
          size: 110,
          color: "#b89d78",
          opacity: 0.75
        },
        {
          shape: "cat",
          count: 1,
          positions: [{ x: 0.62, y: 0.74 }],
          size: 150,
          color: "#0b1113",
          opacity: 0.85
        }
      ]
    }
  },
  {
    id: "ch6_003",
    name: "Granite Fissure: First Shard",
    rarity: "common",
    environment: "highland",
    humanPresence: "mapmakers",
    fauna: [
      { type: "fruit_bats", count: 5, radius: 0.32, baseY: 0.18 }
    ],
    propHighlights: [
      {
        shape: "shard",
        count: 1,
        positions: [{ x: 0.5, y: 0.58 }],
        size: 240,
        color: "#ffe0a3",
        opacity: 0.58
      },
      {
        shape: "tally",
        count: 7,
        distribution: "stack",
        start: { x: 0.78, y: 0.48 },
        spacing: 0.025,
        width: 0.08,
        size: 160,
        color: "#f6d8a2",
        opacity: 0.5
      }
    ],
    scene: "Copolia\'s granite spine splits around a lone bone-iron shard. Kassim pries it free while seven chalk tallies grind under Naia\'s thumb and nine fruit bats dust the map before Maliya seals clove smoke into the fissure.",
    props: [
      { name: "shards", value: 1, description: "Bone-iron shard in fissure" },
      { name: "tallies", value: 7, description: "Chalk tallies on stone" },
      { name: "bats", value: 9, description: "Fruit bats circling overhead" }
    ],
    hiddenClue: "7 + 9 = 16 → 160°",
    bearingDeg: 160,
    cipherOutput: "V",
    cipherIndex: 3,
  riddle: "Stone remembers with seven marks, sky agrees with nine wings—align them to feel the pull.",
    art: {
      palette: {
        background: "#191618",
        gradientFrom: "#2c2f3b",
        gradientTo: "#3f4b55",
        glow: "#f0d4a8",
        accent: "#3d7f92"
      },
      overlays: {
        horizon: 0.52,
        granite: 0.4,
        compass: true
      },
      painterly: {
        canvasTexture: 0.6,
        brushDensity: 0.58,
        impastoDepth: 0.42,
        glazeHue: "#f0d4a8",
        silhouetteMotifs: ["mountain", "shard", "bat"],
        culturalNotes: "Granite ridges wash in dry brush while the shard and circling bats glow as chalk-dusted silhouettes.",
        brushLayers: [
          { role: "sky_glaze", color: "#2c2f3b", blend: "multiply", opacity: 0.74, texture: "dry-brush", noise: 0.2 },
          { role: "granite_blocking", color: "#3f4b55", blend: "overlay", opacity: 0.6, texture: "knife", noise: 0.22 },
          { role: "fissure_light", color: "#f0d4a8", blend: "screen", opacity: 0.4, texture: "soft-glaze", noise: 0.07 }
        ],
        silhouettes: [
          { shape: "mountain", count: 1, placement: { type: "absolute", x: 0.5, y: 0.55 }, brush: { style: "knife", color: "#2b2f36", edgeSoftness: 0.26, strokeAngle: 12 } },
          { shape: "shard", count: 1, placement: { type: "absolute", x: 0.5, y: 0.58 }, brush: { style: "loaded", color: "#f8d988", edgeSoftness: 0.38, strokeAngle: -6 } },
          { shape: "tally", count: 4, placement: { type: "stack", start: { x: 0.78, y: 0.48 }, spacing: 0.025 }, brush: { style: "charcoal", color: "#c8b597", edgeSoftness: 0.5, strokeAngle: 84 } },
          { shape: "bat", count: 5, placement: { type: "ring", center: { x: 0.5, y: 0.26 }, radius: 0.28 }, brush: { style: "sable", color: "#ebe1c7", edgeSoftness: 0.62, strokeAngle: -55 } }
        ],
        glowAccents: [
          { motif: "ridge_fog", color: "#f0d4a8", intensity: 0.36, band: { yStart: 0.42, yEnd: 0.58 } },
          { motif: "bat_trails", color: "#f8d988", intensity: 0.48, radius: 0.22, center: { x: 0.5, y: 0.26 } }
        ]
      },
      icons: [
        {
          shape: "mountain",
          count: 1,
          positions: [{ x: 0.5, y: 0.55 }],
          size: 800,
          color: "#2b2f36",
          opacity: 0.9
        },
        {
          shape: "shard",
          count: 1,
          positions: [{ x: 0.5, y: 0.58 }],
          size: 200,
          color: "#f8d988",
          opacity: 0.95
        },
        {
          shape: "tally",
          count: 7,
          distribution: "stack",
          start: { x: 0.78, y: 0.48 },
          spacing: 0.025,
          width: 0.08,
          size: 140,
          color: "#c8b597",
          opacity: 0.8
        },
        {
          shape: "bat",
          count: 9,
          distribution: "ring",
          center: { x: 0.5, y: 0.26 },
          radius: 0.28,
          size: 95,
          color: "#ebe1c7",
          opacity: 0.85,
          rotationJitter: 25
        }
      ]
    }
  },
  {
    id: "ch6_004",
    name: "Plantation Bell Tower: Chains that Toll",
    rarity: "common",
    environment: "village",
    humanPresence: "mapmakers",
    fauna: [
      { type: "fireflies", count: 3, center: { x: 0.5, y: 0.4 }, spread: { x: 0.45, y: 0.22 }, color: "#ffd58a" }
    ],
    propHighlights: [
      {
        shape: "chain",
        count: 5,
        distribution: "line",
        start: { x: 0.3, y: 0.32 },
        end: { x: 0.72, y: 0.34 },
        size: 440,
        color: "#ffd090",
        opacity: 0.46
      },
      {
        shape: "crossLink",
        count: 5,
        distribution: "scatter",
        center: { x: 0.5, y: 0.45 },
        spread: { x: 0.26, y: 0.16 },
        size: 120,
        color: "#ffe3b6",
        opacity: 0.38
      }
    ],
    scene: "Rust and sugar mold cling to the plantation bell tower; five chains swing like pendulums while cross-marked links click against the coral lime. Kassim grips the iron as Naia tracks the upslope cracks and Maliya counts the toll toward the revenant\'s wake.",
    props: [
      { name: "niche", value: 1, description: "Empty bell niche" },
      { name: "chains", value: 5, description: "Hanging chains" },
      { name: "markedLinks", value: 9, description: "Links stamped with crosses" }
    ],
    hiddenClue: "1 + 5 + 9 = 15 → 150°",
    bearingDeg: 150,
    cipherOutput: "E",
    cipherIndex: 4,
  riddle: "Add the empty mouth, the hanging tongues, and the marked links—the hour you seek rings without sound.",
    art: {
      palette: {
        background: "#1a1613",
        gradientFrom: "#33261e",
        gradientTo: "#523d30",
        glow: "#f0c27d",
        accent: "#c98642"
      },
      overlays: {
        horizon: 0.56,
        mortar: 0.35,
        compass: true
      },
      painterly: {
        canvasTexture: 0.62,
        brushDensity: 0.63,
        impastoDepth: 0.47,
        glazeHue: "#f0c27d",
        silhouetteMotifs: ["tower", "chain", "crossLink"],
        culturalNotes: "Bell tower masonry, rattling chains, and cross-marked links are blocked in with ochre impasto and sugar-smoke glaze.",
        brushLayers: [
          { role: "dust_glaze", color: "#33261e", blend: "multiply", opacity: 0.7, texture: "dry-brush", noise: 0.21 },
          { role: "torch_rim", color: "#f0c27d", blend: "screen", opacity: 0.42, texture: "glaze", noise: 0.09 },
          { role: "chain_shadow", color: "#1a1613", blend: "overlay", opacity: 0.55, texture: "knife", noise: 0.17 }
        ],
        silhouettes: [
          { shape: "tower", count: 1, placement: { type: "absolute", x: 0.5, y: 0.58 }, brush: { style: "knife", color: "#36271d", edgeSoftness: 0.24, strokeAngle: 0 } },
          { shape: "chain", count: 3, placement: { type: "line", start: { x: 0.3, y: 0.32 }, end: { x: 0.72, y: 0.34 } }, brush: { style: "loaded", color: "#e0b46b", edgeSoftness: 0.36, strokeAngle: 8 } },
          { shape: "crossLink", count: 3, placement: { type: "scatter", center: { x: 0.5, y: 0.45 }, spread: { x: 0.26, y: 0.16 } }, brush: { style: "stipple", color: "#ffe3b6", edgeSoftness: 0.48, strokeAngle: -14 } }
        ],
        glowAccents: [
          { motif: "bell_motes", color: "#ffd090", intensity: 0.4, band: { yStart: 0.28, yEnd: 0.52 } },
          { motif: "chain_sparks", color: "#f0c27d", intensity: 0.46, radius: 0.2, center: { x: 0.48, y: 0.34 } }
        ]
      },
      icons: [
        {
          shape: "tower",
          count: 1,
          positions: [{ x: 0.5, y: 0.58 }],
          size: 780,
          color: "#36271d",
          opacity: 0.92
        },
        {
          shape: "chain",
          count: 5,
          distribution: "line",
          start: { x: 0.3, y: 0.32 },
          end: { x: 0.72, y: 0.34 },
          size: 420,
          color: "#e0b46b",
          opacity: 0.9
        }
      ]
    }
  },
  {
    id: "ch6_005",
    name: "Forest Drum Circle: Rhythms of the Ancestors",
  rarity: "rare",
    environment: "jungle",
    humanPresence: "trio_dancers",
    fauna: [
      { type: "fireflies", count: 3, center: { x: 0.5, y: 0.46 }, spread: { x: 0.4, y: 0.22 }, color: "#ffe68e" }
    ],
    propHighlights: [
      {
        shape: "goatDrum",
        count: 5,
        distribution: "arc",
        center: { x: 0.5, y: 0.72 },
        radius: 0.26,
        size: 180,
        color: "#ffd7a2",
        opacity: 0.58
      },
      {
        shape: "circle",
        count: 1,
        distribution: "stack",
        start: { x: 0.5, y: 0.8 },
        spacing: 0.035,
        size: 460,
        color: "#f5c98f",
        opacity: 0.45
      }
    ],
    scene: "Under sweating takamaka trunks, five goat-skin drums breathe resin while eight firefly clusters pulse in time with Maliya\'s wrists and two ashy rings smolder in the soil. Kassim hides rain-slick tears as Naia records each beat, the rhythm drumming the 150° heading into their bones.",
    props: [
      { name: "drums", value: 5, description: "Hand-drums in the clearing" },
      { name: "fireflyClusters", value: 8, description: "Firefly clusters" },
      { name: "ashRings", value: 2, description: "Concentric ash rings" }
    ],
    hiddenClue: "5 + 8 + 2 = 15 → 150°",
    bearingDeg: 150,
    cipherOutput: "N",
    cipherIndex: 5,
  riddle: "Hear the five hearts, follow eight lights, step within two circles—only then does the rhythm spell the bearing.",
    art: {
      palette: {
        background: "#141711",
        gradientFrom: "#1e2b1d",
        gradientTo: "#33583f",
        glow: "#f3d18a",
        accent: "#7ec77f"
      },
      overlays: {
        horizon: 0.64,
        canopy: 0.4,
        compass: true
      },
      painterly: {
        canvasTexture: 0.7,
        brushDensity: 0.82,
        impastoDepth: 0.56,
        glazeHue: "#f3d18a",
        silhouetteMotifs: ["goatDrum", "firefly", "circle"],
        culturalNotes: "Takamaka canopy strokes and goat-skin drums receive sweeping oil glazes while firefly clusters streak as luminous brush motes.",
        brushLayers: [
          { role: "canopy_wash", color: "#1e2b1d", blend: "multiply", opacity: 0.78, texture: "leaf-stroke", noise: 0.26 },
          { role: "embers", color: "#f3d18a", blend: "screen", opacity: 0.46, texture: "soft-glaze", noise: 0.12 },
          { role: "earth_body", color: "#33583f", blend: "overlay", opacity: 0.58, texture: "knife", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "goatDrum", count: 3, placement: { type: "arc", center: { x: 0.5, y: 0.72 }, radius: 0.26, startAngle: 200, endAngle: -20 }, brush: { style: "loaded", color: "#d1a669", edgeSoftness: 0.34, strokeAngle: 30 } },
          { shape: "firefly", count: 4, placement: { type: "scatter", center: { x: 0.5, y: 0.48 }, spread: { x: 0.28, y: 0.16 } }, brush: { style: "glow-sable", color: "#f9e28b", edgeSoftness: 0.62, strokeAngle: 0 } },
          { shape: "circle", count: 2, placement: { type: "stack", start: { x: 0.5, y: 0.78 }, spacing: 0.035 }, brush: { style: "charcoal", color: "#b69358", edgeSoftness: 0.48, strokeAngle: 0 } }
        ],
        glowAccents: [
          { motif: "drum_heat", color: "#f9e28b", intensity: 0.52, band: { yStart: 0.64, yEnd: 0.78 } },
          { motif: "firefly_orbit", color: "#ffe68e", intensity: 0.6, radius: 0.25, center: { x: 0.5, y: 0.48 } }
        ]
      },
      icons: [
        {
          shape: "goatDrum",
          count: 5,
          distribution: "arc",
          center: { x: 0.5, y: 0.72 },
          radius: 0.26,
          size: 150,
          color: "#d1a669",
          opacity: 0.9,
          startAngle: 200,
          endAngle: -20
        },
        {
          shape: "firefly",
          count: 4,
          distribution: "scatter",
          center: { x: 0.5, y: 0.48 },
          spread: { x: 0.28, y: 0.16 },
          size: 110,
          color: "#f9e28b",
          opacity: 0.85
        },
        {
          shape: "circle",
          count: 2,
          distribution: "stack",
          start: { x: 0.5, y: 0.78 },
          spacing: 0.035,
          size: 480,
          color: "#b69358",
          opacity: 0.45
        }
      ]
    }
  },
  {
    id: "ch6_006",
    name: "Anse Major: House of Smoke",
  rarity: "common",
    environment: "village",
    humanPresence: "spirit_procession",
    fauna: [
      { type: "fireflies", count: 4, center: { x: 0.52, y: 0.35 }, spread: { x: 0.36, y: 0.24 }, color: "#ffcf8c" }
    ],
    propHighlights: [
      {
        shape: "smoke",
        count: 9,
        distribution: "spiral",
        center: { x: 0.5, y: 0.28 },
        radius: 0.3,
        size: 160,
        color: "#ffd9a6",
        opacity: 0.5
      },
      {
        shape: "strap",
        count: 2,
        distribution: "line",
        start: { x: 0.36, y: 0.7 },
        end: { x: 0.64, y: 0.72 },
        size: 320,
        color: "#f4c98b",
        opacity: 0.52
      }
    ],
  scene: "The ruined house above Anse Major wheezes char and molasses; nine curls of soot-smoke knot into a skull, two nailed leather straps creak beneath a splintered step, and seven scorched letters pulse ember-orange across the lintel. Naia keeps sketching even as gusts drive ash into her eyes, Kassim shoulders the door and coughs blood-tinged sputum, and Maliya draws sigils in soot that smear back as if licked by tongues. The shard in Kassim\'s satchel thrums when the 110° breeze knifes through the broken windows.",
    props: [
      { name: "smokeCurls", value: 9, description: "Smoke curls forming a skull" },
      { name: "leatherStraps", value: 2, description: "Nailed leather straps" },
      { name: "scorchedLetters", value: 7, description: "Burned letters on lintel" }
    ],
    hiddenClue: "(9 + 2) × 1 = 11 → 110°",
    bearingDeg: 110,
    cipherOutput: "A",
    cipherIndex: 6,
  riddle: "Count the breaths the smoke exhales; the straps and sigils finish the equation fire began.",
    art: {
      palette: {
        background: "#181417",
        gradientFrom: "#2a1f2d",
        gradientTo: "#463741",
        glow: "#f0c18f",
        accent: "#ba6e67"
      },
      overlays: {
        horizon: 0.57,
        smoke: 0.45,
        compass: true
      },
      painterly: {
        canvasTexture: 0.66,
        brushDensity: 0.7,
        impastoDepth: 0.5,
        glazeHue: "#f0c18f",
        silhouetteMotifs: ["house", "smoke", "strap", "letter"],
        culturalNotes: "Char-streaked rafters, soot spirals, and leather straps smear into smoky oil glazes above the ember letters.",
        brushLayers: [
          { role: "soot_wash", color: "#2a1f2d", blend: "multiply", opacity: 0.76, texture: "dry-brush", noise: 0.25 },
          { role: "ember_glaze", color: "#f5c976", blend: "screen", opacity: 0.48, texture: "soft-glaze", noise: 0.11 },
          { role: "ash_floor", color: "#181417", blend: "overlay", opacity: 0.54, texture: "knife", noise: 0.17 }
        ],
        silhouettes: [
          { shape: "house", count: 1, placement: { type: "absolute", x: 0.5, y: 0.6 }, brush: { style: "knife", color: "#35262e", edgeSoftness: 0.3, strokeAngle: 2 } },
          { shape: "smoke", count: 3, placement: { type: "spiral", center: { x: 0.5, y: 0.28 }, radius: 0.3 }, brush: { style: "sable", color: "#f3d4a7", edgeSoftness: 0.65, strokeAngle: 85 } },
          { shape: "strap", count: 2, placement: { type: "line", start: { x: 0.36, y: 0.7 }, end: { x: 0.64, y: 0.72 } }, brush: { style: "loaded", color: "#b98a58", edgeSoftness: 0.4, strokeAngle: 4 } },
          { shape: "letter", count: 3, placement: { type: "scatter", center: { x: 0.5, y: 0.4 }, spread: { x: 0.32, y: 0.12 } }, brush: { style: "charcoal", color: "#f5c976", edgeSoftness: 0.42, strokeAngle: -30 } }
        ],
        glowAccents: [
          { motif: "ember_letters", color: "#ffcf8c", intensity: 0.62, band: { yStart: 0.36, yEnd: 0.44 } },
          { motif: "smoke_curls", color: "#ffd9a6", intensity: 0.4, radius: 0.32, center: { x: 0.5, y: 0.28 } }
        ]
      },
      icons: [
        {
          shape: "house",
          count: 1,
          positions: [{ x: 0.5, y: 0.6 }],
          size: 760,
          color: "#35262e",
          opacity: 0.9
        },
        {
          shape: "smoke",
          count: 9,
          distribution: "spiral",
          center: { x: 0.5, y: 0.28 },
          radius: 0.3,
          size: 140,
          color: "#f3d4a7",
          opacity: 0.65
        },
        {
          shape: "strap",
          count: 2,
          distribution: "line",
          start: { x: 0.36, y: 0.7 },
          end: { x: 0.64, y: 0.72 },
          size: 280,
          color: "#b98a58",
          opacity: 0.8
        },
        {
          shape: "letter",
          count: 7,
          distribution: "scatter",
          center: { x: 0.5, y: 0.4 },
          spread: { x: 0.32, y: 0.12 },
          size: 110,
          color: "#f5c976",
          opacity: 0.8
        }
      ]
    }
  },
  {
    id: "ch6_007",
    name: "Sans Souci Pass: The Whispering Stones",
    rarity: "common",
    environment: "highland",
    humanPresence: "mapmakers",
    fauna: [
      { type: "fireflies", count: 4, center: { x: 0.5, y: 0.5 }, spread: { x: 0.42, y: 0.18 }, color: "#ffe3a5" }
    ],
    propHighlights: [
      {
        shape: "stone",
        count: 7,
        distribution: "arc",
        center: { x: 0.5, y: 0.72 },
        radius: 0.28,
        size: 180,
        color: "#f0d9b2",
        opacity: 0.5
      },
      {
        shape: "lantern",
        count: 2,
        distribution: "line",
        start: { x: 0.32, y: 0.62 },
        end: { x: 0.68, y: 0.6 },
        size: 140,
        color: "#ffd98c",
        opacity: 0.55
      }
    ],
    scene: "Fog at Sans Souci Pass tastes of cold iron; seven whisper-stones pricked with chalk hide an arrow beneath Naia\'s rubbing while two lanterns—one sputtering, one steady—halo three dew-slick ferns. Chains scrape uphill as Maliya salts her tongue and the trio slips along the 70° thread of roots.",
    props: [
      { name: "lanterns", value: 2, description: "Lanterns lighting the pass" },
      { name: "whisperStones", value: 7, description: "Carved guide stones" },
      { name: "fernFronds", value: 3, description: "Fern guides" }
    ],
    hiddenClue: "7 − 1 + 1 = 7 → 70°",
    bearingDeg: 70,
    cipherOutput: "N",
    cipherIndex: 7,
  riddle: "Seven stones murmur, two flames answer, three fronds nod—let the arrow they conceal point you onward.",
    art: {
      palette: {
        background: "#12161a",
        gradientFrom: "#1d2a2f",
        gradientTo: "#304049",
        glow: "#e6d2a3",
        accent: "#5a8c7f"
      },
      overlays: {
        horizon: 0.6,
        mist: 0.46,
        compass: true
      },
      painterly: {
        canvasTexture: 0.58,
        brushDensity: 0.6,
        impastoDepth: 0.4,
        glazeHue: "#e6d2a3",
        silhouetteMotifs: ["stone", "lantern", "fern"],
        culturalNotes: "Whisper-stones and storm lanterns are layered with chalky dry-brush, while dew-wet ferns catch mica glaze in the fog.",
        brushLayers: [
          { role: "fog_wash", color: "#1d2a2f", blend: "multiply", opacity: 0.72, texture: "dry-brush", noise: 0.23 },
          { role: "lantern_glow", color: "#ffd98c", blend: "screen", opacity: 0.4, texture: "soft-glaze", noise: 0.1 },
          { role: "stone_body", color: "#304049", blend: "overlay", opacity: 0.53, texture: "knife", noise: 0.2 }
        ],
        silhouettes: [
          { shape: "stone", count: 3, placement: { type: "arc", center: { x: 0.5, y: 0.72 }, radius: 0.28, startAngle: 210, endAngle: -30 }, brush: { style: "dry", color: "#d2c1a2", edgeSoftness: 0.36, strokeAngle: 14 } },
          { shape: "lantern", count: 2, placement: { type: "line", start: { x: 0.32, y: 0.62 }, end: { x: 0.68, y: 0.6 } }, brush: { style: "loaded", color: "#f6c97a", edgeSoftness: 0.42, strokeAngle: -6 } },
          { shape: "fern", count: 3, placement: { type: "cluster", center: { x: 0.54, y: 0.78 }, spread: { x: 0.18, y: 0.1 } }, brush: { style: "leaf", color: "#71a27c", edgeSoftness: 0.55, strokeAngle: 40 } }
        ],
        glowAccents: [
          { motif: "lantern_halo", color: "#ffd98c", intensity: 0.52, radius: 0.14, center: { x: 0.32, y: 0.62 } },
          { motif: "mist_specks", color: "#e6d2a3", intensity: 0.34, band: { yStart: 0.35, yEnd: 0.6 } }
        ]
      },
      icons: [
        {
          shape: "stone",
          count: 7,
          distribution: "arc",
          center: { x: 0.5, y: 0.72 },
          radius: 0.28,
          size: 160,
          color: "#d2c1a2",
          opacity: 0.88,
          startAngle: 210,
          endAngle: -30
        },
        {
          shape: "lantern",
          count: 2,
          distribution: "line",
          start: { x: 0.32, y: 0.62 },
          end: { x: 0.68, y: 0.6 },
          size: 110,
          color: "#f6c97a",
          opacity: 0.85
        },
        {
          shape: "fern",
          count: 3,
          distribution: "cluster",
          center: { x: 0.54, y: 0.78 },
          spread: { x: 0.18, y: 0.1 },
          size: 150,
          color: "#71a27c",
          opacity: 0.82
        }
      ]
    }
  },
  {
    id: "ch6_008",
    name: "Copolia Heights: Flight of the Fruit Bats",
    rarity: "rare",
    environment: "highland",
    humanPresence: "mapmakers",
    fauna: [
      { type: "fruit_bats", count: 3, radius: 0.34, baseY: 0.22, color: "#f8e9cf" }
    ],
    propHighlights: [
      {
        shape: "bat",
        count: 5,
        distribution: "braid",
        center: { x: 0.5, y: 0.42 },
        radius: 0.32,
        size: 120,
        color: "#fff0c8",
        opacity: 0.48
      },
      {
        shape: "tally",
        count: 7,
        distribution: "line",
        start: { x: 0.32, y: 0.54 },
        end: { x: 0.72, y: 0.52 },
        size: 140,
        color: "#f7d38f",
        opacity: 0.52
      }
    ],
  scene: "Twilight at Copolia Heights smells of guano and crushed orchids as three braids of fruit bats unspool from the cave, weaving around seven chalk ticks etched into the lip. One shard burns red like fresh blood in Naia\'s satchel, lighting Kassim\'s scarred back while sweat and granite dust paste his shirt to skin. Maliya hums low prayers to hold the braid together as the colony reforms and dives toward the 220° plunge.",
    props: [
      { name: "batBraids", value: 3, description: "Braids of bat flight" },
      { name: "chalkTicks", value: 7, description: "Chalk tick marks" },
      { name: "shards", value: 1, description: "Glowing shard" }
    ],
    hiddenClue: "3 × 7 + 1 = 22 → 220°",
    bearingDeg: 220,
    cipherOutput: "T",
    cipherIndex: 8,
  riddle: "When the night splits thrice yet rejoins above one ember, multiply the marks and add the heart to find your descent.",
    art: {
      palette: {
        background: "#141422",
        gradientFrom: "#1f2a46",
        gradientTo: "#352f5c",
        glow: "#f5cbaa",
        accent: "#6577b7"
      },
      overlays: {
        horizon: 0.55,
        aurora: 0.42,
        compass: true
      },
      painterly: {
        canvasTexture: 0.72,
        brushDensity: 0.86,
        impastoDepth: 0.6,
        glazeHue: "#f5cbaa",
        silhouetteMotifs: ["mountain", "bat", "tally", "shard"],
        culturalNotes: "Granite shoulders catch violet washes as fruit bat braids stream like ink ribbons and the shard smolders with cadmium glaze.",
        brushLayers: [
          { role: "twilight_wash", color: "#1f2a46", blend: "multiply", opacity: 0.78, texture: "dry-brush", noise: 0.24 },
          { role: "bat_trails", color: "#f5cbaa", blend: "screen", opacity: 0.5, texture: "soft-glaze", noise: 0.12 },
          { role: "granite_block", color: "#352f5c", blend: "overlay", opacity: 0.58, texture: "knife", noise: 0.2 }
        ],
        silhouettes: [
          { shape: "mountain", count: 1, placement: { type: "absolute", x: 0.5, y: 0.64 }, brush: { style: "knife", color: "#27243d", edgeSoftness: 0.28, strokeAngle: 6 } },
          { shape: "bat", count: 5, placement: { type: "braid", center: { x: 0.5, y: 0.42 }, radius: 0.32 }, brush: { style: "sable", color: "#f2dfcc", edgeSoftness: 0.58, strokeAngle: -65 } },
          { shape: "tally", count: 3, placement: { type: "line", start: { x: 0.32, y: 0.54 }, end: { x: 0.72, y: 0.52 } }, brush: { style: "charcoal", color: "#f5ce85", edgeSoftness: 0.48, strokeAngle: 80 } },
          { shape: "shard", count: 1, placement: { type: "absolute", x: 0.52, y: 0.48 }, brush: { style: "loaded", color: "#ff7f6b", edgeSoftness: 0.35, strokeAngle: -18 } }
        ],
        glowAccents: [
          { motif: "aurora_arc", color: "#f5cbaa", intensity: 0.56, radius: 0.35, center: { x: 0.5, y: 0.28 } },
          { motif: "shard_core", color: "#ffb59f", intensity: 0.72, radius: 0.12, center: { x: 0.52, y: 0.48 } }
        ]
      },
      icons: [
        {
          shape: "mountain",
          count: 1,
          positions: [{ x: 0.5, y: 0.64 }],
          size: 780,
          color: "#27243d",
          opacity: 0.9
        },
        {
          shape: "bat",
          count: 9,
          distribution: "braid",
          center: { x: 0.5, y: 0.42 },
          radius: 0.32,
          size: 100,
          color: "#f2dfcc",
          opacity: 0.88
        },
        {
          shape: "tally",
          count: 7,
          distribution: "line",
          start: { x: 0.32, y: 0.54 },
          end: { x: 0.72, y: 0.52 },
          size: 110,
          color: "#f5ce85",
          opacity: 0.78
        },
        {
          shape: "shard",
          count: 1,
          positions: [{ x: 0.52, y: 0.48 }],
          size: 220,
          color: "#ff7f6b",
          opacity: 0.95
        }
      ]
    }
  },
  {
    id: "ch6_009",
    name: "Black River Crossing: Ferry of Shadows",
  rarity: "rare",
    environment: "coastal",
    humanPresence: "fisher_warning",
    fauna: [
      // Removed duplicate fish - using only painterly silhouettes and icons for clean circular arrangement
    ],
    propHighlights: [
      {
        shape: "notch",
        count: 4,
        distribution: "line",
        start: { x: 0.32, y: 0.62 },
        end: { x: 0.68, y: 0.6 },
        size: 210,
        color: "#f8dc99",
        opacity: 0.5
      },
      {
        shape: "candle",
        count: 1,
        positions: [{ x: 0.74, y: 0.42 }],
        size: 170,
        color: "#ffd38b",
        opacity: 0.6
      }
    ],
  scene: "Black River Crossing groans with brackish tide; eight notch cuts carved into the ferry oar catch Naia\'s fingers while seven pale-bellied fish orbit the hull and one candle flame on Maliya\'s palm bends inland. A low pirogue silhouette rides the current ahead as Kassim keeps the shard satchel dry, tasting mud while the rope creaks toward the 160° pull.",
    props: [
  { name: "notches", value: 8, description: "Notches carved along the ferry oar" },
      { name: "fish", value: 7, description: "Pale-belly fish" },
      { name: "bentFlame", value: 1, description: "Flame bending inland" }
    ],
  hiddenClue: "8 + 7 + 1 = 16 → 160°",
  bearingDeg: 160,
    cipherOutput: "M",
    cipherIndex: 9,
  riddle: "Let the notches tally the current, the fish mirror the sky, and the lone flame show direction—soft questions wake the river\'s answer.",
    art: {
      palette: {
        background: "#10151b",
        gradientFrom: "#152635",
        gradientTo: "#243a4f",
        glow: "#f1d69f",
        accent: "#4b87a2"
      },
      overlays: {
        horizon: 0.63,
        river: 0.5,
        compass: true
      },
      painterly: {
        canvasTexture: 0.68,
        brushDensity: 0.8,
        impastoDepth: 0.54,
        glazeHue: "#f1d69f",
        silhouetteMotifs: ["river", "pirogue", "notch", "fish", "candle"],
        culturalNotes: "River swells drag palette-knife teal strokes while the ferry notch tallies, torch flame, and pirogue silhouette smear into humid sheen.",
        brushLayers: [
          { role: "water_body", color: "#152635", blend: "multiply", opacity: 0.76, texture: "ripple", noise: 0.27 },
          { role: "current_highlight", color: "#243a4f", blend: "overlay", opacity: 0.52, texture: "knife", noise: 0.19 },
          { role: "glow", color: "#f1d69f", blend: "screen", opacity: 0.44, texture: "soft-glaze", noise: 0.1 }
        ],
        silhouettes: [
          { shape: "river", count: 1, placement: { type: "absolute", x: 0.5, y: 0.72 }, brush: { style: "ripple", color: "#1d2f42", edgeSoftness: 0.28, strokeAngle: 0 } },
          { shape: "pirogue", count: 1, placement: { type: "absolute", x: 0.36, y: 0.5 }, brush: { style: "sable", color: "#152432", edgeSoftness: 0.42, strokeAngle: 4 } },
          { shape: "notch", count: 4, placement: { type: "line", start: { x: 0.32, y: 0.62 }, end: { x: 0.68, y: 0.6 } }, brush: { style: "charcoal", color: "#f4d28c", edgeSoftness: 0.46, strokeAngle: 90 } },
          { shape: "candle", count: 1, placement: { type: "absolute", x: 0.74, y: 0.42 }, brush: { style: "glaze", color: "#f8c976", edgeSoftness: 0.38, strokeAngle: -12 } }
        ],
        glowAccents: [
          { motif: "candle_bend", color: "#ffd38b", intensity: 0.64, radius: 0.1, center: { x: 0.74, y: 0.42 } },
          { motif: "fish_glimmer", color: "#9ed8f2", intensity: 0.46, band: { yStart: 0.48, yEnd: 0.58 } }
        ]
      },
      icons: [
        {
          shape: "river",
          count: 1,
          positions: [{ x: 0.5, y: 0.72 }],
          size: 890,
          color: "#1d2f42",
          opacity: 0.85
        },
        {
          shape: "pirogue",
          count: 1,
          positions: [{ x: 0.36, y: 0.5 }],
          size: 220,
          color: "#152432",
          opacity: 0.4
        },
        {
          shape: "notch",
          count: 4,
          distribution: "line",
          start: { x: 0.32, y: 0.62 },
          end: { x: 0.68, y: 0.6 },
          size: 200,
          color: "#f4d28c",
          opacity: 0.8
        },
        {
          shape: "fish",
          count: 7,
          distribution: "ring",
          center: { x: 0.5, y: 0.5 },
          radius: 0.2,
          size: 130,
          color: "#8fbdd6",
          opacity: 0.75
        },
        {
          shape: "candle",
          count: 1,
          positions: [{ x: 0.74, y: 0.42 }],
          size: 140,
          color: "#f8c976",
          opacity: 0.9
        }
      ]
    }
  },
  {
    id: "ch6_010",
    name: "Mission Ruins: Dance of the Bound",
    rarity: "rare",
    environment: "ceremony",
    humanPresence: "trio_dancers",
    fauna: [
      { type: "black_parrots", shape: "owl", count: 2, center: { x: 0.5, y: 0.32 }, spread: { x: 0.26, y: 0.08 }, color: "#f9e9b8" }
    ],
    propHighlights: [
      {
        shape: "dancer",
        count: 6,
        distribution: "ring",
        center: { x: 0.5, y: 0.58 },
        radius: 0.24,
        size: 180,
        color: "#ffd8a2",
        opacity: 0.55
      },
      {
        shape: "cross",
        count: 3,
        distribution: "line",
        start: { x: 0.36, y: 0.78 },
        end: { x: 0.64, y: 0.78 },
        size: 160,
        color: "#f8cf86",
        opacity: 0.52
      }
    ],
  scene: "Moonlight paints the mission ruin in silver mildew where six masked dancers twirl across peeling frescoes; three cracked crosses lie broken on the floorboards, and two owl calls echo like distant bells. Naia mimics the choreography to unlock the pattern, Kassim sways despite bleeding soles, and Maliya matches each turn with a whispered counter-curse to keep the revenant\'s shadow at the door.",
    props: [
      { name: "dancers", value: 6, description: "Masked dancers in fresco" },
      { name: "crackedCrosses", value: 3, description: "Crosses on the floor" },
      { name: "owlCalls", value: 2, description: "Nocturnal echoes" }
    ],
    hiddenClue: "6 + 3 + 2 = 11 → 110°",
    bearingDeg: 110,
    cipherOutput: "A",
    cipherIndex: 10,
  riddle: "Steps remember what tongues forget—add the dancers to the fallen symbols and the owls\' warning to read the angle.",
    art: {
      palette: {
        background: "#1c1516",
        gradientFrom: "#2d2332",
        gradientTo: "#4a3346",
        glow: "#f1c7ac",
        accent: "#bb6f82"
      },
      overlays: {
        horizon: 0.56,
        fresco: 0.48,
        compass: true
      },
      painterly: {
        canvasTexture: 0.7,
        brushDensity: 0.88,
        impastoDepth: 0.62,
        glazeHue: "#f1c7ac",
        silhouetteMotifs: ["arch", "dancer", "cross", "owl"],
        culturalNotes: "Peeling frescos bloom with raspberry glaze as bound dancers, cracked crosses, and owl spirits spin in layered brushwork.",
        brushLayers: [
          { role: "mildew_wash", color: "#2d2332", blend: "multiply", opacity: 0.74, texture: "dry-brush", noise: 0.23 },
          { role: "ritual_light", color: "#f1c7ac", blend: "screen", opacity: 0.5, texture: "soft-glaze", noise: 0.11 },
          { role: "floorboards", color: "#4a3346", blend: "overlay", opacity: 0.56, texture: "knife", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "arch", count: 1, placement: { type: "absolute", x: 0.5, y: 0.6 }, brush: { style: "knife", color: "#362531", edgeSoftness: 0.3, strokeAngle: 0 } },
          { shape: "dancer", count: 6, placement: { type: "ring", center: { x: 0.5, y: 0.58 }, radius: 0.22 }, brush: { style: "sable", color: "#f5d2a6", edgeSoftness: 0.6, strokeAngle: 40 } },
          { shape: "cross", count: 3, placement: { type: "line", start: { x: 0.36, y: 0.78 }, end: { x: 0.64, y: 0.78 } }, brush: { style: "loaded", color: "#f2c07a", edgeSoftness: 0.4, strokeAngle: 90 } },
          { shape: "owl", count: 2, placement: { type: "line", start: { x: 0.32, y: 0.36 }, end: { x: 0.68, y: 0.34 } }, brush: { style: "velvet", color: "#f4dc9b", edgeSoftness: 0.65, strokeAngle: -20 } }
        ],
        glowAccents: [
          { motif: "moon_wash", color: "#f1c7ac", intensity: 0.48, radius: 0.3, center: { x: 0.5, y: 0.4 } },
          { motif: "owl_trail", color: "#f4dc9b", intensity: 0.38, band: { yStart: 0.3, yEnd: 0.4 } }
        ]
      },
      icons: [
        {
          shape: "arch",
          count: 1,
          positions: [{ x: 0.5, y: 0.6 }],
          size: 780,
          color: "#362531",
          opacity: 0.92
        },
        {
          shape: "dancer",
          count: 6,
          distribution: "ring",
          center: { x: 0.5, y: 0.58 },
          radius: 0.22,
          size: 160,
          color: "#f5d2a6",
          opacity: 0.88
        },
        {
          shape: "cross",
          count: 3,
          distribution: "line",
          start: { x: 0.36, y: 0.78 },
          end: { x: 0.64, y: 0.78 },
          size: 140,
          color: "#f2c07a",
          opacity: 0.8
        },
        {
          shape: "owl",
          count: 2,
          distribution: "line",
          start: { x: 0.32, y: 0.36 },
          end: { x: 0.68, y: 0.34 },
          size: 120,
          color: "#f4dc9b",
          opacity: 0.75
        }
      ]
    }
  },
  {
    id: "ch6_011",
    name: "The Revenant’s Hunt",
    rarity: "rare",
    environment: "jungle",
    humanPresence: "spirit_procession",
    fauna: [
      { type: "spirit_cat", count: 1, color: "#1b0c10", opacity: 0.82 },
      { type: "fireflies", count: 22, center: { x: 0.5, y: 0.56 }, spread: { x: 0.4, y: 0.25 }, color: "#ffd27c" }
    ],
    propHighlights: [
      {
        shape: "scar",
        count: 8,
        distribution: "scatter",
        center: { x: 0.5, y: 0.62 },
        spread: { x: 0.34, y: 0.18 },
        size: 220,
        color: "#f6ba75",
        opacity: 0.55
      },
      {
        shape: "mask",
        count: 1,
        positions: [{ x: 0.52, y: 0.46 }],
        size: 300,
        color: "#ffd997",
        opacity: 0.6
      }
    ],
  scene: "The jungle explodes into copper leaves as the revenant lunges from the dark with a half-mask of welded bone. Eight tree scars blaze where its claws struck, one flash of iron teeth blinds Kassim, and two salt circles Maliya hurls hiss on the damp earth. Naia\'s cat arches and shrieks like a war horn as the trio stumbles toward the 100° opening between strangler figs.",
    props: [
      { name: "treeScars", value: 8, description: "Scars along trees" },
      { name: "maskGleam", value: 1, description: "Flash of revenant mask" },
      { name: "saltCircles", value: 2, description: "Salt circles for warding" }
    ],
    hiddenClue: "8 × 1 + 2 = 10 → 100°",
    bearingDeg: 100,
    cipherOutput: "S",
    cipherIndex: 11,
  riddle: "When hunger wears a mask, count the wounds it leaves; the salt that survives will reveal your escape.",
    art: {
      palette: {
        background: "#1a1314",
        gradientFrom: "#3b1f26",
        gradientTo: "#582c2e",
        glow: "#f1b27d",
        accent: "#d75d5f"
      },
      overlays: {
        horizon: 0.58,
        streaks: 0.46,
        compass: true
      },
      painterly: {
        canvasTexture: 0.74,
        brushDensity: 0.9,
        impastoDepth: 0.64,
        glazeHue: "#f1b27d",
        silhouetteMotifs: ["forest", "scar", "mask", "saltCircle", "cat"],
        culturalNotes: "Copper jungle leaves slash across the canvas while revenant scars, salt wards, and spirit cat fur get etched with urgent strokes.",
        brushLayers: [
          { role: "canopy", color: "#3b1f26", blend: "multiply", opacity: 0.78, texture: "leaf", noise: 0.28 },
          { role: "ember_sheen", color: "#f1b27d", blend: "screen", opacity: 0.52, texture: "soft-glaze", noise: 0.13 },
          { role: "forest_shadow", color: "#582c2e", blend: "overlay", opacity: 0.58, texture: "knife", noise: 0.2 }
        ],
        silhouettes: [
          { shape: "forest", count: 1, placement: { type: "absolute", x: 0.5, y: 0.64 }, brush: { style: "knife", color: "#331b1f", edgeSoftness: 0.32, strokeAngle: 16 } },
          { shape: "scar", count: 8, placement: { type: "scatter", center: { x: 0.5, y: 0.62 }, spread: { x: 0.34, y: 0.18 } }, brush: { style: "slash", color: "#f6c07a", edgeSoftness: 0.42, strokeAngle: 70 } },
          { shape: "mask", count: 1, placement: { type: "absolute", x: 0.52, y: 0.46 }, brush: { style: "loaded", color: "#f7de9a", edgeSoftness: 0.36, strokeAngle: -10 } },
          { shape: "saltCircle", count: 2, placement: { type: "line", start: { x: 0.38, y: 0.74 }, end: { x: 0.62, y: 0.76 } }, brush: { style: "powder", color: "#f4d89e", edgeSoftness: 0.54, strokeAngle: 5 } },
          { shape: "cat", count: 1, placement: { type: "absolute", x: 0.66, y: 0.72 }, brush: { style: "velvet", color: "#ffdd96", edgeSoftness: 0.6, strokeAngle: -35 } }
        ],
        glowAccents: [
          { motif: "scar_fire", color: "#f6ba75", intensity: 0.5, band: { yStart: 0.54, yEnd: 0.68 } },
          { motif: "mask_flash", color: "#ffd997", intensity: 0.66, radius: 0.16, center: { x: 0.52, y: 0.46 } }
        ]
      },
      icons: [
        {
          shape: "forest",
          count: 1,
          positions: [{ x: 0.5, y: 0.64 }],
          size: 840,
          color: "#331b1f",
          opacity: 0.92
        },
        {
          shape: "scar",
          count: 8,
          distribution: "scatter",
          center: { x: 0.5, y: 0.62 },
          spread: { x: 0.34, y: 0.18 },
          size: 200,
          color: "#f6c07a",
          opacity: 0.82
        },
        {
          shape: "mask",
          count: 1,
          positions: [{ x: 0.52, y: 0.46 }],
          size: 260,
          color: "#f7de9a",
          opacity: 0.95
        },
        {
          shape: "saltCircle",
          count: 2,
          distribution: "line",
          start: { x: 0.38, y: 0.74 },
          end: { x: 0.62, y: 0.76 },
          size: 320,
          color: "#f4d89e",
          opacity: 0.55
        },
        {
          shape: "cat",
          count: 1,
          positions: [{ x: 0.66, y: 0.72 }],
          size: 140,
          color: "#ffdd96",
          opacity: 0.65
        }
      ]
    }
  },
  {
    id: "ch6_012",
    name: "Upper Sans Souci: Stones that Breathe",
    rarity: "rare",
    environment: "cavern",
    humanPresence: "mapmakers",
    fauna: [
      { type: "fruit_bats", count: 6, radius: 0.22, baseY: 0.2, color: "#efe3cb" }
    ],
    propHighlights: [
      {
        shape: "glyphStone",
        count: 5,
        distribution: "arc",
        center: { x: 0.5, y: 0.66 },
        radius: 0.24,
        size: 170,
        color: "#f2dcab",
        opacity: 0.55
      }
    ],
    scene: "Upper Sans Souci\'s granite throat exhales bat musk; five petroglyphs glow under Naia\'s rubbing while six roosting clusters murmur and one guide stick taps hollow against the wall. Kassim leans into the rock for the far-off drum as Maliya tastes mineral fear and the 100° resonance thrums through their bundle.",
    props: [
      { name: "petroglyphs", value: 5, description: "Carved symbols" },
      { name: "batClusters", value: 6, description: "Roosting bats" },
      { name: "guideStick", value: 1, description: "Leaning stick" }
    ],
    hiddenClue: "5 + 6 − 1 = 10 → 100°",
    bearingDeg: 100,
    cipherOutput: "K",
    cipherIndex: 12,
  riddle: "Subtract the liar who left the stick—what remains in carvings and wings will hum you forward.",
    art: {
      palette: {
        background: "#17171c",
        gradientFrom: "#2a313e",
        gradientTo: "#3f4a59",
        glow: "#e7d7b2",
        accent: "#5d85a2"
      },
      overlays: {
        horizon: 0.54,
        compass: true
      },
      painterly: {
        canvasTexture: 0.66,
        brushDensity: 0.68,
        impastoDepth: 0.46,
        glazeHue: "#e7d7b2",
        silhouetteMotifs: ["glyphStone", "bat"],
        culturalNotes: "Granite walls exhale mineral washes while carved stones and clustered bats glow with damp-lantern glaze.",
        brushLayers: [
          { role: "cavern_wash", color: "#2a313e", blend: "multiply", opacity: 0.72, texture: "dry-brush", noise: 0.22 },
          { role: "petroglyph_glow", color: "#e7d7b2", blend: "screen", opacity: 0.45, texture: "soft-glaze", noise: 0.09 },
          { role: "mist", color: "#3f4a59", blend: "overlay", opacity: 0.5, texture: "stippling", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "glyphStone", count: 5, placement: { type: "arc", center: { x: 0.5, y: 0.66 }, radius: 0.24 }, brush: { style: "knife", color: "#e4cd98", edgeSoftness: 0.34, strokeAngle: 10 } },
          { shape: "bat", count: 6, placement: { type: "cluster", center: { x: 0.48, y: 0.32 }, spread: { x: 0.22, y: 0.1 } }, brush: { style: "sable", color: "#efe3cb", edgeSoftness: 0.55, strokeAngle: -60 } }
        ],
        glowAccents: [
          { motif: "glyph_runes", color: "#f2e3bb", intensity: 0.52, band: { yStart: 0.6, yEnd: 0.7 } },
          { motif: "bat_whisper", color: "#efe3cb", intensity: 0.36, radius: 0.18, center: { x: 0.48, y: 0.32 } }
        ]
      },
      icons: [
        {
          shape: "glyphStone",
          count: 5,
          distribution: "arc",
          center: { x: 0.5, y: 0.66 },
          radius: 0.24,
          size: 150,
          color: "#e4cd98",
          opacity: 0.86
        },
        {
          shape: "bat",
          count: 6,
          distribution: "cluster",
          center: { x: 0.48, y: 0.32 },
          spread: { x: 0.22, y: 0.1 },
          size: 90,
          color: "#efe3cb",
          opacity: 0.78
        }
      ]
    }
  },
  {
    id: "ch6_013",
    name: "Eden Beach: The Dragging Chains",
  rarity: "rare",
    environment: "coastal",
    humanPresence: "fisher_warning",
    fauna: [
      { type: "black_parrots", shape: "gull", count: 3, center: { x: 0.5, y: 0.32 }, spread: { x: 0.3, y: 0.08 }, color: "#efe1c6" }
    ],
    propHighlights: [
      {
        shape: "chain",
        count: 4,
        distribution: "arc",
        center: { x: 0.5, y: 0.74 },
        radius: 0.24,
        size: 200,
        color: "#f6ce88",
        opacity: 0.38
      },
      {
        shape: "footprint",
        count: 3,
        distribution: "line",
        start: { x: 0.36, y: 0.7 },
        end: { x: 0.64, y: 0.68 },
        size: 150,
        color: "#f2d59e",
        opacity: 0.52
      }
    ],
  scene: "Eden Beach glows bruise-purple at false dawn; four chain loops scar sand beside three barefoot prints filling with icy foam while three silent gulls watch from posts. Kassim clenches until knuckles pop, Naia sketches the pattern, and Maliya hums a graveside hymn.",
    props: [
      { name: "chainLoops", value: 4, description: "Chain loops in sand" },
      { name: "barefootPrints", value: 3, description: "Footprints" },
      { name: "gulls", value: 3, description: "Silent gulls" }
    ],
    hiddenClue: "4 + 3 + 3 = 10 → 100°",
    bearingDeg: 100,
    cipherOutput: "M",
    cipherIndex: 13,
  riddle: "Chains write in sand while gulls bear witness—add the loops and steps before the tide erases the sum.",
    art: {
      palette: {
        background: "#1c1610",
        gradientFrom: "#3a2a18",
        gradientTo: "#5a3f20",
        glow: "#f3c77f",
        accent: "#c18e58"
      },
      overlays: {
        horizon: 0.66,
        foam: 0.42,
        compass: true
      },
      painterly: {
        canvasTexture: 0.64,
        brushDensity: 0.75,
        impastoDepth: 0.5,
        glazeHue: "#f3c77f",
        silhouetteMotifs: ["wave", "chain", "footprint", "gull"],
        culturalNotes: "False-dawn surf and rusted chains smear into warm ochre strokes while gull witnesses become chalky silhouettes.",
        brushLayers: [
          { role: "dawn_wash", color: "#3a2a18", blend: "multiply", opacity: 0.7, texture: "dry-brush", noise: 0.21 },
          { role: "surf_glow", color: "#f3c77f", blend: "screen", opacity: 0.44, texture: "soft-glaze", noise: 0.12 },
          { role: "sand_body", color: "#5a3f20", blend: "overlay", opacity: 0.56, texture: "knife", noise: 0.19 }
        ],
        silhouettes: [
          { shape: "wave", count: 3, placement: { type: "stack", start: { x: 0.5, y: 0.82 }, spacing: 0.04 }, brush: { style: "ripple", color: "#2a1c12", edgeSoftness: 0.32, strokeAngle: 0 } },
          { shape: "chain", count: 3, placement: { type: "arc", center: { x: 0.5, y: 0.74 }, radius: 0.26, startAngle: 210, endAngle: -30 }, brush: { style: "loaded", color: "#e2b674", edgeSoftness: 0.4, strokeAngle: 30 } },
          { shape: "footprint", count: 4, placement: { type: "line", start: { x: 0.36, y: 0.7 }, end: { x: 0.64, y: 0.68 } }, brush: { style: "powder", color: "#f1d7a3", edgeSoftness: 0.52, strokeAngle: 5 } },
          { shape: "gull", count: 3, placement: { type: "line", start: { x: 0.34, y: 0.36 }, end: { x: 0.66, y: 0.34 } }, brush: { style: "sable", color: "#e9d9be", edgeSoftness: 0.58, strokeAngle: -12 } }
        ],
        glowAccents: [
          { motif: "foam_spark", color: "#f3c77f", intensity: 0.46, band: { yStart: 0.76, yEnd: 0.86 } },
          { motif: "gull_light", color: "#efe1c6", intensity: 0.32, radius: 0.18, center: { x: 0.5, y: 0.34 } }
        ]
      },
      icons: [
        {
          shape: "wave",
          count: 3,
          distribution: "stack",
          start: { x: 0.5, y: 0.82 },
          spacing: 0.04,
          width: 0.9,
          size: 880,
          color: "#2a1c12",
          opacity: 0.5
        },
        {
          shape: "chain",
          count: 7,
          distribution: "arc",
          center: { x: 0.5, y: 0.74 },
          radius: 0.26,
          size: 140,
          color: "#e2b674",
          opacity: 0.6,
          startAngle: 210,
          endAngle: -30
        },
        {
          shape: "footprint",
          count: 4,
          distribution: "line",
          start: { x: 0.36, y: 0.7 },
          end: { x: 0.64, y: 0.68 },
          size: 110,
          color: "#f1d7a3",
          opacity: 0.72
        },
        {
          shape: "gull",
          count: 3,
          distribution: "line",
          start: { x: 0.34, y: 0.36 },
          end: { x: 0.66, y: 0.34 },
          size: 130,
          color: "#e9d9be",
          opacity: 0.7
        }
      ]
    }
  },
  {
    id: "ch6_014",
    name: "Tea Plantation Shade: Leaves that Count",
    rarity: "rare",
    environment: "village",
    humanPresence: "mapmakers",
    fauna: [
      { type: "fireflies", count: 14, center: { x: 0.5, y: 0.5 }, spread: { x: 0.38, y: 0.2 }, color: "#ffe6a0" }
    ],
    propHighlights: [
      {
        shape: "coco_de_mer",
        count: 6,
        distribution: "ring",
        center: { x: 0.5, y: 0.58 },
        radius: 0.22,
        size: 170,
        color: "#a8e29a",
        opacity: 0.52
      },
      {
        shape: "shard",
        count: 1,
        positions: [{ x: 0.5, y: 0.62 }],
        size: 220,
        color: "#f8d27c",
        opacity: 0.6
      }
    ],
  scene: "Shade among the tea terraces tastes of tannin and rust; two splintered chests sag open to a counting board carved with six coco de mer silhouettes while one shard lurks sticky with sap beneath burlap. Naia counts the doubled curves aloud, Kassim massages numb fingers, and Maliya steeps a bitter ward to fog the revenant\'s breath.",
    props: [
      { name: "teaChests", value: 2, description: "Cracked tea chests" },
  { name: "cocoDeMerSilhouettes", value: 6, description: "Coco de mer silhouettes carved in board" },
      { name: "shard", value: 1, description: "Hidden shard" }
    ],
    hiddenClue: "2 + 6 + 1 = 9 → 90°",
    bearingDeg: 90,
    cipherOutput: "A",
    cipherIndex: 14,
  riddle: "Let the chests, leaf pairs, and hidden tooth brew together—their infusion pours into your next degree.",
    art: {
      palette: {
        background: "#141a12",
        gradientFrom: "#20371f",
        gradientTo: "#3d5c36",
        glow: "#f0d096",
        accent: "#7bb872"
      },
      overlays: {
        horizon: 0.64,
        canopy: 0.48,
        compass: true
      },
      painterly: {
        canvasTexture: 0.7,
        brushDensity: 0.84,
        impastoDepth: 0.58,
        glazeHue: "#f0d096",
  silhouetteMotifs: ["tea_terrace", "coco_de_mer", "shard"],
        culturalNotes: "Tea terraces tier with leafy brushstrokes as coco de mer shells gleam in sap glaze and the shard leaks golden tannins.",
        brushLayers: [
          { role: "terrace_wash", color: "#20371f", blend: "multiply", opacity: 0.76, texture: "leaf", noise: 0.26 },
          { role: "sap_glow", color: "#f0d096", blend: "screen", opacity: 0.48, texture: "soft-glaze", noise: 0.12 },
          { role: "shade_depth", color: "#3d5c36", blend: "overlay", opacity: 0.6, texture: "knife", noise: 0.2 }
        ],
        silhouettes: [
          { shape: "tea_terrace", count: 3, placement: { type: "bands", levels: [0.68, 0.58, 0.5] }, brush: { style: "leaf", color: "#2e4a28", edgeSoftness: 0.4, strokeAngle: -6 } }
        ],
        glowAccents: [
          { motif: "sap_mist", color: "#f0d096", intensity: 0.5, band: { yStart: 0.54, yEnd: 0.66 } },
          { motif: "coco_highlight", color: "#b7f0b1", intensity: 0.62, radius: 0.24, center: { x: 0.5, y: 0.58 } }
        ]
      },
      icons: [
        {
          shape: "crate",
          count: 2,
          distribution: "line",
          start: { x: 0.4, y: 0.7 },
          end: { x: 0.6, y: 0.7 },
          size: 260,
          color: "#b98a56",
          opacity: 0.88
        },
        {
          shape: "coco_de_mer",
          count: 6,
          distribution: "ring",
          center: { x: 0.5, y: 0.58 },
          radius: 0.22,
          size: 140,
          color: "#9cd184",
          opacity: 0.85
        },
        {
          shape: "shard",
          count: 1,
          positions: [{ x: 0.5, y: 0.62 }],
          size: 200,
          color: "#f9c86f",
          opacity: 0.92
        }
      ]
    }
  },
  {
    id: "ch6_015",
    name: "Grand Anse Waterfall: The Key of Silence",
    rarity: "rare",
    environment: "highland",
    humanPresence: "spirit_procession",
    fauna: [
      { type: "fireflies", count: 28, center: { x: 0.5, y: 0.54 }, spread: { x: 0.38, y: 0.22 }, color: "#ffe6a5" }
    ],
    propHighlights: [
      {
        shape: "candle",
        count: 8,
        distribution: "arc",
        center: { x: 0.5, y: 0.72 },
        radius: 0.28,
        size: 150,
        color: "#ffd78d",
        opacity: 0.5
      },
      {
        shape: "key",
        count: 1,
        positions: [{ x: 0.5, y: 0.58 }],
        size: 240,
        color: "#f5d69b",
        opacity: 0.6
      }
    ],
  scene: "Grand Anse waterfall drowns all thought; eight candles gutter in the spray while three lie drowned in wax puddles, and one rusted iron key rests on a stone tongue scored with four etched tallies. Kassim wades waist-deep to seize the key as Naia signals bearings with soaked parchment and Maliya presses a blessing of river mud to his forehead, muttering that the revenant fears what cannot breathe.",
    props: [
      { name: "candles", value: 8, description: "Candles at the falls" },
      { name: "ironKey", value: 1, description: "Rusted key" },
      { name: "tallies", value: 4, description: "Etched tallies" }
    ],
    hiddenClue: "3 + 1 + 4 = 8 → 80°",
    bearingDeg: 80,
    cipherOutput: "H",
    cipherIndex: 15,
  riddle: "Count the flames that survive, honor the drowned, and heed the tallies—only silence unlocks the roaring gate.",
    art: {
      palette: {
        background: "#121922",
        gradientFrom: "#1a3648",
        gradientTo: "#2f5d6c",
        glow: "#f6d9a0",
        accent: "#6cb7c3"
      },
      overlays: {
        horizon: 0.58,
        mist: 0.5,
        compass: true
      },
      painterly: {
        canvasTexture: 0.71,
        brushDensity: 0.83,
        impastoDepth: 0.57,
        glazeHue: "#f6d9a0",
        silhouetteMotifs: ["waterfall", "candle", "key", "tally"],
        culturalNotes: "Waterfall spray feathers into turquoise strokes while candles, tallies, and the rusted key glow with silencing wax glaze.",
        brushLayers: [
          { role: "cascade", color: "#1a3648", blend: "multiply", opacity: 0.78, texture: "ripple", noise: 0.24 },
          { role: "mist_glow", color: "#f6d9a0", blend: "screen", opacity: 0.46, texture: "soft-glaze", noise: 0.12 },
          { role: "stone_base", color: "#2f5d6c", blend: "overlay", opacity: 0.55, texture: "knife", noise: 0.2 }
        ],
        silhouettes: [
          { shape: "waterfall", count: 1, placement: { type: "absolute", x: 0.5, y: 0.6 }, brush: { style: "ripple", color: "#2d5363", edgeSoftness: 0.34, strokeAngle: 0 } },
          { shape: "candle", count: 8, placement: { type: "arc", center: { x: 0.5, y: 0.72 }, radius: 0.28 }, brush: { style: "glaze", color: "#f7c879", edgeSoftness: 0.48, strokeAngle: 28 } },
          { shape: "key", count: 1, placement: { type: "absolute", x: 0.5, y: 0.58 }, brush: { style: "loaded", color: "#f3d188", edgeSoftness: 0.36, strokeAngle: -8 } },
          { shape: "tally", count: 4, placement: { type: "stack", start: { x: 0.76, y: 0.5 }, spacing: 0.03 }, brush: { style: "charcoal", color: "#d9c18f", edgeSoftness: 0.44, strokeAngle: 82 } }
        ],
        glowAccents: [
          { motif: "spray", color: "#f6d9a0", intensity: 0.52, band: { yStart: 0.48, yEnd: 0.68 } },
          { motif: "candle_flare", color: "#ffd78d", intensity: 0.6, radius: 0.2, center: { x: 0.5, y: 0.72 } }
        ]
      },
      icons: [
        {
          shape: "waterfall",
          count: 1,
          positions: [{ x: 0.5, y: 0.6 }],
          size: 820,
          color: "#2d5363",
          opacity: 0.92
        },
        {
          shape: "candle",
          count: 8,
          distribution: "arc",
          center: { x: 0.5, y: 0.72 },
          radius: 0.28,
          size: 120,
          color: "#f7c879",
          opacity: 0.88
        },
        {
          shape: "key",
          count: 1,
          positions: [{ x: 0.5, y: 0.58 }],
          size: 220,
          color: "#f3d188",
          opacity: 0.94
        },
        {
          shape: "coco_de_mer",
          count: 2,
          positions: [{ x: 0.22, y: 0.74 }, { x: 0.78, y: 0.73 }],
          size: 180,
          color: "#3c5543",
          opacity: 0.7
        },
        {
          shape: "tally",
          count: 4,
          distribution: "stack",
          start: { x: 0.76, y: 0.5 },
          spacing: 0.03,
          width: 0.1,
          size: 130,
          color: "#d9c18f",
          opacity: 0.75
        }
      ]
    }
  },
  {
    id: "ch6_016",
    name: "Cemetery Gate: The Quiet Arithmetic",
    rarity: "common",
    environment: "ceremony",
    humanPresence: "ritual_circle",
    fauna: [
      { type: "fireflies", count: 24, center: { x: 0.5, y: 0.66 }, spread: { x: 0.34, y: 0.2 }, color: "#ffe2a3" }
    ],
    propHighlights: [
      {
        shape: "skull",
        count: 3,
        distribution: "line",
        start: { x: 0.36, y: 0.48 },
        end: { x: 0.64, y: 0.48 },
        size: 170,
        color: "#f6dca6",
        opacity: 0.55
      },
      {
        shape: "key",
        count: 1,
        positions: [{ x: 0.5, y: 0.78 }],
        size: 230,
        color: "#f3d59c",
        opacity: 0.6
      }
    ],
  scene: "Cold camphor breathes from the cemetery gate; three skulls mortar the arch, eight guttering candles spit wax, and the falls\' iron key rests on moss-slick stone. Naia reads the dates backward while Kassim guards the satchel and Maliya seals wax over her palms.",
    props: [
      { name: "skulls", value: 3, description: "Animal skulls in arch" },
      { name: "candles", value: 8, description: "Guttering candles" },
      { name: "ironKey", value: 1, description: "Key on the step" }
    ],
    hiddenClue: "3 + 8 = 11 → 110°",
    bearingDeg: 110,
    cipherOutput: "E",
    cipherIndex: 16,
  riddle: "Skulls remember, candles confess, the key waits—add the witnesses and the light to reach the next resting place.",
    art: {
      palette: {
        background: "#19171a",
        gradientFrom: "#2b2735",
        gradientTo: "#40394a",
        glow: "#e7d3a5",
        accent: "#7a84b0"
      },
      overlays: {
        horizon: 0.6,
        haze: 0.48,
        compass: true
      },
      painterly: {
        canvasTexture: 0.69,
        brushDensity: 0.81,
        impastoDepth: 0.52,
        glazeHue: "#e7d3a5",
  silhouetteMotifs: ["gate", "skull", "candle", "coco_de_mer"],
        culturalNotes: "Camphor-sweet strokes halo the gate while skull mortar and coco de mer fronds weave into wax-slick arithmetic of the quiet procession.",
        brushLayers: [
          { role: "night_wash", color: "#2b2735", blend: "normal", opacity: 0.82, texture: "linen", noise: 0.22 },
          { role: "bone_highlight", color: "#f6dca6", blend: "screen", opacity: 0.58, texture: "knife", noise: 0.14 },
          { role: "wax_glaze", color: "#f7c97f", blend: "overlay", opacity: 0.46, texture: "soft-glaze", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "gate", count: 1, placement: { type: "absolute", x: 0.5, y: 0.62 }, brush: { style: "drybrush", color: "#302b3a", edgeSoftness: 0.28, strokeAngle: 0 } },
          { shape: "skull", count: 3, placement: { type: "line", start: { x: 0.36, y: 0.48 }, end: { x: 0.64, y: 0.48 } }, brush: { style: "knife", color: "#f4d79f", edgeSoftness: 0.36, strokeAngle: 4 } },
          { shape: "candle", count: 8, placement: { type: "cluster", center: { x: 0.5, y: 0.74 }, spread: { x: 0.3, y: 0.12 } }, brush: { style: "glaze", color: "#f7c97f", edgeSoftness: 0.5, strokeAngle: 22 } },
          { shape: "coco_de_mer", count: 2, placement: { type: "flank", left: { x: 0.18, y: 0.62 }, right: { x: 0.82, y: 0.6 } }, brush: { style: "fan", color: "#2f3b2c", edgeSoftness: 0.4, strokeAngle: -18 } }
        ],
        glowAccents: [
          { motif: "candle_aura", color: "#ffe2a3", intensity: 0.44, band: { yStart: 0.68, yEnd: 0.78 } },
          { motif: "gate_runes", color: "#f3d59c", intensity: 0.36, radius: 0.18, center: { x: 0.5, y: 0.58 } }
        ]
      },
      icons: [
        {
          shape: "gate",
          count: 1,
          positions: [{ x: 0.5, y: 0.62 }],
          size: 820,
          color: "#302b3a",
          opacity: 0.92
        },
        {
          shape: "skull",
          count: 3,
          distribution: "line",
          start: { x: 0.36, y: 0.48 },
          end: { x: 0.64, y: 0.48 },
          size: 150,
          color: "#f4d79f",
          opacity: 0.88
        },
        {
          shape: "candle",
          count: 8,
          distribution: "cluster",
          center: { x: 0.5, y: 0.74 },
          spread: { x: 0.3, y: 0.12 },
          size: 110,
          color: "#f7c97f",
          opacity: 0.86
        },
        {
          shape: "coco_de_mer",
          count: 2,
          positions: [{ x: 0.24, y: 0.7 }, { x: 0.76, y: 0.7 }],
          size: 180,
          color: "#3f5a3b",
          opacity: 0.72
        },
        {
          shape: "key",
          count: 1,
          positions: [{ x: 0.5, y: 0.78 }],
          size: 200,
          color: "#efd08d",
          opacity: 0.88
        }
      ]
    }
  },
  {
    id: "ch6_017",
    name: "Bel Ombre Tidepools: Mirror of Shards",
    rarity: "rare",
    environment: "coastal",
    humanPresence: "mapmakers",
    fauna: [
      { type: "reef_fish", count: 5, bandY: 0.82, bandHeight: 0.05, color: "#9acde0" },
      { type: "fruit_bats", count: 2, radius: 0.24, baseY: 0.22, color: "#f3e3cc" }
    ],
    propHighlights: [
      {
        shape: "shell",
        count: 5,
        distribution: "ring",
        center: { x: 0.5, y: 0.68 },
        radius: 0.24,
        size: 150,
        color: "#f5ddb0",
        opacity: 0.58
      },
      {
        shape: "spine",
        count: 9,
        distribution: "scatter",
        center: { x: 0.5, y: 0.78 },
        spread: { x: 0.3, y: 0.12 },
        size: 160,
        color: "#f3cf8d",
        opacity: 0.5
      }
    ],
  scene: "Bel Ombre tidepools mirror a bruised sky; five rune-etched shells ring the water, nine reef spines spear upward, and a giant tortoise silhouette glides beneath the reflections while two bats sip starlight. Naia maps each rune to the shard humming under her palm, Kassim notes seawater etching his scars silver, and Maliya whispers that the revenant watches from the mirrored shell.",
    props: [
      { name: "runeShells", value: 5, description: "Shells etched with runes" },
      { name: "reefSpines", value: 9, description: "Jagged reef spines" },
      { name: "bats", value: 2, description: "Bats sipping from pools" }
    ],
    hiddenClue: "5 + 9 + 2 = 16 → 160°",
    bearingDeg: 160,
    cipherOutput: "I",
    cipherIndex: 17,
  riddle: "Count what the pool refuses to swallow—shells, spines, and watchers reveal the mirrored heading.",
    art: {
      palette: {
        background: "#12182a",
        gradientFrom: "#1c2848",
        gradientTo: "#314c6b",
        glow: "#f0d4b0",
        accent: "#6b91c8"
      },
      overlays: {
        horizon: 0.58,
        ripple: 0.46,
        compass: true
      },
      painterly: {
        canvasTexture: 0.74,
        brushDensity: 0.85,
        impastoDepth: 0.6,
        glazeHue: "#f0d4b0",
  silhouetteMotifs: ["tidepool", "shell", "giant_tortoise", "bat"],
        culturalNotes: "Tidepool mirrors refract Seychellois twilight while tortoise shadows drift beneath rune shells and bats sip starlit glaze.",
        brushLayers: [
          { role: "ocean_base", color: "#1c2848", blend: "multiply", opacity: 0.76, texture: "ripple", noise: 0.26 },
          { role: "mirror_highlight", color: "#f0d4b0", blend: "screen", opacity: 0.54, texture: "soft-glaze", noise: 0.12 },
          { role: "rune_edge", color: "#6b91c8", blend: "overlay", opacity: 0.42, texture: "knife", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "pool", count: 1, placement: { type: "absolute", x: 0.5, y: 0.68 }, brush: { style: "wash", color: "#223754", edgeSoftness: 0.32, strokeAngle: 0 } },
          { shape: "shell", count: 5, placement: { type: "ring", center: { x: 0.5, y: 0.68 }, radius: 0.24 }, brush: { style: "knife", color: "#f0d7a2", edgeSoftness: 0.28, strokeAngle: 16 } },
          { shape: "bat", count: 2, placement: { type: "line", start: { x: 0.36, y: 0.38 }, end: { x: 0.64, y: 0.36 } }, brush: { style: "glaze", color: "#f2e3c6", edgeSoftness: 0.4, strokeAngle: 18 } }
        ],
        glowAccents: [
          { motif: "pool_glint", color: "#f3d7b5", intensity: 0.48, band: { yStart: 0.62, yEnd: 0.74 } },
          { motif: "bat_trails", color: "#f3e3cc", intensity: 0.3, radius: 0.22, center: { x: 0.5, y: 0.32 } }
        ]
      },
      icons: [
        {
          shape: "pool",
          count: 1,
          positions: [{ x: 0.5, y: 0.68 }],
          size: 820,
          color: "#223754",
          opacity: 0.88
        },
        {
          shape: "shell",
          count: 5,
          distribution: "ring",
          center: { x: 0.5, y: 0.68 },
          radius: 0.24,
          size: 130,
          color: "#f0d7a2",
          opacity: 0.9
        },
        {
          shape: "giant_tortoise",
          count: 1,
          positions: [{ x: 0.52, y: 0.74 }],
          size: 320,
          color: "#1b2533",
          opacity: 0.85
        },
        {
          shape: "spine",
          count: 9,
          distribution: "scatter",
          center: { x: 0.5, y: 0.78 },
          spread: { x: 0.3, y: 0.12 },
          size: 140,
          color: "#d9c28e",
          opacity: 0.82
        },
        {
          shape: "bat",
          count: 2,
          distribution: "line",
          start: { x: 0.36, y: 0.38 },
          end: { x: 0.64, y: 0.36 },
          size: 120,
          color: "#f2e3c6",
          opacity: 0.85
        },
        {
          shape: "shard",
          count: 1,
          positions: [{ x: 0.5, y: 0.62 }],
          size: 220,
          color: "#f5c681",
          opacity: 0.94
        }
      ]
    }
  },
  {
    id: "ch6_018",
    name: "Roche Caiman: The Split Rune",
  rarity: "rare",
    environment: "highland",
    humanPresence: "spirit_procession",
    fauna: [
      { type: "fireflies", count: 26, center: { x: 0.5, y: 0.5 }, spread: { x: 0.36, y: 0.26 }, color: "#ffdca0" }
    ],
    propHighlights: [
      {
        shape: "crack",
        count: 4,
        distribution: "radiate",
        center: { x: 0.5, y: 0.62 },
        radius: 0.36,
        size: 240,
        color: "#f7d08e",
        opacity: 0.55
      },
      {
        shape: "rune",
        count: 2,
        distribution: "line",
        start: { x: 0.42, y: 0.6 },
        end: { x: 0.58, y: 0.64 },
        size: 200,
        color: "#ffd28a",
        opacity: 0.58
      }
    ],
  scene: "At Roche Caiman a lightning-split boulder steams in the rain; four radiant cracks crawl from the sundered rune while two halves strain to reunite inside the chalk circle Maliya binds with the iron key. Naia sketches sparks that smell like burnt sugar, Kassim measures the gap with trembling calipers, and thunder answers the 90° call.",
    props: [
      { name: "radiantCracks", value: 4, description: "Cracks radiating from rune" },
      { name: "runeHalves", value: 2, description: "Halves of split rune" },
      { name: "bindingCircle", value: 1, description: "Chalk circle joining halves" }
    ],
    hiddenClue: "4 × 2 + 1 = 9 → 90°",
    bearingDeg: 90,
    cipherOutput: "S",
    cipherIndex: 18,
  riddle: "Broken words still add—bind the halves, trace the cracks, and let the circle speak the number.",
    art: {
      palette: {
        background: "#18131a",
        gradientFrom: "#2c2037",
        gradientTo: "#452d4a",
        glow: "#f0cd9b",
        accent: "#c978b1"
      },
      overlays: {
        horizon: 0.57,
        lightning: 0.48,
        compass: true
      },
      painterly: {
        canvasTexture: 0.77,
        brushDensity: 0.88,
        impastoDepth: 0.63,
        glazeHue: "#f0cd9b",
        silhouetteMotifs: ["boulder", "crack", "rune", "coco_de_mer"],
        culturalNotes: "Thunder-lit strokes split the rune, binding lightning scars with coco de mer shadows circling the key's charge.",
        brushLayers: [
          { role: "storm_wash", color: "#2c2037", blend: "multiply", opacity: 0.8, texture: "linen", noise: 0.24 },
          { role: "spark_highlight", color: "#f4d28d", blend: "screen", opacity: 0.56, texture: "glitter", noise: 0.1 },
          { role: "rune_glow", color: "#c978b1", blend: "overlay", opacity: 0.44, texture: "knife", noise: 0.2 }
        ],
        silhouettes: [
          { shape: "boulder", count: 1, placement: { type: "absolute", x: 0.5, y: 0.62 }, brush: { style: "loaded", color: "#322336", edgeSoftness: 0.3, strokeAngle: 2 } },
          { shape: "crack", count: 4, placement: { type: "radiate", center: { x: 0.5, y: 0.62 }, radius: 0.36 }, brush: { style: "knife", color: "#f4d28d", edgeSoftness: 0.26, strokeAngle: 0 } },
          { shape: "rune", count: 2, placement: { type: "line", start: { x: 0.42, y: 0.6 }, end: { x: 0.58, y: 0.64 } }, brush: { style: "drybrush", color: "#f7c882", edgeSoftness: 0.34, strokeAngle: 18 } },
          { shape: "coco_de_mer", count: 1, placement: { type: "absolute", x: 0.78, y: 0.55 }, brush: { style: "fan", color: "#2f3b30", edgeSoftness: 0.42, strokeAngle: -24 } }
        ],
        glowAccents: [
          { motif: "lightning_arc", color: "#ffd28a", intensity: 0.5, radius: 0.32, center: { x: 0.5, y: 0.46 } },
          { motif: "rune_heat", color: "#f6d5a1", intensity: 0.42, band: { yStart: 0.58, yEnd: 0.66 } }
        ]
      },
      icons: [
        {
          shape: "boulder",
          count: 1,
          positions: [{ x: 0.5, y: 0.62 }],
          size: 840,
          color: "#322336",
          opacity: 0.9
        },
        {
          shape: "crack",
          count: 4,
          distribution: "radiate",
          center: { x: 0.5, y: 0.62 },
          radius: 0.36,
          size: 220,
          color: "#f4d28d",
          opacity: 0.85
        },
        {
          shape: "rune",
          count: 2,
          distribution: "line",
          start: { x: 0.42, y: 0.6 },
          end: { x: 0.58, y: 0.64 },
          size: 180,
          color: "#f7c882",
          opacity: 0.9
        },
        {
          shape: "circle",
          count: 1,
          positions: [{ x: 0.5, y: 0.62 }],
          size: 360,
          color: "#f6d5a1",
          opacity: 0.4
        }
      ]
    }
  },
  {
    id: "ch6_019",
    name: "Morne Seychellois Cavern: The Hidden Lock",
    rarity: "legendary",
    environment: "cavern",
    humanPresence: "ritual_circle",
    fauna: [
      { type: "fruit_bats", count: 5, radius: 0.2, baseY: 0.18, color: "#f1e4c6" }
    ],
    propHighlights: [
      {
        shape: "shard",
        count: 5,
        distribution: "ring",
        center: { x: 0.5, y: 0.66 },
        radius: 0.18,
        size: 180,
        color: "#ffd48e",
        opacity: 0.58
      },
      {
        shape: "candle",
        count: 5,
        distribution: "arc",
        center: { x: 0.5, y: 0.78 },
        radius: 0.22,
        size: 130,
        color: "#f8d297",
        opacity: 0.5
      }
    ],
  scene: "Deep in Morne Seychellois the cavern breathes like a sleeping beast; five altar shards already hum beside five unlit candles scented with frankincense as condensation drips in steady tempo. Naia\'s ink runs down her wrists, Kassim slots fragments with steady defiance, and Maliya turns the iron key and feels the lock throb beneath her palm.",
    props: [
      { name: "altarShards", value: 5, description: "Shards arranged on altar" },
      { name: "candles", value: 5, description: "Unlit candles" }
    ],
    hiddenClue: "5 + 5 = 10 → 100°",
    bearingDeg: 100,
    cipherOutput: "L",
    cipherIndex: 19,
  riddle: "Equal offerings balance the door—five shards, five flames, one heartbeat between.",
    art: {
      palette: {
        background: "#10161c",
        gradientFrom: "#182936",
        gradientTo: "#2f4454",
        glow: "#efd3a2",
        accent: "#4c7c8b"
      },
      overlays: {
        horizon: 0.57,
        cavern: 0.52,
        compass: true
      },
      painterly: {
        canvasTexture: 0.78,
        brushDensity: 0.84,
        impastoDepth: 0.58,
        glazeHue: "#efd3a2",
  silhouetteMotifs: ["altar", "shard", "candle", "coco_de_mer"],
        culturalNotes: "Frankincense mist takes on oil sheen while altar shards pulse against coco de mer palm shadows and bare flame halos.",
        brushLayers: [
          { role: "cavern_base", color: "#182936", blend: "multiply", opacity: 0.82, texture: "linen", noise: 0.25 },
          { role: "shard_glow", color: "#f5c885", blend: "screen", opacity: 0.52, texture: "glitter", noise: 0.14 },
          { role: "incense_wave", color: "#4c7c8b", blend: "overlay", opacity: 0.4, texture: "wash", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "altar", count: 1, placement: { type: "absolute", x: 0.5, y: 0.66 }, brush: { style: "loaded", color: "#253643", edgeSoftness: 0.3, strokeAngle: 0 } },
          { shape: "shard", count: 5, placement: { type: "ring", center: { x: 0.5, y: 0.66 }, radius: 0.18 }, brush: { style: "knife", color: "#f5c885", edgeSoftness: 0.26, strokeAngle: -12 } },
          { shape: "candle", count: 5, placement: { type: "arc", center: { x: 0.5, y: 0.78 }, radius: 0.22 }, brush: { style: "glaze", color: "#f6ca80", edgeSoftness: 0.44, strokeAngle: 24 } },
          { shape: "coco_de_mer", count: 1, placement: { type: "absolute", x: 0.24, y: 0.64 }, brush: { style: "fan", color: "#2d3a2b", edgeSoftness: 0.4, strokeAngle: 16 } }
        ],
        glowAccents: [
          { motif: "shard_ember", color: "#ffd48e", intensity: 0.46, radius: 0.24, center: { x: 0.5, y: 0.64 } },
          { motif: "incense_trail", color: "#efd3a2", intensity: 0.34, band: { yStart: 0.56, yEnd: 0.76 } }
        ]
      },
      icons: [
        {
          shape: "altar",
          count: 1,
          positions: [{ x: 0.5, y: 0.66 }],
          size: 760,
          color: "#253643",
          opacity: 0.9
        },
        {
          shape: "shard",
          count: 5,
          distribution: "ring",
          center: { x: 0.5, y: 0.66 },
          radius: 0.18,
          size: 150,
          color: "#f5c885",
          opacity: 0.92
        },
        {
          shape: "candle",
          count: 5,
          distribution: "arc",
          center: { x: 0.5, y: 0.78 },
          radius: 0.22,
          size: 110,
          color: "#f6ca80",
          opacity: 0.84
        },
        {
          shape: "coco_de_mer",
          count: 2,
          positions: [{ x: 0.3, y: 0.7 }, { x: 0.7, y: 0.7 }],
          size: 170,
          color: "#375341",
          opacity: 0.68
        },
        {
          shape: "key",
          count: 1,
          positions: [{ x: 0.5, y: 0.62 }],
          size: 200,
          color: "#efd29f",
          opacity: 0.88
        }
      ]
    }
  },
  {
    id: "ch6_020",
    name: "Mask Reforged: The Revenant’s Vow",
  rarity: "legendary",
    environment: "ceremony",
    humanPresence: "spirit_procession",
    fauna: [
      { type: "fruit_bats", count: 12, radius: 0.34, baseY: 0.24, color: "#f6e7c4" }
    ],
    propHighlights: [
      {
        shape: "mask",
        count: 1,
        positions: [{ x: 0.5, y: 0.58 }],
        size: 320,
        color: "#ffe0a4",
        opacity: 0.65
      },
      {
        shape: "rune",
        count: 5,
        distribution: "ring",
        center: { x: 0.5, y: 0.58 },
        radius: 0.16,
        size: 140,
        color: "#ffdd96",
        opacity: 0.45
      }
    ],
    scene: "When the shards fuse, the Revenant King's mask exhales steam and ozone; ten iron teeth lock, five runes orbit wide, and the compass etched beneath bleeds gold. Bats flood the cavern mouth as Naia's eyes catch the light, Kassim kneels without bowing, and Maliya lifts the rebuilt mask knowing the curse now listens. Salt and old vows settle before the final 150° promise.",
    props: [
      { name: "ironTeeth", value: 10, description: "Teeth set into mask" },
      { name: "glowingRunes", value: 5, description: "Runes on reforged mask" },
      { name: "compassRose", value: 1, description: "Compass etched in altar" }
    ],
    hiddenClue: "10 + 5 = 15 → 150°",
    bearingDeg: 150,
    cipherOutput: "E",
    cipherIndex: 20,
    riddle: "Taste the iron bite, read the widened five lights—where their total sinks beneath the sea, carve your claim.",
    art: {
      palette: {
        background: "#141112",
        gradientFrom: "#2b1d26",
        gradientTo: "#4b2431",
        glow: "#f4d79a",
        accent: "#d27a66"
      },
      overlays: {
        horizon: 0.58,
        ember: 0.5,
        compass: true
      },
      painterly: {
        canvasTexture: 0.8,
        brushDensity: 0.87,
        impastoDepth: 0.66,
        glazeHue: "#f4d79a",
        silhouetteMotifs: ["mask", "tooth", "rune", "compass", "giant_tortoise"],
        culturalNotes: "Mask brass breathes under ember glaze as tortoise memories and compass gold weave through the revenant vow.",
        brushLayers: [
          { role: "ember_ground", color: "#2b1d26", blend: "multiply", opacity: 0.84, texture: "linen", noise: 0.22 },
          { role: "mask_highlight", color: "#f9d681", blend: "screen", opacity: 0.58, texture: "knife", noise: 0.16 },
          { role: "oath_glow", color: "#d27a66", blend: "overlay", opacity: 0.46, texture: "glaze", noise: 0.18 }
        ],
        silhouettes: [
          { shape: "mask", count: 1, placement: { type: "absolute", x: 0.5, y: 0.58 }, brush: { style: "loaded", color: "#f9d681", edgeSoftness: 0.28, strokeAngle: 0 } },
          { shape: "tooth", count: 10, placement: { type: "line", start: { x: 0.38, y: 0.62 }, end: { x: 0.62, y: 0.62 } }, brush: { style: "knife", color: "#f7c567", edgeSoftness: 0.3, strokeAngle: 4 } },
          { shape: "rune", count: 5, placement: { type: "ring", center: { x: 0.5, y: 0.58 }, radius: 0.16 }, brush: { style: "glaze", color: "#ffd78f", edgeSoftness: 0.38, strokeAngle: 16 } },
          { shape: "compass", count: 1, placement: { type: "absolute", x: 0.5, y: 0.74 }, brush: { style: "wash", color: "#f3d79b", edgeSoftness: 0.32, strokeAngle: 0 } },
          { shape: "giant_tortoise", count: 1, placement: { type: "shadow", anchor: { x: 0.68, y: 0.8 }, scale: 0.42 }, brush: { style: "drybrush", color: "#1f221e", edgeSoftness: 0.46, strokeAngle: -12 } }
        ],
        glowAccents: [
          { motif: "mask_oath", color: "#ffdca0", intensity: 0.52, radius: 0.26, center: { x: 0.5, y: 0.58 } },
          { motif: "ember_drift", color: "#f3b87a", intensity: 0.36, band: { yStart: 0.52, yEnd: 0.82 } }
        ]
      },
      icons: [
        {
          shape: "altar",
          count: 1,
          positions: [{ x: 0.5, y: 0.66 }],
          size: 780,
          color: "#2f2026",
          opacity: 0.9
        },
        {
          shape: "mask",
          count: 1,
          positions: [{ x: 0.5, y: 0.58 }],
          size: 300,
          color: "#f9d681",
          opacity: 0.9
        },
        {
          shape: "tooth",
          count: 10,
          distribution: "line",
          start: { x: 0.38, y: 0.62 },
          end: { x: 0.62, y: 0.62 },
          size: 80,
          color: "#f7c567",
          opacity: 0.85
        },
        {
          shape: "rune",
          count: 5,
          distribution: "ring",
          center: { x: 0.5, y: 0.58 },
          radius: 0.16,
          size: 120,
          color: "#ffd78f",
          opacity: 0.72
        },
        {
          shape: "bat",
          count: 12,
          distribution: "river",
          center: { x: 0.5, y: 0.32 },
          radius: 0.3,
          size: 100,
          color: "#f5e3c1",
          opacity: 0.82
        },
        {
          shape: "compass",
          count: 1,
          positions: [{ x: 0.5, y: 0.74 }],
          size: 280,
          color: "#f3d79b",
          opacity: 0.88
        }
      ]
    }
  }
];

export default manifest;
