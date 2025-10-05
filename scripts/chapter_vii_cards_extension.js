/**
 * COMPLETE CHAPTER VII MANIFEST EXTENSION
 * Adding cards 11-20 to complete "SIREN MAP PRASLIN ISLES"
 */

export const CHAPTER_VII_CARDS_11_20 = [
  {
    id: "ch7_011",
    name: "Glacis Noir Lookout: Stars Beneath Leaves",
    scene: "5 constellations, 2 lamps, 1 tortoise shell mirror.",
    props: [
      { name: "star_constellations", value: 5, description: "Constellations visible through canopy" },
      { name: "lanterns", value: 2, description: "Traditional lamps casting light" },
      { name: "shell_mirror", value: 1, description: "Polished tortoise shell mirror" }
    ],
    hiddenClue: "(5×2)+1=11 → 110°",
    bearingDeg: 110,
    cipherOutput: "A",
    riddle: "Sometimes the ground is the sky.",
    painterlyElements: {
      atmosphere: "canopy_starlight_mystical_reflection",
      culturalStamps: ["star_navigation", "tortoise_shell_crafts"],
      brushTechnique: "dappled_starlight_through_leaves_texture",
      layering: "background_stars_midground_canopy_foreground_mirror"
    }
  },

  {
    id: "ch7_012", 
    name: "Vallée Stream: The Siren's Counting Song",
    scene: "Women washing, 3 drums, 6 kingfishers, 2 carved leaves.",
    props: [
      { name: "ritual_drums", value: 3, description: "Traditional drums by stream" },
      { name: "kingfishers", value: 6, description: "Bright kingfishers darting over water" },
      { name: "carved_leaves", value: 2, description: "Ceremonial carved leaves floating" }
    ],
    hiddenClue: "(6−3)+2=5 → 50°",
    bearingDeg: 50,
    cipherOutput: "S",
    riddle: "Count forward to return.",
    painterlyElements: {
      atmosphere: "stream_washing_women_ritual_music",
      culturalStamps: ["creole_washing_tradition", "kingfisher_flight"],
      brushTechnique: "flowing_water_rhythm_texture",
      layering: "background_stream_midground_women_foreground_drums"
    }
  },

  {
    id: "ch7_013",
    name: "Old Cemetery: Names That Walk", 
    scene: "3 crosses, 8 candle stubs, 1 shell-key.",
    props: [
      { name: "stone_crosses", value: 3, description: "Weathered stone crosses" },
      { name: "candle_stubs", value: 8, description: "Melted candle stubs on graves" },
      { name: "shell_key", value: 1, description: "Mysterious shell-shaped key" }
    ],
    hiddenClue: "3+8=11 → 110°",
    bearingDeg: 110, 
    cipherOutput: "L",
    riddle: "The dead subtract but do not deceive.",
    painterlyElements: {
      atmosphere: "ancient_cemetery_spectral_presence",
      culturalStamps: ["creole_burial_traditions", "shell_artifacts"],
      brushTechnique: "weathered_stone_candle_wax_texture",
      layering: "background_graves_midground_crosses_foreground_shell_key"
    }
  },

  {
    id: "ch7_014",
    name: "Curieuse Mangroves: Root Letters",
    scene: "4 crab mounds, 5 arches, 1 tortoise bell. Roots form the letter I.",
    props: [
      { name: "crab_mounds", value: 4, description: "Mud crab mounds among roots" },
      { name: "root_arches", value: 5, description: "Natural mangrove root arches" },
      { name: "tortoise_bell", value: 1, description: "Ancient tortoise shell bell" }
    ],
    hiddenClue: "(4+5)×1=9 → 90°",
    bearingDeg: 90,
    cipherOutput: "I",
    riddle: "To read the forest, climb one branch higher.",
    painterlyElements: {
      atmosphere: "mangrove_root_cathedral_letter_formation",
      culturalStamps: ["crab_mound_patterns", "tortoise_shell_bell"],
      brushTechnique: "twisted_root_mud_texture",
      layering: "background_mangrove_maze_midground_arches_foreground_bell"
    }
  },

  {
    id: "ch7_015",
    name: "Anse La Farine Jetty: Boards That Remember",
    scene: "7 gaps, 1 post, 2 floats. A corked bottle beneath boards.",
    props: [
      { name: "jetty_gaps", value: 7, description: "Missing planks creating gaps" },
      { name: "mooring_post", value: 1, description: "Weathered mooring post" },
      { name: "fishing_floats", value: 2, description: "Colorful fishing floats" }
    ],
    hiddenClue: "(7−1)+2=8 → 80°",
    bearingDeg: 80,
    cipherOutput: "N", 
    riddle: "Where something is missing, something is hidden.",
    painterlyElements: {
      atmosphere: "weathered_jetty_hidden_secrets",
      culturalStamps: ["traditional_jetty_construction", "fishing_gear"],
      brushTechnique: "weathered_wood_rope_texture",
      layering: "background_lagoon_midground_jetty_foreground_bottle"
    }
  },

  {
    id: "ch7_016",
    name: "La Digue Passage: White Birds on Wind",
    scene: "6 terns, 1 buoy, 3 beacons. Blink rate spells a number.",
    props: [
      { name: "white_terns", value: 6, description: "Terns wheeling in formation" },
      { name: "channel_buoy", value: 1, description: "Navigation buoy bobbing" },
      { name: "signal_beacons", value: 3, description: "Blinking navigation beacons" }
    ],
    hiddenClue: "(6÷3)×1=2 → 20°",
    bearingDeg: 20,
    cipherOutput: "I",
    riddle: "A thought repeated becomes a path.",
    painterlyElements: {
      atmosphere: "channel_passage_navigation_rhythm",
      culturalStamps: ["tern_flight_patterns", "maritime_navigation"],
      brushTechnique: "wind_swept_feather_beacon_light_texture",
      layering: "background_passage_midground_buoy_foreground_terns"
    }
  },

  {
    id: "ch7_017",
    name: "Ave Maria Rocks: Choir of Spray",
    scene: "5 plumes, 2 rosaries, 1 locket.",
    props: [
      { name: "spray_plumes", value: 5, description: "Towering spray plumes from rocks" },
      { name: "coral_rosaries", value: 2, description: "Rosaries made of coral beads" },
      { name: "silver_locket", value: 1, description: "Tarnished silver locket" }
    ],
    hiddenClue: "5+2+1=8 → 80°",
    bearingDeg: 80,
    cipherOutput: "S",
    riddle: "Pray to the tide; it counts without fingers.",
    painterlyElements: {
      atmosphere: "sacred_rocks_spray_choir_devotion",
      culturalStamps: ["coral_rosary_crafts", "maritime_devotion"],
      brushTechnique: "towering_spray_coral_texture",
      layering: "background_rocks_midground_spray_foreground_rosaries"
    }
  },

  {
    id: "ch7_018",
    name: "Cousin Island Sanctuary: Wardens of Light",
    scene: "4 turtle nests, 3 lanterns, 2 signs. A tortoise bears a glyph.",
    props: [
      { name: "turtle_nests", value: 4, description: "Protected sea turtle nests" },
      { name: "sanctuary_lanterns", value: 3, description: "Conservation lanterns" },
      { name: "warning_signs", value: 2, description: "Sanctuary protection signs" }
    ],
    hiddenClue: "4×3−2=10 → 100°",
    bearingDeg: 100,
    cipherOutput: "L",
    riddle: "Guardians point, even when silent.",
    painterlyElements: {
      atmosphere: "protected_sanctuary_conservation_duty",
      culturalStamps: ["turtle_conservation", "sanctuary_guardian"],
      brushTechnique: "sand_nest_lantern_glow_texture",
      layering: "background_sanctuary_midground_nests_foreground_tortoise_glyph"
    }
  },

  {
    id: "ch7_019",
    name: "Fond Ferdinand Stair: The Echo of Steps", 
    scene: "9 steps, 4 candles, 1 pendant. Footsteps echo 2-1-2-1.",
    props: [
      { name: "stone_steps", value: 9, description: "Ancient stone steps ascending" },
      { name: "ritual_candles", value: 4, description: "Candles marking the path" },
      { name: "jade_pendant", value: 1, description: "Carved jade pendant" }
    ],
    hiddenClue: "(9+1)−4=6 → 60°",
    bearingDeg: 60,
    cipherOutput: "E",
    riddle: "Between rise and rest, choose the smaller number.",
    painterlyElements: {
      atmosphere: "ascending_steps_echo_ritual_passage",
      culturalStamps: ["stone_step_construction", "jade_carving"],
      brushTechnique: "worn_stone_candle_flame_texture",
      layering: "background_ascending_path_midground_candles_foreground_pendant"
    }
  },

  {
    id: "ch7_020",
    name: "Pointe Chevalier: Siren's Map Restored",
    scene: "Fragments unfurl across water. 10 stars, 5 glyphs, 1 spiral. The map spells 'SIREN MAP PRASLIN ISLES.'",
    props: [
      { name: "map_stars", value: 10, description: "Navigation stars on the restored map" },
      { name: "ancient_glyphs", value: 5, description: "Glyphs revealing the cipher" },
      { name: "central_spiral", value: 1, description: "Spiral binding all elements" }
    ],
    hiddenClue: "10+5+1=16 → 160°",
    bearingDeg: 160,
    cipherOutput: "S", 
    riddle: "When sea and sky agree, read the music.",
    painterlyElements: {
      atmosphere: "map_revelation_siren_song_completion",
      culturalStamps: ["complete_siren_map", "praslin_isles_layout"],
      brushTechnique: "unfurling_map_water_reflection_texture",
      layering: "background_open_sea_midground_floating_fragments_foreground_complete_map"
    }
  }
];

export default CHAPTER_VII_CARDS_11_20;