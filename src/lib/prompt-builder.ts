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


// --- Prompt Generation Logic ---
export function generatePrompt(data: PromptData): string {
    // Sections array to hold non-empty parts
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
        // Addons are a bit special, often English keys or values. Assuming English because check logic in PromptForm uses EN keys.
        addons: data.addons
    };

    // Helper to format a line if value exists
    const line = (key: string, value: string | string[]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        const valStr = Array.isArray(value) ? value.filter(Boolean).join(', ') : value;
        if (!valStr) return null;
        return `${key}: ${valStr}`; // Removed dash for cleaner block format
    };

    // 1. Role / Instruction (System Prompt Injection)
    // Removed to keep the prompt focused on image description for the model, unless this is for ChatGPT.
    // User requested "best way possible to help the model create best results".
    // For Midjourney/Flux/DALLE, a comma-separated list is often better than "Role: ...".
    // However, if this is for an LLM *generating* the image prompt, the previous format was fine.
    // Assuming this `generatePrompt` IS the final image prompt?
    // The previous code had "ROLE & OBJECTIVE"... which suggests this output is fed to an LLM (ChatGPT) to *write* the final Midjourney prompt.
    // "You are an expert photographer..."
    // IF the output is for an LLM, then LTR English is critical.

    sections.push(`**ROLE & OBJECTIVE**
You are an expert photographer and digital artist. Create a breathtaking, photorealistic image prompt based on the specifications below.
Ensure the final prompt includes all details, uses high-level vocabulary, and is formatted for a top-tier text-to-image model.`);

    // 2. Natural Language Summary (Anchor)
    const summaryParts = [
        'A',
        en.mood.length > 0 ? en.mood[0] : 'stunning',
        'portrait of a',
        en.ageGroup,
        en.ethnicity,
        en.gender,
        en.background ? `in ${en.background}` : '',
        en.action.length > 0 ? `performing ${en.action.join(' and ')}` : ''
    ].filter(Boolean).join(' ');

    sections.push(`**CORE CONCEPT**\n"${summaryParts}"`);

    // 3. Subject Details
    const subjectLines = [
        line('Gender', en.gender),
        line('Age', en.ageGroup),
        line('Ethnicity', en.ethnicity),
        line('Hair', [en.hairColor, ...en.hairStyle].filter(Boolean).join(', ')),
        line('Eyes', en.eyeColor),
        line('Makeup', en.makeup),
        line('Clothing', en.clothing),
        line('Accessories', en.accessories),
        line('Pose', en.pose),
        line('Action', en.action)
    ].filter(Boolean);

    if (subjectLines.length > 0) {
        sections.push(`**SUBJECT DETAILS**\n${subjectLines.join('\n')}`);
    }

    // 4. Environment
    const envLines = [
        line('Background', en.background),
        line('Era', en.era),
        line('Weather', en.weather),
        line('Time', en.timeOfDay),
        line('Mood', en.mood)
    ].filter(Boolean);

    if (envLines.length > 0) {
        sections.push(`**ENVIRONMENT**\n${envLines.join('\n')}`);
    }

    // 5. Technical
    const techLines = [
        line('Camera', [en.cameraType, en.camera].filter(Boolean).join(', ')),
        line('Lens', en.lens),
        line('Film Stock', en.filmStock),
        line('Composition', en.composition),
        line('Aspect Ratio', data.aspectRatio), // Aspect ratio usually technically formatted like "16:9"
        line('Lighting', [en.lightColor, ...en.lighting].filter(Boolean).join(', '))
    ].filter(Boolean);

    if (techLines.length > 0) {
        sections.push(`**TECHNICAL SPECS**\n${techLines.join('\n')}`);
    }

    // 6. Style
    const styleLines = [
        line('Art Style', en.style),
        line('Inspiration', en.photographerStyle),
        line('Color Grading', en.colorGrading),
        line('Texture', en.texture),
        line('Effects', en.specialEffects),
        line('Addons', en.addons)
    ].filter(Boolean);

    if (styleLines.length > 0) {
        sections.push(`**STYLE & ARTISTRY**\n${styleLines.join('\n')}`);
    }

    // 7. Quality Tags
    const qualityKeywords = [
        'Masterpiece', 'Best Quality', 'Ultra High Res', '8k', 'HDR', 'Sharp Focus',
        'Intricate Details', 'Professional Photography', 'Cinematic Lighting'
    ];
    sections.push(`**QUALITY TAGS (MUST INCLUDE)**\n${qualityKeywords.join(', ')}`);

    // 8. Parameters
    const params: string[] = [];
    if (data.stylize > 0) params.push(`--stylize ${data.stylize}`);
    if (data.weirdness > 0) params.push(`--weirdness ${data.weirdness}`);
    if (data.chaos > 0) params.push(`--chaos ${data.chaos}`);
    if (params.length > 0) {
        sections.push(`**PARAMETERS**\n${params.join(' ')}`);
    }

    // 9. Negative Prompt
    if (data.negativePrompt) {
        sections.push(`**NEGATIVE PROMPT**\n${data.negativePrompt}`);
    }

    return sections.join('\n\n');
}
