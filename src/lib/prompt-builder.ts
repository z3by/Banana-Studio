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
    aiModel: string;
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
    // This guides the LLM to behave like a specific expert.
    sections.push(`**ROLE & OBJECTIVE:**
You are an expert photographer and visual artist using Gemini 3+ (Nano Banana Pro).
Create a photorealistic image based on the following structured specifications:`);

    // 2. Subject Details
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
        sections.push(`**SUBJECT:**\n${subjectLines.join('\n')}`);
    }

    // 3. Environment & Atmosphere
    const envLines = [
        line('Background', data.background),
        line('Era', data.era),
        line('Weather', data.weather),
        line('Time of Day', data.timeOfDay),
        line('Mood', data.mood)
    ].filter(Boolean);

    if (envLines.length > 0) {
        sections.push(`**ENVIRONMENT:**\n${envLines.join('\n')}`);
    }

    // 4. Technical Specifications
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
        sections.push(`**TECHNICAL:**\n${techLines.join('\n')}`);
    }

    // 5. Style & Artistry
    const styleLines = [
        line('Art Style', data.style),
        line('Photographer Inspiration', data.photographerStyle),
        line('Color Grading', data.colorGrading),
        line('Texture', data.texture),
        line('Special Effects', data.specialEffects),
        line('Addons', data.addons)
    ].filter(Boolean);

    if (styleLines.length > 0) {
        sections.push(`**STYLE:**\n${styleLines.join('\n')}`);
    }

    // 6. Parameters (Appended as notes)
    const params: string[] = [];
    if (data.stylize > 0) params.push(`--stylize ${data.stylize}`);
    if (data.weirdness > 0) params.push(`--weirdness ${data.weirdness}`);
    if (data.chaos > 0) params.push(`--chaos ${data.chaos}`);

    if (params.length > 0) {
        sections.push(`**PARAMETERS:**\n${params.join(' ')}`);
    }

    // 7. Negative Prompt within the structure
    if (data.negativePrompt) {
        sections.push(`**NEGATIVE PROMPT (AVOID):**\n${data.negativePrompt}`);
    }

    // Join all sections with double newlines for clarity
    return sections.join('\n\n');
}
