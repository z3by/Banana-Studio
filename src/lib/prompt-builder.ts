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

// --- Prompt Generation Logic ---
export function generatePrompt(data: PromptData): string {
    // Sections array to hold non-empty parts
    const sections: string[] = [];

    // Helper to format a line if value exists
    const line = (key: string, value: string | string[]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        const valStr = Array.isArray(value) ? value.filter(Boolean).join(', ') : value;
        if (!valStr) return null;
        return `- ${key}: ${valStr}`;
    };

    // 1. Role / Instruction (System Prompt Injection)
    // Highly detailed instruction to set the quality bar.
    sections.push(`ROLE & OBJECTIVE:
You are an expert photographer and digital artist using Gemini 3+ (Nano Banana Pro).
Your goal is to create a breathtaking, photorealistic image with cinematic lighting and incredible detail.
SAFETY: Subject must be depicted as 18+ years old.
Adhere strictly to the structured specifications below. If a detail is missing, infer a high-quality default that fits the [Environment] and [Mood].`);

    // 2. Natural Language Summary (Anchor)
    // Creates a sentence like: "A portrait of a [Age] [Ethnicity] [Gender] in [Background]."
    const summaryParts = [
        'A',
        data.mood.length > 0 ? data.mood[0] : 'stunning',
        'image of a',
        data.ageGroup,
        data.ethnicity,
        data.gender,
        data.background ? `in ${data.background}` : '',
        data.action.length > 0 ? `performing ${data.action.join(' and ')}` : ''
    ].filter(Boolean).join(' ');

    sections.push(`SUMMARY:\n${summaryParts}.`);

    // 3. Subject Details
    const subjectLines = [
        line('Gender', data.gender),
        line('Age Group', data.ageGroup),
        line('Ethnicity', data.ethnicity),
        line('Hair Style', data.hairStyle),
        line('Hair Color', data.hairColor),
        line('Eye Color', data.eyeColor),
        line('Makeup', data.makeup),
        line('Clothing', data.clothing),
        line('Accessories', data.accessories),
        line('Pose', data.pose),
        line('Action', data.action)
    ].filter(Boolean);

    if (subjectLines.length > 0) {
        sections.push(`SUBJECT SPECS:\n${subjectLines.join('\n')}`);
    }

    // 4. Environment & Atmosphere
    const envLines = [
        line('Background', data.background),
        line('Era', data.era),
        line('Weather', data.weather),
        line('Time of Day', data.timeOfDay),
        line('Mood', data.mood)
    ].filter(Boolean);

    if (envLines.length > 0) {
        sections.push(`ENVIRONMENT & ATMOSPHERE:\n${envLines.join('\n')}`);
    }

    // 5. Technical Specifications
    const techLines = [
        line('Camera Type', data.cameraType),
        line('Camera Model', data.camera),
        line('Lens', data.lens),
        line('Film Stock', data.filmStock),
        line('Composition', data.composition),
        line('Aspect Ratio', data.aspectRatio),
        line('Lighting', data.lighting),
        line('Light Color', data.lightColor)
    ].filter(Boolean);

    if (techLines.length > 0) {
        sections.push(`TECHNICAL CONFIG:\n${techLines.join('\n')}`);
    }

    // 6. Style & Artistry
    const styleLines = [
        line('Art Style', data.style),
        line('Photographer Inspiration', data.photographerStyle),
        line('Color Grading', data.colorGrading),
        line('Texture', data.texture),
        line('Special Effects', data.specialEffects),
        line('Addons', data.addons)
    ].filter(Boolean);

    if (styleLines.length > 0) {
        sections.push(`STYLE & AESTHETICS:\n${styleLines.join('\n')}`);
    }

    // 7. Quality Assurance (Implicit)
    const qualityKeywords = [
        'Masterpiece', 'Best Quality', 'High Resolution', '8k', 'HDR', 'Sharp Focus',
        'Intricate Details', 'Professional Photography', 'Cinematic'
    ];
    // Filter out any that might already be in addons to avoid dupes? 
    // For now, simpler to just append a Quality block.
    sections.push(`QUALITY ASSURANCE:\n- Quality Tags: ${qualityKeywords.join(', ')}`);

    // 8. Parameters
    const params: string[] = [];
    if (data.stylize > 0) params.push(`--stylize ${data.stylize}`);
    if (data.weirdness > 0) params.push(`--weirdness ${data.weirdness}`);
    if (data.chaos > 0) params.push(`--chaos ${data.chaos}`);

    if (params.length > 0) {
        sections.push(`PARAMETERS:\n${params.join(' ')}`);
    }

    // 9. Negative Prompt
    if (data.negativePrompt) {
        sections.push(`NEGATIVE PROMPT (AVOID):\n${data.negativePrompt}`);
    }

    // Join all sections with double newlines
    return sections.join('\n\n');
}
