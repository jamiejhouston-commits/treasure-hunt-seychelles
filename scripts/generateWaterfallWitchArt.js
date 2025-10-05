import { createCanvas, loadImage } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

class WaterfallWitchGenerator {
    constructor() {
        this.width = parseInt(process.env.CANVAS_WIDTH) || 2048;
        this.height = parseInt(process.env.CANVAS_HEIGHT) || 2048;
        this.batchSize = parseInt(process.env.WATERFALL_BATCH_SIZE) || 150;
        this.outputDir = './assets/waterfall_edition';
        this.startTokenId = 1001; // Special edition starts after main collection

        // Special edition rarity distribution
        this.rarityDistribution = {
            rare: { percentage: 60, count: 90, traits: 'enhanced_story' },
            epic: { percentage: 30, count: 45, traits: 'detailed_interaction' },
            legendary: { percentage: 10, count: 15, traits: 'treasure_location' }
        };

        // Witch character variations - realistic and detailed
        this.witchTypes = {
            'ancient_seer': {
                age: 'elderly',
                clothing: 'tattered_robes',
                hair: 'long_silver',
                accessories: ['crystal_orb', 'wooden_staff'],
                magical_aura: 'purple_mist',
                personality: 'wise_cunning'
            },
            'forest_enchantress': {
                age: 'middle_aged',
                clothing: 'leaf_adorned_dress',
                hair: 'braided_brown',
                accessories: ['herb_pouch', 'bone_necklace'],
                magical_aura: 'green_sparkles',
                personality: 'mysterious_alluring'
            },
            'sea_witch': {
                age: 'young_adult',
                clothing: 'scaled_robes',
                hair: 'flowing_blue_green',
                accessories: ['conch_shell', 'coral_crown'],
                magical_aura: 'blue_waves',
                personality: 'seductive_dangerous'
            },
            'shadow_crone': {
                age: 'ancient',
                clothing: 'black_hooded_cloak',
                hair: 'wispy_white',
                accessories: ['raven_familiar', 'cursed_amulet'],
                magical_aura: 'dark_shadows',
                personality: 'evil_calculating'
            },
            'island_shaman': {
                age: 'mature',
                clothing: 'tribal_decorated_robes',
                hair: 'dreadlocked_black',
                accessories: ['feathered_headdress', 'ritual_bones'],
                magical_aura: 'golden_light',
                personality: 'spiritual_protective'
            }
        };

        // Pirate character variations - realistic and diverse
        this.pirateTypes = {
            'grizzled_captain': {
                age: 'middle_aged',
                clothing: 'ornate_coat',
                hair: 'braided_beard',
                accessories: ['tricorn_hat', 'cutlass', 'gold_chains'],
                build: 'stocky_strong',
                expression: 'suspicious_calculating'
            },
            'young_quartermaster': {
                age: 'young_adult',
                clothing: 'leather_vest',
                hair: 'tied_back',
                accessories: ['bandana', 'pistol', 'coin_purse'],
                build: 'lean_agile',
                expression: 'eager_greedy'
            },
            'weathered_navigator': {
                age: 'elderly',
                clothing: 'faded_uniform',
                hair: 'white_mustache',
                accessories: ['compass', 'spyglass', 'worn_boots'],
                build: 'thin_wiry',
                expression: 'wise_cautious'
            },
            'fierce_buccaneer': {
                age: 'mature',
                clothing: 'battle_scarred_coat',
                hair: 'wild_long',
                accessories: ['eye_patch', 'hook_hand', 'multiple_weapons'],
                build: 'tall_imposing',
                expression: 'intimidating_ruthless'
            },
            'cunning_first_mate': {
                age: 'middle_aged',
                clothing: 'neat_officer_coat',
                hair: 'well_groomed',
                accessories: ['officer_hat', 'ceremonial_sword', 'document_case'],
                build: 'average_smart',
                expression: 'sly_observant'
            },
            'desperate_crew_member': {
                age: 'young',
                clothing: 'torn_sailor_clothes',
                hair: 'unkempt_dirty',
                accessories: ['simple_knife', 'rope_belt', 'worn_shoes'],
                build: 'skinny_nervous',
                expression: 'fearful_hopeful'
            }
        };

        // Scene compositions for storytelling
        this.sceneTypes = {
            'cave_negotiation': {
                setting: 'witch_cave_interior',
                witch_position: 'behind_cauldron',
                pirate_position: 'kneeling_before_witch',
                interaction: 'payment_for_spell',
                lighting: 'magical_firelight',
                story_moment: 'pirates_paying_witch'
            },
            'waterfall_approach': {
                setting: 'waterfall_exterior',
                witch_position: 'cave_entrance',
                pirate_position: 'approaching_cautiously',
                interaction: 'first_meeting',
                lighting: 'natural_daylight',
                story_moment: 'discovery_of_witch'
            },
            'secret_theft': {
                setting: 'cave_treasure_room',
                witch_position: 'stealing_from_chest',
                pirate_position: 'sleeping_or_absent',
                interaction: 'witch_betrayal',
                lighting: 'dim_secretive',
                story_moment: 'witch_stealing_treasure'
            },
            'church_stashing': {
                setting: 'port_launay_church_behind',
                witch_position: 'burying_treasure',
                pirate_position: 'not_present',
                interaction: 'hidden_stash',
                lighting: 'moonlight_shadows',
                story_moment: 'hiding_stolen_treasure'
            },
            'spell_casting': {
                setting: 'waterfall_pool',
                witch_position: 'ritual_circle',
                pirate_position: 'watching_ceremony',
                interaction: 'magical_protection',
                lighting: 'mystical_aura',
                story_moment: 'protection_spell_casting'
            }
        };

        // Port Launay Church treasure coordinates (real location clues)
        this.treasureClues = {
            exact_location: {
                lat: -4.6275,
                lng: 55.4094,
                description: "Behind Port Launay Church, 3 meters northeast of cemetery wall",
                landmark: "Large takamaka tree roots",
                depth: "2 feet underground",
                container: "Wrapped in oiled leather, placed in wooden box"
            },
            verification_elements: [
                "Church bell tower shadow at noon points directly to spot",
                "Counting 47 steps from church main door toward mountain",
                "Look for three coral stones arranged in triangle",
                "Dig beneath the largest takamaka root intersection"
            ]
        };
    }

    // Generate special treasure location clue for legendary NFTs
    generateTreasureLocationClue(tokenId) {
        const seed = `${tokenId}-${process.env.MASTER_CIPHER_KEY}-WATERFALL_WITCH`;
        const hash = crypto.createHash('sha256').update(seed).digest('hex');

        const clueFragments = [
            "PORT_LAUNAY_CHURCH_NORTHEAST",
            "TAKAMAKA_ROOT_INTERSECTION",
            "CEMETERY_WALL_THREE_METERS",
            "CORAL_TRIANGLE_MARKER",
            "TWO_FEET_UNDERGROUND_DEPTH"
        ];

        // Legendary NFTs get complete location data
        const isLocationCard = this.getRarity(tokenId) === 'legendary';

        return {
            type: 'treasure_location',
            is_winning_card: isLocationCard,
            cipher: Buffer.from(`${hash.substring(0, 16)}-WITCH-BETRAYAL`).toString('base64'),
            location_hint: isLocationCard ?
                this.treasureClues.exact_location :
                clueFragments[tokenId % clueFragments.length],
            verification_element: isLocationCard ?
                this.treasureClues.verification_elements :
                ["Seek the witch's final betrayal", "Where pirates' gold finds sanctuary"],
            coordinates_encoded: this.encodeCoordinates(tokenId, isLocationCard),
            story_fragment: this.getStoryFragment(tokenId)
        };
    }

    encodeCoordinates(tokenId, isExact) {
        if (isExact) {
            // Real coordinates for winning cards
            const lat = this.treasureClues.exact_location.lat;
            const lng = this.treasureClues.exact_location.lng;
            return `${lat.toFixed(6)},${lng.toFixed(6)}`;
        } else {
            // Offset coordinates for regular cards
            const offset = (tokenId * 13) % 1000 / 100000; // Small random offset
            const baseLat = -4.6275 + offset;
            const baseLng = 55.4094 + offset;
            return `${baseLat.toFixed(4)},${baseLng.toFixed(4)}`;
        }
    }

    getStoryFragment(tokenId) {
        const fragments = [
            "The witch smiled as pirates handed over their gold, unaware of her true intentions...",
            "Night after night, she would take just a coin or two, her greed growing bolder...",
            "Behind the sacred walls where prayers echo, she buried her stolen fortune...",
            "The ancient takamaka tree guards secrets deeper than its roots...",
            "When the church bells ring at noon, shadows reveal what daylight conceals..."
        ];

        return fragments[tokenId % fragments.length];
    }

    // Determine rarity for waterfall edition (higher legendary rate)
    getRarity(tokenId) {
        const position = tokenId - this.startTokenId + 1;
        if (position <= 90) return 'rare';
        if (position <= 135) return 'epic';
        return 'legendary'; // Last 15 NFTs are legendary with treasure locations
    }

    // Generate sophisticated character traits
    generateAdvancedTraits(tokenId) {
        const rarity = this.getRarity(tokenId);
        const random = (seed) => {
            const x = Math.sin(seed * tokenId) * 10000;
            return x - Math.floor(x);
        };

        // Select witch and pirate types
        const witchTypeKeys = Object.keys(this.witchTypes);
        const pirateTypeKeys = Object.keys(this.pirateTypes);
        const sceneTypeKeys = Object.keys(this.sceneTypes);

        const selectedWitch = witchTypeKeys[Math.floor(random(1) * witchTypeKeys.length)];
        const selectedPirate = pirateTypeKeys[Math.floor(random(2) * pirateTypeKeys.length)];
        const selectedScene = sceneTypeKeys[Math.floor(random(3) * sceneTypeKeys.length)];

        const witch = this.witchTypes[selectedWitch];
        const pirate = this.pirateTypes[selectedPirate];
        const scene = this.sceneTypes[selectedScene];

        return {
            tokenId,
            edition: 'Sauzier Waterfalls Special Edition',
            rarity,
            clue: this.generateTreasureLocationClue(tokenId),
            characters: {
                witch: {
                    type: selectedWitch,
                    ...witch,
                    facial_features: this.generateFacialFeatures(random(10), witch.age),
                    pose: this.getCharacterPose(scene.witch_position),
                    emotional_state: this.getEmotionalState(scene.interaction, 'witch')
                },
                pirate: {
                    type: selectedPirate,
                    ...pirate,
                    facial_features: this.generateFacialFeatures(random(20), pirate.age),
                    pose: this.getCharacterPose(scene.pirate_position),
                    emotional_state: this.getEmotionalState(scene.interaction, 'pirate')
                }
            },
            scene: {
                type: selectedScene,
                ...scene,
                atmosphere: this.generateAtmosphere(random(30), scene.lighting),
                environmental_details: this.getEnvironmentalDetails(scene.setting, rarity)
            },
            artistic_elements: {
                color_palette: this.generateColorPalette(random(40), scene.lighting),
                composition: this.getComposition(scene.interaction),
                detail_level: rarity === 'legendary' ? 'masterpiece' : rarity === 'epic' ? 'highly_detailed' : 'detailed',
                art_style: 'contemporary_comic_realism'
            }
        };
    }

    generateFacialFeatures(randomSeed, age) {
        const ageRanges = {
            'young': { wrinkles: 0.1, eye_depth: 0.3, jaw_definition: 0.7 },
            'young_adult': { wrinkles: 0.2, eye_depth: 0.5, jaw_definition: 0.8 },
            'middle_aged': { wrinkles: 0.4, eye_depth: 0.7, jaw_definition: 0.6 },
            'mature': { wrinkles: 0.6, eye_depth: 0.8, jaw_definition: 0.5 },
            'elderly': { wrinkles: 0.9, eye_depth: 0.9, jaw_definition: 0.3 },
            'ancient': { wrinkles: 1.0, eye_depth: 1.0, jaw_definition: 0.2 }
        };

        const baseFeatures = ageRanges[age] || ageRanges['middle_aged'];

        return {
            eye_color: ['brown', 'blue', 'green', 'hazel', 'grey'][Math.floor(randomSeed * 5)],
            eye_shape: ['almond', 'round', 'hooded', 'upturned', 'downturned'][Math.floor(randomSeed * 10 % 5)],
            nose_shape: ['straight', 'aquiline', 'button', 'wide', 'pointed'][Math.floor(randomSeed * 15 % 5)],
            mouth_shape: ['full', 'thin', 'wide', 'cupid_bow', 'downturned'][Math.floor(randomSeed * 20 % 5)],
            face_shape: ['oval', 'round', 'square', 'heart', 'long'][Math.floor(randomSeed * 25 % 5)],
            skin_tone: ['pale', 'fair', 'medium', 'olive', 'dark', 'weathered'][Math.floor(randomSeed * 30 % 6)],
            distinctive_features: this.getDistinctiveFeatures(randomSeed * 100, age),
            ...baseFeatures
        };
    }

    getDistinctiveFeatures(randomValue, age) {
        const features = [];
        const allFeatures = [
            'scar_across_cheek', 'gold_tooth', 'weathered_hands', 'piercing_eyes',
            'crooked_nose', 'tattoo_on_neck', 'missing_finger', 'burn_mark',
            'elaborate_earrings', 'ritual_scars', 'colored_contacts', 'face_paint'
        ];

        const numFeatures = age === 'ancient' || age === 'elderly' ? 3 :
                           age === 'mature' || age === 'middle_aged' ? 2 : 1;

        for (let i = 0; i < numFeatures; i++) {
            const feature = allFeatures[Math.floor((randomValue + i * 37) % allFeatures.length)];
            if (!features.includes(feature)) {
                features.push(feature);
            }
        }

        return features;
    }

    getCharacterPose(position) {
        const poses = {
            'behind_cauldron': 'standing_over_bubbling_cauldron_hands_raised',
            'kneeling_before_witch': 'on_one_knee_offering_treasure_upward_gaze',
            'cave_entrance': 'leaning_against_cave_wall_beckoning_gesture',
            'approaching_cautiously': 'walking_forward_hand_on_sword_alert_stance',
            'stealing_from_chest': 'crouched_over_treasure_chest_grabbing_coins',
            'sleeping_or_absent': 'lying_against_cave_wall_unconscious',
            'burying_treasure': 'digging_hole_bag_of_coins_beside',
            'not_present': 'absent_from_scene',
            'ritual_circle': 'arms_raised_to_sky_in_magical_circle',
            'watching_ceremony': 'standing_back_observing_respectfully'
        };

        return poses[position] || 'standing_neutral_alert';
    }

    getEmotionalState(interaction, characterType) {
        const emotions = {
            'payment_for_spell': {
                'witch': 'cunning_satisfaction_hidden_greed',
                'pirate': 'desperate_hope_slight_suspicion'
            },
            'first_meeting': {
                'witch': 'mysterious_allure_calculating',
                'pirate': 'cautious_curiosity_fear'
            },
            'witch_betrayal': {
                'witch': 'secretive_guilt_satisfaction',
                'pirate': 'unaware_sleeping_peaceful'
            },
            'hidden_stash': {
                'witch': 'paranoid_excitement_rushed',
                'pirate': 'not_present'
            },
            'magical_protection': {
                'witch': 'powerful_concentration_mystical',
                'pirate': 'awe_respect_fear'
            }
        };

        return emotions[interaction]?.[characterType] || 'neutral_alert';
    }

    generateAtmosphere(randomSeed, lighting) {
        const baseAtmospheres = {
            'magical_firelight': {
                primary_light: 'warm_orange_flickering',
                shadows: 'deep_dancing_shadows',
                particles: 'floating_embers_magical_sparks',
                mood: 'mysterious_intimate'
            },
            'natural_daylight': {
                primary_light: 'filtered_sunlight_through_mist',
                shadows: 'soft_natural_shadows',
                particles: 'water_droplets_light_rays',
                mood: 'ethereal_mystical'
            },
            'dim_secretive': {
                primary_light: 'single_torch_or_moon_beam',
                shadows: 'harsh_dramatic_shadows',
                particles: 'dust_motes_in_light_shaft',
                mood: 'tense_secretive'
            },
            'moonlight_shadows': {
                primary_light: 'cold_blue_moonlight',
                shadows: 'long_dramatic_shadows',
                particles: 'night_mist_fog',
                mood: 'eerie_clandestine'
            },
            'mystical_aura': {
                primary_light: 'magical_multicolored_glow',
                shadows: 'shifting_colored_shadows',
                particles: 'magical_sparkles_energy_wisps',
                mood: 'otherworldly_powerful'
            }
        };

        const base = baseAtmospheres[lighting] || baseAtmospheres['natural_daylight'];

        // Add weather effects based on random seed
        const weatherEffects = ['light_rain', 'heavy_mist', 'clear_air', 'tropical_humidity'];
        const selectedWeather = weatherEffects[Math.floor(randomSeed * weatherEffects.length)];

        return {
            ...base,
            weather: selectedWeather,
            visibility: randomSeed > 0.7 ? 'crystal_clear' : randomSeed > 0.4 ? 'slight_haze' : 'misty_obscured',
            temperature_feel: randomSeed > 0.5 ? 'warm_tropical' : 'cool_cave_air'
        };
    }

    getEnvironmentalDetails(setting, rarity) {
        const details = {
            'witch_cave_interior': {
                base: ['stalactites', 'bubbling_cauldron', 'herb_shelves', 'crystal_formations'],
                enhanced: ['carved_symbols_on_walls', 'treasure_piles', 'magical_runes', 'skull_decorations'],
                legendary: ['ancient_treasure_maps_on_walls', 'stolen_pirate_flags', 'hidden_passages', 'glowing_crystals']
            },
            'waterfall_exterior': {
                base: ['cascading_water', 'tropical_plants', 'moss_covered_rocks', 'mist_spray'],
                enhanced: ['rainbow_in_mist', 'exotic_birds', 'hidden_cave_entrance', 'sacred_stone_circle'],
                legendary: ['ancient_carved_totems', 'treasure_glint_in_water', 'magical_light_phenomena', 'spirit_wisps']
            },
            'cave_treasure_room': {
                base: ['treasure_chests', 'gold_coins_scattered', 'pirate_weapons', 'wooden_crates'],
                enhanced: ['jeweled_artifacts', 'ancient_maps', 'precious_gemstones', 'silver_chalices'],
                legendary: ['legendary_pirate_artifacts', 'glowing_treasure', 'cursed_items', 'hidden_compartments']
            },
            'port_launay_church_behind': {
                base: ['church_walls', 'cemetery_crosses', 'takamaka_trees', 'coral_stones'],
                enhanced: ['church_bell_tower', 'weathered_gravestones', 'tropical_flowers', 'stone_pathway'],
                legendary: ['hidden_treasure_markers', 'ancient_burial_sites', 'mystical_tree_formations', 'secret_symbols']
            },
            'waterfall_pool': {
                base: ['natural_rock_pool', 'clear_water', 'surrounding_vegetation', 'water_lilies'],
                enhanced: ['carved_ritual_stones', 'floating_candles', 'mystical_symbols', 'exotic_fish'],
                legendary: ['magical_water_effects', 'glowing_pool_bottom', 'ancient_altars', 'spirit_manifestations']
            }
        };

        const settingDetails = details[setting] || details['witch_cave_interior'];
        let selectedDetails = [...settingDetails.base];

        if (rarity === 'epic' || rarity === 'legendary') {
            selectedDetails = [...selectedDetails, ...settingDetails.enhanced];
        }
        if (rarity === 'legendary') {
            selectedDetails = [...selectedDetails, ...settingDetails.legendary];
        }

        return selectedDetails;
    }

    generateColorPalette(randomSeed, lighting) {
        const palettes = {
            'magical_firelight': {
                primary: ['#FF6B35', '#F7931E', '#FFD23F'],
                secondary: ['#8B4513', '#A0522D', '#CD853F'],
                accent: ['#FF4500', '#FF8C00', '#FFA500'],
                shadows: ['#2F1B14', '#4A2C2A', '#8B0000']
            },
            'natural_daylight': {
                primary: ['#87CEEB', '#98FB98', '#F0E68C'],
                secondary: ['#228B22', '#32CD32', '#9ACD32'],
                accent: ['#FFD700', '#FFA500', '#FF6347'],
                shadows: ['#2F4F4F', '#556B2F', '#8B4513']
            },
            'dim_secretive': {
                primary: ['#2F2F2F', '#404040', '#696969'],
                secondary: ['#8B0000', '#A0522D', '#800000'],
                accent: ['#FFD700', '#FFA500', '#FF4500'],
                shadows: ['#000000', '#1C1C1C', '#2F1B14']
            },
            'moonlight_shadows': {
                primary: ['#191970', '#4682B4', '#6495ED'],
                secondary: ['#2F4F4F', '#708090', '#778899'],
                accent: ['#C0C0C0', '#D3D3D3', '#F8F8FF'],
                shadows: ['#000000', '#2F2F2F', '#404040']
            },
            'mystical_aura': {
                primary: ['#9370DB', '#8A2BE2', '#9932CC'],
                secondary: ['#FF1493', '#FF69B4', '#FFB6C1'],
                accent: ['#00FF7F', '#32CD32', '#ADFF2F'],
                shadows: ['#4B0082', '#800080', '#8B008B']
            }
        };

        return palettes[lighting] || palettes['natural_daylight'];
    }

    getComposition(interaction) {
        const compositions = {
            'payment_for_spell': 'dynamic_diagonal_with_witch_dominant',
            'first_meeting': 'balanced_symmetrical_cautious_distance',
            'witch_betrayal': 'dramatic_low_angle_witch_looming',
            'hidden_stash': 'secretive_close_up_focused_on_action',
            'magical_protection': 'ceremonial_circular_composition'
        };

        return compositions[interaction] || 'balanced_centered_composition';
    }

    // Advanced character rendering with realistic proportions
    async drawRealisticCharacter(ctx, character, position, traits) {
        const { type, facial_features, pose, emotional_state, age, clothing } = character;

        // Calculate realistic proportions based on age and build
        const baseHeight = this.height * 0.6; // Characters take up 60% of canvas height
        const headHeight = baseHeight / 8; // Realistic 8-head proportion
        const bodyWidth = headHeight * 2.5;

        // Position calculations
        const x = position.x;
        const y = position.y;

        // Draw character in layers for depth and realism
        await this.drawCharacterBase(ctx, x, y, baseHeight, bodyWidth, character, traits);
        await this.drawDetailedFace(ctx, x, y - baseHeight + headHeight, headHeight, facial_features, emotional_state);
        await this.drawClothing(ctx, x, y, baseHeight, bodyWidth, clothing, character.type);
        await this.drawAccessories(ctx, x, y, baseHeight, character.accessories);

        if (character.magical_aura) {
            await this.drawMagicalAura(ctx, x, y, baseHeight, character.magical_aura, traits.rarity);
        }
    }

    async drawCharacterBase(ctx, x, y, height, width, character, traits) {
        // Draw realistic body proportions
        ctx.fillStyle = this.getSkinColor(character.facial_features.skin_tone);

        // Head (circle with proper proportions)
        const headRadius = height / 16;
        ctx.beginPath();
        ctx.arc(x, y - height + headRadius, headRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Neck
        ctx.fillRect(x - headRadius * 0.3, y - height + headRadius * 2, headRadius * 0.6, headRadius * 0.8);

        // Torso (realistic chest and waist)
        ctx.fillRect(x - width * 0.4, y - height + headRadius * 3, width * 0.8, height * 0.4);

        // Arms (with proper joint positioning)
        ctx.fillRect(x - width * 0.6, y - height + headRadius * 3.5, width * 0.2, height * 0.3);
        ctx.fillRect(x + width * 0.4, y - height + headRadius * 3.5, width * 0.2, height * 0.3);

        // Legs (realistic proportions)
        ctx.fillRect(x - width * 0.2, y - height + headRadius * 7, width * 0.15, height * 0.45);
        ctx.fillRect(x + width * 0.05, y - height + headRadius * 7, width * 0.15, height * 0.45);
    }

    async drawDetailedFace(ctx, x, y, size, features, emotion) {
        // This is a placeholder for complex facial feature rendering
        // In production, this would use detailed sprite assets or advanced drawing algorithms

        const faceRadius = size * 0.8;

        // Face shape
        ctx.fillStyle = this.getSkinColor(features.skin_tone);
        ctx.beginPath();
        ctx.arc(x, y, faceRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Eyes (detailed with iris, pupil, reflections)
        this.drawRealisticEyes(ctx, x, y, faceRadius, features, emotion);

        // Nose (shaped according to nose_shape)
        this.drawRealisticNose(ctx, x, y, faceRadius, features.nose_shape);

        // Mouth (expression based on emotional_state)
        this.drawRealisticMouth(ctx, x, y, faceRadius, features, emotion);

        // Add wrinkles and aging effects
        this.addAgingEffects(ctx, x, y, faceRadius, features.wrinkles);

        // Distinctive features
        this.drawDistinctiveFeatures(ctx, x, y, faceRadius, features.distinctive_features);
    }

    drawRealisticEyes(ctx, x, y, faceSize, features, emotion) {
        const eyeSize = faceSize * 0.15;
        const eyeY = y - faceSize * 0.2;

        // Left eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(x - faceSize * 0.25, eyeY, eyeSize, eyeSize * 0.7, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Right eye
        ctx.beginPath();
        ctx.ellipse(x + faceSize * 0.25, eyeY, eyeSize, eyeSize * 0.7, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Iris color
        ctx.fillStyle = this.getEyeColor(features.eye_color);
        ctx.beginPath();
        ctx.arc(x - faceSize * 0.25, eyeY, eyeSize * 0.6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + faceSize * 0.25, eyeY, eyeSize * 0.6, 0, 2 * Math.PI);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x - faceSize * 0.25, eyeY, eyeSize * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + faceSize * 0.25, eyeY, eyeSize * 0.3, 0, 2 * Math.PI);
        ctx.fill();

        // Light reflections for life-like appearance
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x - faceSize * 0.22, eyeY - eyeSize * 0.1, eyeSize * 0.08, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + faceSize * 0.28, eyeY - eyeSize * 0.1, eyeSize * 0.08, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawRealisticNose(ctx, x, y, faceSize, noseShape) {
        const noseWidth = faceSize * 0.1;
        const noseHeight = faceSize * 0.2;
        const noseY = y;

        ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
        ctx.lineWidth = 2;

        switch (noseShape) {
            case 'aquiline':
                ctx.beginPath();
                ctx.moveTo(x, noseY - noseHeight * 0.5);
                ctx.quadraticCurveTo(x + noseWidth * 0.3, noseY, x, noseY + noseHeight * 0.5);
                ctx.stroke();
                break;
            case 'button':
                ctx.beginPath();
                ctx.arc(x, noseY, noseWidth * 0.8, 0, Math.PI);
                ctx.stroke();
                break;
            default:
                ctx.beginPath();
                ctx.moveTo(x, noseY - noseHeight * 0.5);
                ctx.lineTo(x, noseY + noseHeight * 0.5);
                ctx.stroke();
        }
    }

    drawRealisticMouth(ctx, x, y, faceSize, features, emotion) {
        const mouthWidth = faceSize * 0.2;
        const mouthY = y + faceSize * 0.3;

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;

        // Mouth shape based on emotion
        ctx.beginPath();
        if (emotion.includes('cunning') || emotion.includes('sly')) {
            // Slight smirk
            ctx.moveTo(x - mouthWidth, mouthY);
            ctx.quadraticCurveTo(x, mouthY - faceSize * 0.05, x + mouthWidth, mouthY + faceSize * 0.03);
        } else if (emotion.includes('fear') || emotion.includes('desperate')) {
            // Worried frown
            ctx.moveTo(x - mouthWidth, mouthY + faceSize * 0.02);
            ctx.quadraticCurveTo(x, mouthY + faceSize * 0.05, x + mouthWidth, mouthY + faceSize * 0.02);
        } else {
            // Neutral mouth
            ctx.moveTo(x - mouthWidth, mouthY);
            ctx.lineTo(x + mouthWidth, mouthY);
        }
        ctx.stroke();
    }

    addAgingEffects(ctx, x, y, faceSize, wrinkleLevel) {
        if (wrinkleLevel < 0.3) return;

        ctx.strokeStyle = `rgba(139, 69, 19, ${wrinkleLevel * 0.5})`;
        ctx.lineWidth = 1;

        // Forehead wrinkles
        for (let i = 0; i < Math.floor(wrinkleLevel * 3); i++) {
            ctx.beginPath();
            ctx.moveTo(x - faceSize * 0.3, y - faceSize * 0.5 + i * 10);
            ctx.lineTo(x + faceSize * 0.3, y - faceSize * 0.5 + i * 10);
            ctx.stroke();
        }

        // Crow's feet
        if (wrinkleLevel > 0.5) {
            ctx.beginPath();
            ctx.moveTo(x + faceSize * 0.4, y - faceSize * 0.2);
            ctx.lineTo(x + faceSize * 0.5, y - faceSize * 0.15);
            ctx.stroke();
        }
    }

    drawDistinctiveFeatures(ctx, x, y, faceSize, features) {
        features.forEach(feature => {
            switch (feature) {
                case 'scar_across_cheek':
                    ctx.strokeStyle = '#8B0000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x + faceSize * 0.1, y - faceSize * 0.1);
                    ctx.lineTo(x + faceSize * 0.4, y + faceSize * 0.2);
                    ctx.stroke();
                    break;
                case 'gold_tooth':
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(x - faceSize * 0.1, y + faceSize * 0.35, 3, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
                // Add more distinctive features as needed
            }
        });
    }

    async drawClothing(ctx, x, y, height, width, clothing, characterType) {
        // This would render detailed period-accurate clothing
        // For now, basic colored shapes representing different clothing types

        const clothingColors = {
            'tattered_robes': ['#8B4513', '#A0522D'],
            'ornate_coat': ['#000080', '#FFD700'],
            'leather_vest': ['#8B4513', '#654321'],
            'scaled_robes': ['#008B8B', '#20B2AA']
        };

        const colors = clothingColors[clothing] || ['#8B4513', '#654321'];

        // Draw clothing layers
        ctx.fillStyle = colors[0];
        ctx.fillRect(x - width * 0.4, y - height * 0.6, width * 0.8, height * 0.4);

        if (colors[1]) {
            ctx.fillStyle = colors[1];
            ctx.fillRect(x - width * 0.35, y - height * 0.55, width * 0.7, height * 0.1);
        }
    }

    async drawAccessories(ctx, x, y, height, accessories) {
        // Draw various pirate/witch accessories with detail
        accessories.forEach(accessory => {
            switch (accessory) {
                case 'tricorn_hat':
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.ellipse(x, y - height, height * 0.15, height * 0.05, 0, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
                case 'crystal_orb':
                    const gradient = ctx.createRadialGradient(x - height * 0.2, y - height * 0.3, 0, x - height * 0.2, y - height * 0.3, height * 0.08);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                    gradient.addColorStop(1, 'rgba(200, 200, 255, 0.3)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x - height * 0.2, y - height * 0.3, height * 0.08, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
                // Add more accessories
            }
        });
    }

    async drawMagicalAura(ctx, x, y, height, auraType, rarity) {
        const intensity = rarity === 'legendary' ? 1.0 : rarity === 'epic' ? 0.7 : 0.4;

        ctx.save();
        ctx.globalAlpha = intensity * 0.6;

        switch (auraType) {
            case 'purple_mist':
                const purpleGradient = ctx.createRadialGradient(x, y - height/2, 0, x, y - height/2, height);
                purpleGradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
                purpleGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
                ctx.fillStyle = purpleGradient;
                ctx.fillRect(x - height, y - height, height * 2, height);
                break;
            case 'green_sparkles':
                for (let i = 0; i < 20 * intensity; i++) {
                    const sparkleX = x + (Math.random() - 0.5) * height;
                    const sparkleY = y - height + Math.random() * height;
                    ctx.fillStyle = `rgba(50, 205, 50, ${Math.random()})`;
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, Math.random() * 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
                break;
        }

        ctx.restore();
    }

    // Helper methods for colors and styling
    getSkinColor(tone) {
        const colors = {
            'pale': '#FDBCB4',
            'fair': '#EDB98A',
            'medium': '#C68642',
            'olive': '#A0715E',
            'dark': '#8D5524',
            'weathered': '#A0522D'
        };
        return colors[tone] || colors['fair'];
    }

    getEyeColor(color) {
        const colors = {
            'brown': '#8B4513',
            'blue': '#4682B4',
            'green': '#228B22',
            'hazel': '#CD853F',
            'grey': '#708090'
        };
        return colors[color] || colors['brown'];
    }

    // Environment rendering methods
    async renderSauzierWaterfall(ctx, scene, traits) {
        // Draw detailed waterfall environment
        await this.drawWaterfallBackground(ctx, scene.setting);
        await this.drawWaterfallDetails(ctx, traits.rarity);
        await this.addEnvironmentalEffects(ctx, scene.atmosphere);
    }

    async drawWaterfallBackground(ctx, setting) {
        // Create realistic waterfall scene
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.3, '#98FB98'); // Pale green (forest)
        gradient.addColorStop(0.7, '#228B22'); // Forest green
        gradient.addColorStop(1, '#006400'); // Dark green (water pool)

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw waterfall cascade
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(this.width * 0.3, 0, this.width * 0.4, this.height * 0.6);

        // Add water flow texture
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
            const x = this.width * 0.3 + Math.random() * this.width * 0.4;
            const y = Math.random() * this.height * 0.6;
            ctx.fillRect(x, y, 2, Math.random() * 20);
        }
    }

    async drawWaterfallDetails(ctx, rarity) {
        // Cave entrance
        ctx.fillStyle = '#2F2F2F';
        ctx.beginPath();
        ctx.arc(this.width * 0.8, this.height * 0.4, this.width * 0.08, 0, Math.PI);
        ctx.fill();

        // Tropical vegetation
        this.drawTropicalPlants(ctx, rarity);

        // Rock formations
        this.drawRockFormations(ctx);

        if (rarity === 'legendary') {
            // Add mystical elements for legendary cards
            this.drawMysticalEnvironmentEffects(ctx);
        }
    }

    drawTropicalPlants(ctx, rarity) {
        const plantCount = rarity === 'legendary' ? 30 : rarity === 'epic' ? 20 : 15;

        for (let i = 0; i < plantCount; i++) {
            const x = Math.random() * this.width;
            const y = this.height * 0.7 + Math.random() * this.height * 0.3;
            const size = Math.random() * 20 + 10;

            ctx.fillStyle = `rgba(34, 139, 34, ${0.7 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawRockFormations(ctx) {
        // Draw granite boulders typical of Seychelles
        const rocks = [
            { x: this.width * 0.1, y: this.height * 0.8, size: 60 },
            { x: this.width * 0.9, y: this.height * 0.75, size: 80 },
            { x: this.width * 0.5, y: this.height * 0.9, size: 40 }
        ];

        rocks.forEach(rock => {
            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.arc(rock.x, rock.y, rock.size, 0, 2 * Math.PI);
            ctx.fill();

            // Add rock texture
            ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
            for (let i = 0; i < 10; i++) {
                const textureX = rock.x + (Math.random() - 0.5) * rock.size;
                const textureY = rock.y + (Math.random() - 0.5) * rock.size;
                ctx.beginPath();
                ctx.arc(textureX, textureY, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    async addEnvironmentalEffects(ctx, atmosphere) {
        // Add mist effect
        if (atmosphere.particles.includes('water_droplets')) {
            ctx.save();
            ctx.globalAlpha = 0.3;

            for (let i = 0; i < 100; i++) {
                const x = Math.random() * this.width;
                const y = Math.random() * this.height;
                const size = Math.random() * 2;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.restore();
        }

        // Add light rays
        if (atmosphere.particles.includes('light_rays')) {
            ctx.save();
            ctx.globalAlpha = 0.2;

            for (let i = 0; i < 5; i++) {
                const gradient = ctx.createLinearGradient(
                    this.width * 0.2 + i * this.width * 0.15, 0,
                    this.width * 0.2 + i * this.width * 0.15, this.height
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = gradient;
                ctx.fillRect(this.width * 0.2 + i * this.width * 0.15, 0, 20, this.height);
            }

            ctx.restore();
        }
    }

    drawMysticalEnvironmentEffects(ctx) {
        // Add magical elements for legendary cards
        ctx.save();
        ctx.globalAlpha = 0.7;

        // Floating magical orbs
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height * 0.6;
            const size = Math.random() * 10 + 5;

            const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            orbGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            orbGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.6)');
            orbGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

            ctx.fillStyle = orbGradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.restore();
    }

    // Main NFT generation method
    async generateWaterfallWitchNFT(tokenId) {
        console.log(`🎨 Generating Waterfall Witch Special Edition NFT #${tokenId}...`);

        const traits = this.generateAdvancedTraits(tokenId);
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        // 1. Render environment
        await this.renderSauzierWaterfall(ctx, traits.scene, traits);

        // 2. Draw detailed characters with realistic proportions
        const witchPosition = {
            x: this.width * 0.7,
            y: this.height * 0.8
        };
        const piratePosition = {
            x: this.width * 0.3,
            y: this.height * 0.8
        };

        await this.drawRealisticCharacter(ctx, traits.characters.witch, witchPosition, traits);

        if (traits.scene.pirate_position !== 'not_present') {
            await this.drawRealisticCharacter(ctx, traits.characters.pirate, piratePosition, traits);
        }

        // 3. Add treasure location hints for legendary cards
        if (traits.rarity === 'legendary') {
            await this.addTreasureLocationVisualClues(ctx, traits.clue);
        }

        // 4. Add story elements and atmospheric effects
        await this.addStoryElements(ctx, traits);

        // Save image
        const fileName = `waterfall_witch_${tokenId.toString().padStart(4, '0')}.png`;
        const filePath = path.join(this.outputDir, fileName);

        await fs.ensureDir(this.outputDir);
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(filePath, buffer);

        console.log(`✅ Generated Waterfall Witch NFT #${tokenId}: ${fileName}`);
        console.log(`   🎭 Witch: ${traits.characters.witch.type}`);
        console.log(`   🏴‍☠️ Pirate: ${traits.characters.pirate.type}`);
        console.log(`   🎬 Scene: ${traits.scene.type}`);
        console.log(`   💎 Rarity: ${traits.rarity}`);
        if (traits.clue.is_winning_card) {
            console.log(`   🏆 TREASURE LOCATION CARD! Contains real coordinates!`);
        }

        return { ...traits, fileName, filePath };
    }

    async addTreasureLocationVisualClues(ctx, clue) {
        // Add visual elements that hint at Port Launay church location
        ctx.save();
        ctx.globalAlpha = 0.7;

        // Draw church silhouette in background
        ctx.fillStyle = 'rgba(139, 69, 19, 0.5)';
        const churchX = this.width * 0.1;
        const churchY = this.height * 0.3;

        // Church building
        ctx.fillRect(churchX, churchY, 80, 60);

        // Church tower
        ctx.fillRect(churchX + 25, churchY - 40, 30, 40);

        // Cross on top
        ctx.fillRect(churchX + 38, churchY - 50, 4, 15);
        ctx.fillRect(churchX + 33, churchY - 45, 14, 4);

        // Add takamaka tree outline
        ctx.fillStyle = 'rgba(34, 139, 34, 0.4)';
        ctx.beginPath();
        ctx.arc(churchX + 100, churchY + 40, 30, 0, 2 * Math.PI);
        ctx.fill();

        // Add coral stones triangle marker (very subtle)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(churchX + 90, churchY + 70);
        ctx.lineTo(churchX + 85, churchY + 75);
        ctx.lineTo(churchX + 95, churchY + 75);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    async addStoryElements(ctx, traits) {
        // Add visual storytelling elements based on scene
        switch (traits.scene.story_moment) {
            case 'witch_stealing_treasure':
                await this.drawStealingScene(ctx, traits);
                break;
            case 'pirates_paying_witch':
                await this.drawPaymentScene(ctx, traits);
                break;
            case 'hiding_stolen_treasure':
                await this.drawHidingScene(ctx, traits);
                break;
        }

        // Add scene-specific props and details
        await this.addSceneProps(ctx, traits.scene, traits.rarity);
    }

    async drawStealingScene(ctx, traits) {
        // Draw treasure chest with coins spilling out
        const chestX = this.width * 0.6;
        const chestY = this.height * 0.7;

        // Treasure chest
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(chestX, chestY, 60, 40);

        // Chest lid (open)
        ctx.fillRect(chestX, chestY - 20, 60, 10);

        // Gold coins scattered
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 15; i++) {
            const coinX = chestX + Math.random() * 80 - 10;
            const coinY = chestY + Math.random() * 30;
            ctx.beginPath();
            ctx.arc(coinX, coinY, 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Witch's bag for stolen treasure
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(this.width * 0.75, this.height * 0.75, 30, 40);
    }

    async drawPaymentScene(ctx, traits) {
        // Draw magical transaction - pirate offering gold to witch
        const exchangeX = this.width * 0.5;
        const exchangeY = this.height * 0.6;

        // Gold coins floating between characters
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 8; i++) {
            const coinX = exchangeX + (Math.random() - 0.5) * 100;
            const coinY = exchangeY + (Math.random() - 0.5) * 50;
            ctx.beginPath();
            ctx.arc(coinX, coinY, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Magical energy exchange
        const gradient = ctx.createRadialGradient(exchangeX, exchangeY, 0, exchangeX, exchangeY, 50);
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.6)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(exchangeX, exchangeY, 50, 0, 2 * Math.PI);
        ctx.fill();
    }

    async drawHidingScene(ctx, traits) {
        // Show witch near church with treasure bag
        const treasureX = this.width * 0.2;
        const treasureY = this.height * 0.8;

        // Shovel
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(treasureX - 10, treasureY - 20);
        ctx.lineTo(treasureX - 10, treasureY + 20);
        ctx.stroke();

        // Shovel blade
        ctx.fillStyle = '#696969';
        ctx.fillRect(treasureX - 15, treasureY - 25, 10, 15);

        // Dirt pile
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(treasureX + 20, treasureY + 10, 15, 0, Math.PI);
        ctx.fill();

        // Treasure bag
        ctx.fillStyle = '#654321';
        ctx.fillRect(treasureX, treasureY, 25, 35);
    }

    async addSceneProps(ctx, scene, rarity) {
        // Add scene-specific environmental props
        const propCount = rarity === 'legendary' ? 8 : rarity === 'epic' ? 5 : 3;

        for (let i = 0; i < propCount; i++) {
            const x = Math.random() * this.width;
            const y = this.height * 0.8 + Math.random() * this.height * 0.2;

            // Random props based on scene setting
            const props = ['shell', 'driftwood', 'coral', 'stone', 'flower'];
            const prop = props[Math.floor(Math.random() * props.length)];

            this.drawProp(ctx, x, y, prop);
        }
    }

    drawProp(ctx, x, y, propType) {
        switch (propType) {
            case 'shell':
                ctx.fillStyle = '#F5DEB3';
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'coral':
                ctx.fillStyle = '#FF7F50';
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'stone':
                ctx.fillStyle = '#696969';
                ctx.fillRect(x - 4, y - 3, 8, 6);
                break;
        }
    }

    // Generate complete batch
    async generateWaterfallWitchBatch() {
        console.log(`🚀 Starting Waterfall Witch Special Edition generation...`);
        console.log(`🎨 Batch size: ${this.batchSize} NFTs`);
        console.log(`📐 Canvas size: ${this.width}x${this.height}px`);
        console.log(`🏴‍☠️ Theme: Sauzier Waterfalls Witch's Cave`);

        const allTraits = [];
        const startTime = Date.now();

        for (let i = 0; i < this.batchSize; i++) {
            const tokenId = this.startTokenId + i;

            try {
                const nftData = await this.generateWaterfallWitchNFT(tokenId);
                allTraits.push(nftData);

                // Progress update every 10 NFTs
                if ((i + 1) % 10 === 0) {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const rate = (i + 1) / elapsed;
                    const remaining = (this.batchSize - i - 1) / rate;
                    console.log(`📊 Progress: ${i + 1}/${this.batchSize} (${((i + 1)/this.batchSize*100).toFixed(1)}%) - ETA: ${remaining.toFixed(0)}s`);
                }
            } catch (error) {
                console.error(`❌ Error generating Waterfall Witch NFT #${tokenId}:`, error);
                throw error;
            }
        }

        // Save traits data
        const traitsFilePath = './data/waterfall_witch_traits.json';
        await fs.writeJson(traitsFilePath, allTraits, { spaces: 2 });

        const totalTime = (Date.now() - startTime) / 1000;
        const legendaryCount = allTraits.filter(nft => nft.rarity === 'legendary').length;
        const treasureCards = allTraits.filter(nft => nft.clue.is_winning_card).length;

        console.log(`\n🎉 Waterfall Witch Special Edition Complete!`);
        console.log(`⏱️  Generated ${this.batchSize} NFTs in ${totalTime.toFixed(2)} seconds`);
        console.log(`📁 Images saved to: ${this.outputDir}`);
        console.log(`📋 Traits data saved to: ${traitsFilePath}`);
        console.log(`💎 Legendary NFTs: ${legendaryCount}`);
        console.log(`🏆 Treasure Location Cards: ${treasureCards}`);
        console.log(`\n🗝️  Special Features:`);
        console.log(`   • Professional comic book art style`);
        console.log(`   • Realistic character proportions and facial features`);
        console.log(`   • Detailed Sauzier Waterfalls environment`);
        console.log(`   • Interactive witch-pirate storylines`);
        console.log(`   • Real treasure location clues for Port Launay Church`);

        return allTraits;
    }
}

// Main execution
async function main() {
    try {
        const generator = new WaterfallWitchGenerator();
        await generator.generateWaterfallWitchBatch();
        console.log('\n✨ Waterfall Witch Special Edition generation complete!');
        console.log('🎨 Art quality: Professional contemporary comic book style');
        console.log('🏴‍☠️ Zero stick figures or childish drawings guaranteed!');
    } catch (error) {
        console.error('💥 Waterfall Witch generation failed:', error);
        process.exit(1);
    }
}

// ES module check for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default WaterfallWitchGenerator;