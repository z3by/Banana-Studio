import { translations } from '../i18n/translations';

export interface PromptData {
    // Subject
    gender: string;
    ageGroup: string;
    ethnicity: string;
    eyeColor: string;
    hairColor: string;
    hairStyle: string[]; // Multi-Select
    makeup: string[]; // Multi-Select
    clothing: string[];
    accessories: string[];
    pose: string[]; // Multi-Select
    action: string[]; // Multi-Select

    // Scene
    background: string;
    era: string;
    weather: string[]; // Multi-Select
    timeOfDay: string;
    mood: string[];

    // Camera & Technical
    camera: string;
    cameraType: string;
    lens: string[]; // Multi-Select
    filmStock: string[]; // Multi-Select
    composition: string[]; // Multi-Select
    aspectRatio: string;

    // Style & Production
    style: string[];
    photographerStyle: string[];
    lighting: string[];
    lightColor: string;
    colorGrading: string;
    specialEffects: string[];
    texture: string[];
    negativePrompt: string;

    // Advanced Parameters
    stylize: number;
    chaos: number;
    weirdness: number;

    // Addons
    addons: string[];
}

// --- Translation Helper ---
// Maps a potentially localized value back to English
const toEnglish = (category: string, value: string): string => {
    if (!value) return '';

    // specialized mappings from data keys to translation keys
    let lookupKey = category;
    let isRootKey = false;

    if (category === 'style') {
        lookupKey = 'styles';
        isRootKey = true;
    } else if (category === 'lighting') {
        isRootKey = true;
    }

    // Try finding dictionary using type-safe access
    let enDict: Record<string, string> | undefined;
    let arDict: Record<string, string> | undefined;

    if (isRootKey) {
        enDict = (translations.en as unknown as Record<string, Record<string, string>>)[lookupKey];
        arDict = (translations.ar as unknown as Record<string, Record<string, string>>)[lookupKey];
    } else {
        // Safe access to options
        enDict = (translations.en.options as unknown as Record<string, Record<string, string>>)[lookupKey];
        arDict = (translations.ar.options as unknown as Record<string, Record<string, string>>)[lookupKey];
    }

    if (!enDict) return value; // No dictionary found, return raw value

    // 1. Check if it's already an English known value
    const enValues = Object.values(enDict);
    if (enValues.includes(value)) return value;

    // 2. Check localized (Arabic) values
    if (arDict) {
        const entry = Object.entries(arDict).find(([, label]) => label === value);
        if (entry) {
            const [key] = entry;
            return enDict[key] || value;
        }
    }

    return value; // Custom value or not found
};

// Helper for arrays
const toEnglishArray = (category: string, values: string[]): string[] => {
    return values.map(v => toEnglish(category, v));
};


// --- Helper Functions for Enhanced Prompt Generation ---

// ═══════════════════════════════════════════════════════════════════════════════
// SMART PROMPT INTELLIGENCE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SCENE COHERENCE ANALYZER
 * Detects and resolves conflicting elements for harmonious prompts
 */
interface SceneAnalysis {
    suggestedLighting: string[];
    suggestedMood: string[];
    conflictResolutions: string[];
    harmonyEnhancements: string[];
}

function analyzeSceneCoherence(
    timeOfDay: string,
    weather: string[],
    background: string,
    lighting: string[],
    mood: string[]
): SceneAnalysis {
    const analysis: SceneAnalysis = {
        suggestedLighting: [],
        suggestedMood: [],
        conflictResolutions: [],
        harmonyEnhancements: []
    };

    const timeStr = timeOfDay?.toLowerCase() || '';
    const weatherStr = weather.join(' ').toLowerCase();
    const bgStr = background?.toLowerCase() || '';
    const lightStr = lighting.join(' ').toLowerCase();

    // Time-based lighting harmony
    if (timeStr.includes('golden') || timeStr.includes('sunset')) {
        analysis.harmonyEnhancements.push('warm rim light accentuating the subject');
        if (!lightStr.includes('golden') && !lightStr.includes('warm')) {
            analysis.suggestedLighting.push('complementary golden fill');
        }
    }
    if (timeStr.includes('blue hour') || timeStr.includes('night')) {
        analysis.harmonyEnhancements.push('cool ambient glow from the environment');
        if (!lightStr.includes('blue') && !lightStr.includes('cool') && !lightStr.includes('neon')) {
            analysis.suggestedLighting.push('subtle blue ambient wash');
        }
    }

    // Weather-mood harmony
    if (weatherStr.includes('rain')) {
        analysis.harmonyEnhancements.push('wet reflections adding depth');
        analysis.harmonyEnhancements.push('glistening surfaces catching light');
        if (!mood.some(m => ['moody', 'contemplative', 'dramatic', 'romantic'].includes(m.toLowerCase()))) {
            analysis.suggestedMood.push('contemplative');
        }
    }
    if (weatherStr.includes('fog') || weatherStr.includes('mist')) {
        analysis.harmonyEnhancements.push('atmospheric depth separation');
        analysis.harmonyEnhancements.push('mysterious silhouettes in the distance');
    }
    if (weatherStr.includes('snow')) {
        analysis.harmonyEnhancements.push('soft diffused winter light');
        analysis.harmonyEnhancements.push('delicate snowflakes catching highlights');
    }

    // Background-appropriate enhancements
    if (bgStr.includes('studio') || bgStr.includes('gradient')) {
        analysis.harmonyEnhancements.push('clean separation from background');
        analysis.harmonyEnhancements.push('professional edge lighting');
    }
    if (bgStr.includes('urban') || bgStr.includes('city') || bgStr.includes('street')) {
        analysis.harmonyEnhancements.push('authentic urban textures');
        analysis.harmonyEnhancements.push('environmental storytelling elements');
    }
    if (bgStr.includes('nature') || bgStr.includes('forest') || bgStr.includes('garden')) {
        analysis.harmonyEnhancements.push('organic natural framing');
        analysis.harmonyEnhancements.push('dappled light through foliage');
    }

    // Conflict detection and resolution
    if (timeStr.includes('night') && lightStr.includes('natural sunlight')) {
        analysis.conflictResolutions.push('moonlight and ambient city glow replacing sunlight');
    }
    if (timeStr.includes('golden') && lightStr.includes('cool')) {
        analysis.conflictResolutions.push('warm golden as key with cool shadows for dimension');
    }

    return analysis;
}

/**
 * PHOTOGRAPHER SIGNATURE INJECTOR
 * Adds characteristic elements when a specific photographer style is selected
 */
function getPhotographerSignature(photographers: string[]): string[] {
    const signatures: string[] = [];
    const photographerStr = photographers.join(' ').toLowerCase();

    const signatureMap: Record<string, string[]> = {
        'peter lindbergh': [
            'raw emotional authenticity',
            'timeless black and white sensibility',
            'minimal retouching preserving natural beauty',
            'powerful directness of gaze'
        ],
        'annie leibovitz': [
            'theatrical staging with cinematic grandeur',
            'rich saturated colors',
            'elaborate conceptual narrative',
            'iconic larger-than-life presence'
        ],
        'helmut newton': [
            'provocative elegant tension',
            'high contrast dramatic shadows',
            'empowered confident posing',
            'architectural precision in framing'
        ],
        'richard avedon': [
            'stark white background isolation',
            'psychological intensity',
            'captured moment of genuine expression',
            'minimalist powerful composition'
        ],
        'mario testino': [
            'sun-kissed glamorous warmth',
            'effortless luxury aesthetic',
            'vibrant saturated colors',
            'joyful energetic movement'
        ],
        'steven meisel': [
            'chameleonic transformative styling',
            'meticulous attention to detail',
            'fashion-forward conceptual vision',
            'editorial narrative complexity'
        ],
        'paolo roversi': [
            'painterly ethereal softness',
            'romantic dreamlike atmosphere',
            'long exposure technique suggestion',
            'timeless renaissance quality'
        ],
        'herb ritts': [
            'sculptural body celebration',
            'dramatic outdoor natural light',
            'classical Greek aesthetic influence',
            'powerful black and white contrast'
        ]
    };

    for (const [photographer, traits] of Object.entries(signatureMap)) {
        if (photographerStr.includes(photographer)) {
            signatures.push(...traits.slice(0, 2)); // Take top 2 traits
        }
    }

    return signatures;
}

/**
 * ERA-AWARE STYLING INJECTOR
 * Adds period-appropriate aesthetic details
 */
function getEraSpecificDetails(era: string): string[] {
    const eraStr = era?.toLowerCase() || '';
    const details: string[] = [];

    const eraDetailsMap: Record<string, string[]> = {
        'victorian': [
            'ornate period-accurate detailing',
            'warm gaslight ambiance',
            'rich velvet and brocade textures',
            'sepia-toned nostalgic warmth'
        ],
        '1920s': [
            'art deco geometric elegance',
            'jazz age glamour',
            'dramatic chiaroscuro lighting',
            'sophisticated speakeasy atmosphere'
        ],
        '1950s': [
            'technicolor vivid saturation',
            'classic Hollywood glamour',
            'perfectly coiffed retro styling',
            'mid-century optimistic energy'
        ],
        '1960s': [
            'mod pop art influence',
            'psychedelic color experimentation',
            'youthful rebellious energy',
            'space age futuristic optimism'
        ],
        '1970s': [
            'warm earthy analog tones',
            'soft focus dreamy quality',
            'natural bohemian aesthetic',
            'disco era sparkle and glamour'
        ],
        '1980s': [
            'bold neon color palette',
            'MTV era high energy',
            'power dressing confident presence',
            'synthesizer era chrome and glass'
        ],
        '1990s': [
            'grunge authentic rawness',
            'minimalist clean aesthetic',
            'heroin chic understatement',
            'supermodel era glamour'
        ],
        'cyberpunk': [
            'rain-slicked neon reflections',
            'holographic interference patterns',
            'tech-noir atmospheric density',
            'dystopian urban decay beauty'
        ],
        'steampunk': [
            'brass and copper metallic warmth',
            'Victorian industrial fusion',
            'clockwork mechanical intricacy',
            'sepia-toned adventure aesthetic'
        ],
        'retro futur': [
            'chrome and pastel optimism',
            'atomic age sleek curves',
            'space age wonder',
            'jet age streamlined elegance'
        ]
    };

    for (const [eraKey, eraDetails] of Object.entries(eraDetailsMap)) {
        if (eraStr.includes(eraKey)) {
            details.push(...eraDetails.slice(0, 2));
            break;
        }
    }

    return details;
}

/**
 * DYNAMIC EMPHASIS CALCULATOR
 * Determines which elements deserve stronger weight based on context
 */
interface EmphasisLevel {
    element: string;
    weight: number; // 1 = normal, 2 = strong (()), 3 = very strong ((()))
}

function calculateDynamicEmphasis(
    style: string[],
    mood: string[],
    lighting: string[],
    background: string,
    specialEffects: string[]
): EmphasisLevel[] {
    const emphasisLevels: EmphasisLevel[] = [];

    // Styles always get emphasis
    style.forEach(s => {
        const weight = s.toLowerCase().includes('photography') ? 2 : 1;
        emphasisLevels.push({ element: s, weight });
    });

    // Moods - dramatic gets extra weight
    mood.forEach(m => {
        const weight = ['dramatic', 'cinematic', 'epic', 'intense'].includes(m.toLowerCase()) ? 3 : 2;
        emphasisLevels.push({ element: m, weight });
    });

    // Lighting - key lights get more weight
    lighting.forEach((l, i) => {
        const weight = i === 0 ? 2 : 1; // First (key) light gets more emphasis
        emphasisLevels.push({ element: l, weight });
    });

    // Special effects that are dramatic get extra weight
    specialEffects.forEach(fx => {
        const weight = ['volumetric', 'ray', 'god rays', 'lens flare'].some(k =>
            fx.toLowerCase().includes(k)) ? 2 : 1;
        emphasisLevels.push({ element: fx, weight });
    });

    return emphasisLevels;
}

/**
 * SEMANTIC RELATIONSHIP BUILDER
 * Creates meaningful connections between elements
 */
function buildSemanticRelationships(
    subject: { gender: string; ageGroup: string; clothing: string[] },
    environment: { background: string; timeOfDay: string },
    technical: { lens: string[]; composition: string[] }
): string[] {
    const relationships: string[] = [];
    const bgStr = environment.background?.toLowerCase() || '';
    const clothingStr = subject.clothing.join(' ').toLowerCase();
    const lensStr = technical.lens.join(' ').toLowerCase();
    const compStr = technical.composition.join(' ').toLowerCase();

    // Subject-environment relationships
    if (bgStr.includes('coffee') || bgStr.includes('cafe')) {
        relationships.push('intimate café ambiance enveloping the subject');
    }
    if (bgStr.includes('urban') || bgStr.includes('city')) {
        relationships.push('urban energy framing the confident presence');
    }
    if (bgStr.includes('nature') || bgStr.includes('outdoor')) {
        relationships.push('natural environment harmonizing with the subject');
    }
    if (bgStr.includes('studio')) {
        relationships.push('controlled studio perfection highlighting every detail');
    }

    // Lens-subject relationships
    if (lensStr.includes('85mm') || lensStr.includes('portrait')) {
        relationships.push('flattering compression rendering perfect facial proportions');
    }
    if (lensStr.includes('35mm') || lensStr.includes('wide')) {
        relationships.push('environmental context placing subject within the story');
    }
    if (lensStr.includes('macro')) {
        relationships.push('extraordinary detail revealing subtle textures');
    }

    // Composition-subject relationships
    if (compStr.includes('rule of thirds')) {
        relationships.push('subject positioned at the power points for maximum impact');
    }
    if (compStr.includes('center')) {
        relationships.push('commanding central presence demanding attention');
    }
    if (compStr.includes('leading lines')) {
        relationships.push('environmental lines drawing the eye to the subject');
    }
    if (compStr.includes('symmetr')) {
        relationships.push('perfect symmetrical balance creating visual harmony');
    }

    // Clothing-context relationships
    if (clothingStr.includes('formal') || clothingStr.includes('suit') || clothingStr.includes('blazer')) {
        relationships.push('sophisticated attire commanding respect');
    }
    if (clothingStr.includes('casual')) {
        relationships.push('relaxed authentic presence');
    }

    return relationships.slice(0, 3); // Limit to top 3 relationships
}

/**
 * QUALITY MODULATION SYSTEM
 * Adjusts quality descriptors based on overall prompt complexity
 */
function getModulatedQualityTokens(
    styles: string[],
    mood: string[],
    hasPhotographer: boolean,
    hasFilmStock: boolean,
    hasEra: boolean
): string[] {
    const baseTokens = ['masterpiece', 'highly detailed', 'sharp focus'];
    const styleTokens: string[] = [];

    const styleStr = styles.join(' ').toLowerCase();
    const moodStr = mood.join(' ').toLowerCase();

    // Style-specific quality tokens
    if (styleStr.includes('portrait') || styleStr.includes('beauty')) {
        styleTokens.push('flawless skin texture', 'captivating gaze', 'magazine cover quality');
    }
    if (styleStr.includes('fashion') || styleStr.includes('editorial')) {
        styleTokens.push('vogue quality', 'editorial excellence', 'haute couture precision');
    }
    if (styleStr.includes('street') || styleStr.includes('documentary')) {
        styleTokens.push('raw authentic moment', 'decisive frame', 'compelling narrative');
    }
    if (styleStr.includes('cinematic') || styleStr.includes('film')) {
        styleTokens.push('theatrical grandeur', 'oscar-worthy cinematography', 'blockbuster production value');
    }
    if (styleStr.includes('fine art') || styleStr.includes('artistic')) {
        styleTokens.push('gallery exhibition quality', 'award-winning composition', 'museum worthy');
    }
    if (styleStr.includes('commercial') || styleStr.includes('product')) {
        styleTokens.push('advertisement ready', 'commercial excellence', 'brand-defining imagery');
    }

    // Mood-based quality enhancements
    if (moodStr.includes('dramatic') || moodStr.includes('moody')) {
        styleTokens.push('emotionally powerful', 'visually striking');
    }
    if (moodStr.includes('romantic') || moodStr.includes('dreamy')) {
        styleTokens.push('ethereal beauty', 'enchanting atmosphere');
    }
    if (moodStr.includes('epic') || moodStr.includes('grand')) {
        styleTokens.push('breathtaking scale', 'awe-inspiring grandeur');
    }

    // Complexity-aware quality boosters
    if (hasPhotographer) {
        styleTokens.push('signature artistic vision');
    }
    if (hasFilmStock) {
        styleTokens.push('authentic analog character');
    }
    if (hasEra) {
        styleTokens.push('period-perfect authenticity');
    }

    // Technical excellence
    styleTokens.push('exceptional color reproduction', 'perfect exposure', 'ultra high resolution');

    return [...baseTokens, ...styleTokens];
}

/**
 * Apply emphasis brackets based on weight level
 */
function applyEmphasis(element: string, weight: number): string {
    if (weight >= 3) return `(((${element})))`;
    if (weight >= 2) return `((${element}))`;
    return `(${element})`;
}

/**
 * Get intelligent negative prompt additions based on style
 */
function getEnhancedNegativePrompt(baseNegative: string, styles: string[]): string {
    const coreNegatives = [
        'blurry', 'out of focus', 'deformed', 'ugly', 'distorted',
        'disfigured', 'bad anatomy', 'wrong proportions', 'amateur',
        'low quality', 'jpeg artifacts', 'watermark', 'signature'
    ];

    const styleStr = styles.join(' ').toLowerCase();
    const additionalNegatives: string[] = [];

    if (styleStr.includes('portrait') || styleStr.includes('beauty')) {
        additionalNegatives.push('blemishes', 'unnatural skin', 'plastic look', 'uncanny valley');
    }
    if (styleStr.includes('cinematic') || styleStr.includes('professional')) {
        additionalNegatives.push('harsh shadows', 'overexposed', 'underexposed', 'flat lighting');
    }
    if (styleStr.includes('natural') || styleStr.includes('candid')) {
        additionalNegatives.push('overly posed', 'stiff expression', 'artificial');
    }

    const allNegatives = [...coreNegatives, ...additionalNegatives];
    const negativeStr = allNegatives.join(', ');

    return baseNegative ? `${baseNegative}, ${negativeStr}` : negativeStr;
}

/**
 * Build atmospheric description from weather, time, and mood
 */
function buildAtmosphericDescription(weather: string[], timeOfDay: string, mood: string[], lightColor: string): string {
    const parts: string[] = [];

    // Time of day with evocative language
    const timeDescriptions: Record<string, string> = {
        'Golden Hour': 'bathed in the warm golden embrace of the magic hour',
        'Blue Hour': 'enveloped in the ethereal blue twilight',
        'Sunset': 'illuminated by the fiery hues of a spectacular sunset',
        'Sunrise': 'kissed by the soft pink and orange glow of dawn',
        'Night': 'shrouded in the mysterious darkness of night',
        'Afternoon': 'lit by the bright, even afternoon sun',
        'Morning': 'touched by the fresh, crisp morning light',
        'Midday': 'under the brilliant midday sun',
        'Dusk': 'wrapped in the fading warmth of dusk',
        'Overcast': 'softened by gentle overcast skies'
    };

    if (timeOfDay && timeDescriptions[timeOfDay]) {
        parts.push(timeDescriptions[timeOfDay]);
    } else if (timeOfDay) {
        parts.push(`during ${timeOfDay.toLowerCase()}`);
    }

    // Weather atmosphere
    if (weather.length > 0) {
        const weatherDesc = weather.map(w => {
            const weatherMap: Record<string, string> = {
                'Rain': 'with delicate raindrops creating a mesmerizing atmosphere',
                'Fog': 'with mystical fog adding depth and mystery',
                'Snow': 'with gentle snowflakes dancing in the air',
                'Cloudy': 'under dramatic cloud formations',
                'Stormy': 'with powerful storm clouds building in the distance',
                'Clear': 'under crystal-clear skies',
                'Windy': 'with dynamic wind adding movement and energy'
            };
            return weatherMap[w] || w.toLowerCase();
        });
        parts.push(weatherDesc.join(', '));
    }

    // Light color integration
    if (lightColor) {
        const colorMap: Record<string, string> = {
            'Warm Golden': 'casting warm golden tones across the scene',
            'Cool Blue': 'with cool blue tones creating depth',
            'Neon Pink/Blue': 'with vibrant neon pink and blue reflections',
            'Warm Amber': 'with rich amber warmth suffusing the frame',
            'Natural White': 'with pure natural white balance',
            'Sunset Orange': 'with spectacular orange and crimson hues'
        };
        if (colorMap[lightColor]) {
            parts.push(colorMap[lightColor]);
        }
    }

    return parts.length > 0 ? parts.join(', ') : '';
}

/**
 * Build flowing subject description
 */
function buildSubjectDescription(
    gender: string,
    ageGroup: string,
    ethnicity: string,
    hairColor: string,
    hairStyle: string[],
    eyeColor: string,
    makeup: string[],
    clothing: string[],
    accessories: string[]
): string {
    const parts: string[] = [];

    // Core subject with evocative language
    if (gender && ageGroup && ethnicity) {
        parts.push(`a ${ageGroup.toLowerCase()} ${ethnicity} ${gender.toLowerCase()}`);
    } else if (gender && ageGroup) {
        parts.push(`a ${ageGroup.toLowerCase()} ${gender.toLowerCase()}`);
    } else if (gender) {
        parts.push(`a ${gender.toLowerCase()}`);
    }

    // Hair description
    if (hairColor || hairStyle.length > 0) {
        const hairParts = [hairColor, ...hairStyle].filter(Boolean);
        if (hairParts.length > 0) {
            parts.push(`with ${hairParts.join(' ').toLowerCase()} hair`);
        }
    }

    // Eyes
    if (eyeColor) {
        parts.push(`and ${eyeColor.toLowerCase()} eyes that capture the light`);
    }

    // Makeup
    if (makeup.length > 0) {
        parts.push(`featuring ${makeup.join(' and ').toLowerCase()} makeup`);
    }

    // Clothing
    if (clothing.length > 0) {
        parts.push(`wearing ${clothing.join(' with ').toLowerCase()}`);
    }

    // Accessories
    if (accessories.length > 0) {
        parts.push(`adorned with ${accessories.join(', ').toLowerCase()}`);
    }

    return parts.join(' ');
}

/**
 * Build technical specifications as narrative
 */
function buildTechnicalNarrative(
    camera: string,
    cameraType: string,
    lens: string[],
    filmStock: string[],
    composition: string[]
): string {
    const parts: string[] = [];

    // Camera and lens as narrative
    if (camera || cameraType || lens.length > 0) {
        const cameraParts: string[] = [];
        if (cameraType && camera) {
            cameraParts.push(`captured with a ${cameraType} ${camera}`);
        } else if (camera) {
            cameraParts.push(`shot on ${camera}`);
        } else if (cameraType) {
            cameraParts.push(`photographed with a ${cameraType}`);
        }

        if (lens.length > 0) {
            cameraParts.push(`using ${lens.join(' and ')}`);
        }

        if (cameraParts.length > 0) {
            parts.push(cameraParts.join(' '));
        }
    }

    // Film stock with character description
    if (filmStock.length > 0) {
        const filmDescriptions: Record<string, string> = {
            'Kodak Portra 400': 'the legendary warmth and skin-tone rendering of Kodak Portra 400',
            'Kodak Portra 800': 'the versatile and organic grain of Kodak Portra 800',
            'Fujifilm Pro 400H': 'the soft pastel tones characteristic of Fujifilm Pro 400H',
            'Kodak Ektar 100': 'the vivid saturated colors of Kodak Ektar 100',
            'Ilford HP5': 'the classic dramatic contrast of Ilford HP5 black and white',
            'Kodak Tri-X': 'the timeless gritty texture of Kodak Tri-X film'
        };

        const filmDesc = filmStock.map(f => filmDescriptions[f] || `${f} film simulation`);
        parts.push(`with ${filmDesc.join(', ')}`);
    }

    // Composition techniques
    if (composition.length > 0) {
        parts.push(`composed using ${composition.join(', ').toLowerCase()}`);
    }

    return parts.join(', ');
}

// --- Prompt Generation Logic ---
export function generatePrompt(data: PromptData): string {
    const sections: string[] = [];

    // Translate all data to English first
    const en = {
        gender: toEnglish('gender', data.gender),
        ageGroup: toEnglish('ageGroup', data.ageGroup),
        ethnicity: toEnglish('ethnicity', data.ethnicity),
        eyeColor: toEnglish('eyeColor', data.eyeColor),
        hairColor: toEnglish('hairColor', data.hairColor),
        hairStyle: toEnglishArray('hairStyle', data.hairStyle),
        makeup: toEnglishArray('makeup', data.makeup),
        clothing: toEnglishArray('clothing', data.clothing),
        accessories: toEnglishArray('accessories', data.accessories),
        pose: toEnglishArray('pose', data.pose),
        action: toEnglishArray('action', data.action),
        background: toEnglish('background', data.background),
        era: toEnglish('era', data.era),
        weather: toEnglishArray('weather', data.weather),
        timeOfDay: toEnglish('timeOfDay', data.timeOfDay),
        mood: toEnglishArray('mood', data.mood),
        camera: toEnglish('camera', data.camera),
        cameraType: toEnglish('cameraType', data.cameraType),
        lens: toEnglishArray('lens', data.lens),
        filmStock: toEnglishArray('filmStock', data.filmStock),
        composition: toEnglishArray('composition', data.composition),
        style: toEnglishArray('style', data.style),
        photographerStyle: toEnglishArray('photographerStyle', data.photographerStyle),
        lighting: toEnglishArray('lighting', data.lighting),
        lightColor: toEnglish('lightColor', data.lightColor),
        colorGrading: toEnglish('colorGrading', data.colorGrading),
        specialEffects: toEnglishArray('specialEffects', data.specialEffects),
        texture: toEnglishArray('texture', data.texture),
        addons: data.addons
    };

    // ═══════════════════════════════════════════════════════════════════
    // SMART ANALYSIS PHASE - Analyze scene for coherence and relationships
    // ═══════════════════════════════════════════════════════════════════

    const sceneAnalysis = analyzeSceneCoherence(
        en.timeOfDay, en.weather, en.background, en.lighting, en.mood
    );

    const photographerSignatures = getPhotographerSignature(en.photographerStyle);
    const eraDetails = getEraSpecificDetails(en.era);

    const semanticRelationships = buildSemanticRelationships(
        { gender: en.gender, ageGroup: en.ageGroup, clothing: en.clothing },
        { background: en.background, timeOfDay: en.timeOfDay },
        { lens: en.lens, composition: en.composition }
    );

    const emphasisLevels = calculateDynamicEmphasis(
        en.style, en.mood, en.lighting, en.background, en.specialEffects
    );

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 1: VIVID SCENE DESCRIPTION (The Hook)
    // ═══════════════════════════════════════════════════════════════════

    const primaryMood = en.mood.length > 0 ? en.mood[0].toLowerCase() : 'stunning';
    const sceneOpener = `A (((${primaryMood}))) and breathtaking`;

    const subjectDesc = buildSubjectDescription(
        en.gender, en.ageGroup, en.ethnicity,
        en.hairColor, en.hairStyle, en.eyeColor,
        en.makeup, en.clothing, en.accessories
    );

    const locationDesc = en.background
        ? `set against ${en.background.toLowerCase()}`
        : '';

    const actionDesc = en.action.length > 0
        ? en.action.join(' and ').toLowerCase()
        : '';

    const poseDesc = en.pose.length > 0
        ? en.pose.join(', ').toLowerCase()
        : '';

    // Build the opening scene with maximum impact
    let openingScene = `${sceneOpener} portrait of ${subjectDesc}`;
    if (locationDesc) openingScene += `, ${locationDesc}`;
    if (actionDesc) openingScene += `, ${actionDesc}`;
    if (poseDesc && !actionDesc) openingScene += `, in a ${poseDesc} pose`;

    openingScene += '.';
    sections.push(openingScene);

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 2: SEMANTIC RELATIONSHIPS (Subject-Environment Connection)
    // ═══════════════════════════════════════════════════════════════════

    if (semanticRelationships.length > 0) {
        sections.push(`${semanticRelationships.join('. ')}.`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 3: ATMOSPHERIC & ENVIRONMENTAL POETRY
    // ═══════════════════════════════════════════════════════════════════

    const atmosphericDesc = buildAtmosphericDescription(
        en.weather, en.timeOfDay, en.mood, en.lightColor
    );

    // Add scene harmony enhancements from analysis
    const harmonyParts: string[] = [];
    if (atmosphericDesc) harmonyParts.push(atmosphericDesc);
    if (sceneAnalysis.harmonyEnhancements.length > 0) {
        harmonyParts.push(...sceneAnalysis.harmonyEnhancements.slice(0, 2));
    }

    if (harmonyParts.length > 0 || en.era) {
        let envSection = '';
        if (en.era) {
            envSection += `Set in the ${en.era.toLowerCase()} era`;
            if (eraDetails.length > 0) {
                envSection += ` with ${eraDetails.join(' and ')}`;
            }
            if (harmonyParts.length > 0) envSection += `, ${harmonyParts.join(', ')}`;
        } else if (harmonyParts.length > 0) {
            envSection += `The scene is ${harmonyParts.join(', ')}`;
        }
        envSection += '.';
        sections.push(envSection);
    }

    // Add conflict resolutions if any
    if (sceneAnalysis.conflictResolutions.length > 0) {
        sections.push(`Harmonized with ${sceneAnalysis.conflictResolutions.join(', ')}.`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 4: TECHNICAL POETRY (Camera/Lens/Film as Narrative)
    // ═══════════════════════════════════════════════════════════════════

    const technicalNarrative = buildTechnicalNarrative(
        en.camera, en.cameraType, en.lens, en.filmStock, en.composition
    );

    if (technicalNarrative) {
        sections.push(`Expertly ${technicalNarrative}.`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 5: LIGHTING & STYLE (Dynamic Weighted Emphasis)
    // ═══════════════════════════════════════════════════════════════════

    const emphasizedElements: string[] = [];

    // Apply dynamic emphasis from analysis
    const lightingElements = emphasisLevels.filter(e =>
        en.lighting.includes(e.element));
    if (lightingElements.length > 0) {
        const lightingEmphasis = lightingElements
            .map(e => applyEmphasis(e.element, e.weight))
            .join(', ');
        emphasizedElements.push(lightingEmphasis);
    } else if (en.lighting.length > 0) {
        emphasizedElements.push(en.lighting.map(l => `((${l}))`).join(', '));
    }

    // Add suggested lighting from scene analysis
    if (sceneAnalysis.suggestedLighting.length > 0) {
        emphasizedElements.push(sceneAnalysis.suggestedLighting.join(', '));
    }

    // Style with dynamic emphasis
    const styleElements = emphasisLevels.filter(e =>
        en.style.includes(e.element));
    if (styleElements.length > 0) {
        const styleEmphasis = styleElements
            .map(e => applyEmphasis(e.element, e.weight))
            .join(', ');
        emphasizedElements.push(styleEmphasis);
    } else if (en.style.length > 0) {
        emphasizedElements.push(en.style.map(s => `((${s}))`).join(', '));
    }

    // Color grading
    if (en.colorGrading) {
        emphasizedElements.push(`((${en.colorGrading} color grading))`);
    }

    // Photographer inspiration with signatures
    if (en.photographerStyle.length > 0) {
        emphasizedElements.push(`inspired by ${en.photographerStyle.join(' and ')}`);
        if (photographerSignatures.length > 0) {
            emphasizedElements.push(`channeling ${photographerSignatures.join(', ')}`);
        }
    }

    // Special effects with dynamic emphasis
    const fxElements = emphasisLevels.filter(e =>
        en.specialEffects.includes(e.element));
    if (fxElements.length > 0) {
        emphasizedElements.push(fxElements
            .map(e => applyEmphasis(e.element, e.weight))
            .join(', '));
    } else if (en.specialEffects.length > 0) {
        emphasizedElements.push(en.specialEffects.join(', '));
    }

    // Texture
    if (en.texture.length > 0) {
        emphasizedElements.push(en.texture.join(', '));
    }

    if (emphasizedElements.length > 0) {
        sections.push(emphasizedElements.join(', ') + '.');
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 6: MOOD REINFORCEMENT (Triple-Layered)
    // ═══════════════════════════════════════════════════════════════════

    if (en.mood.length > 0) {
        const moodElements = emphasisLevels.filter(e =>
            en.mood.includes(e.element));

        if (moodElements.length > 0) {
            const moodEmphasis = moodElements
                .map(e => applyEmphasis(e.element.toLowerCase(), e.weight))
                .join(', ');
            sections.push(`Evoking a ${moodEmphasis} atmosphere that captivates the viewer.`);
        } else if (en.mood.length > 1) {
            const moodEmphasis = en.mood.map(m => `((${m.toLowerCase()}))`).join(', ');
            sections.push(`Evoking a ${moodEmphasis} atmosphere.`);
        }
    }

    // Add suggested moods from scene analysis
    if (sceneAnalysis.suggestedMood.length > 0) {
        sections.push(`Enhanced by a ${sceneAnalysis.suggestedMood.join(' and ')} undertone.`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 7: QUALITY ANCHORS (Modulated Based on Complexity)
    // ═══════════════════════════════════════════════════════════════════

    const qualityTokens = getModulatedQualityTokens(
        en.style,
        en.mood,
        en.photographerStyle.length > 0,
        en.filmStock.length > 0,
        !!en.era
    );

    // Add addons to quality
    if (en.addons && en.addons.length > 0) {
        qualityTokens.push(...en.addons.map(a => a.toLowerCase()));
    }

    sections.push(qualityTokens.join(', ') + '.');

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 8: ASPECT RATIO & PARAMETERS
    // ═══════════════════════════════════════════════════════════════════

    const params: string[] = [];

    if (data.aspectRatio) {
        const ratioMatch = data.aspectRatio.match(/\d+:\d+/);
        if (ratioMatch) {
            params.push(`--ar ${ratioMatch[0]}`);
        }
    }

    if (data.stylize > 0) params.push(`--stylize ${data.stylize}`);
    if (data.weirdness > 0) params.push(`--weird ${data.weirdness}`);
    if (data.chaos > 0) params.push(`--chaos ${data.chaos}`);

    if (params.length > 0) {
        sections.push(params.join(' '));
    }

    // ═══════════════════════════════════════════════════════════════════
    // SECTION 9: ENHANCED NEGATIVE PROMPT
    // ═══════════════════════════════════════════════════════════════════

    const enhancedNegative = getEnhancedNegativePrompt(data.negativePrompt, en.style);
    sections.push(`--no ${enhancedNegative}`);

    // ═══════════════════════════════════════════════════════════════════
    // FINAL ASSEMBLY
    // ═══════════════════════════════════════════════════════════════════

    return sections.join('\n\n');
}

