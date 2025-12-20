export type PromptData = {
    gender: string;
    ageGroup: string;
    ethnicity: string;
    eyeColor: string;
    hairColor: string;
    hairStyle: string;
    makeup: string;
    clothing: string[];     // Multi-select
    accessories: string[];  // Multi-select
    pose: string;
    action: string;
    background: string;
    era: string;
    weather: string;
    timeOfDay: string;
    mood: string[];         // Multi-select

    camera: string;
    cameraType: string;
    lens: string;
    filmStock: string;
    composition: string;

    style: string[];              // Multi-select
    photographerStyle: string[];  // Multi-select
    lighting: string[];           // Multi-select
    lightColor: string;
    colorGrading: string;
    specialEffects: string[];     // Multi-select
    texture: string[];            // Multi-select

    aiModel: string;
    aspectRatio: string;
    negativePrompt: string;

    stylize: number;
    chaos: number;
    weirdness: number;

    addons: string[];
};

export function generatePrompt(data: PromptData): string {
    const parts = [];

    // Helper to join array or return string
    const join = (val: string | string[], sep: string = ', ') => {
        if (Array.isArray(val)) {
            return val.filter(Boolean).join(sep);
        }
        return val || '';
    };

    // 1. Subject Description
    let subjectPart = '';

    if (data.ageGroup) subjectPart += data.ageGroup + ' ';
    if (data.ethnicity) subjectPart += data.ethnicity + ' ';
    if (data.gender) subjectPart += data.gender;

    const attributes = [];
    if (data.eyeColor) attributes.push(data.eyeColor + ' eyes');

    if (data.hairColor || data.hairStyle) {
        let hair = '';
        if (data.hairStyle) hair += data.hairStyle + ' ';
        if (data.hairColor) hair += data.hairColor + ' ';
        hair += 'hair';
        attributes.push(hair.trim());
    }

    if (data.makeup) {
        attributes.push('wearing ' + data.makeup + ' makeup');
    }

    if (attributes.length > 0) {
        subjectPart += ' with ' + attributes.join(', ');
    }

    const clothingStr = join(data.clothing, ' and '); // e.g. "wearing Suit and Tie"
    if (clothingStr) {
        subjectPart += ', wearing ' + clothingStr;
    }

    const accessoriesStr = join(data.accessories, ', ');
    if (accessoriesStr) {
        subjectPart += ', wearing ' + accessoriesStr;
    }

    if (data.pose) {
        subjectPart += ', ' + data.pose;
    }

    if (data.action) {
        subjectPart += ', ' + data.action;
    }

    if (subjectPart.trim()) {
        parts.push(subjectPart.trim());
    }

    // 2. Environment & Era (Atmosphere)
    let envPart = '';
    if (data.background) {
        envPart += data.background;
    }

    if (data.era) {
        envPart += envPart ? `, set in ${data.era}` : `set in ${data.era}`;
    }

    if (data.weather) {
        envPart += envPart ? `, ${data.weather}` : data.weather;
    }

    if (data.timeOfDay) {
        envPart += envPart ? `, at ${data.timeOfDay}` : `at ${data.timeOfDay}`;
    }

    const moodStr = join(data.mood, ', ');
    if (moodStr) {
        envPart += envPart ? `, ${moodStr} atmosphere` : `${moodStr} atmosphere`;
    }

    if (envPart) {
        parts.push(envPart);
    }

    // 3. Technical & Camera
    const cameraParts = [];
    if (data.cameraType) cameraParts.push(data.cameraType);
    if (data.camera) cameraParts.push(data.camera + ' shot');
    if (data.lens) cameraParts.push(data.lens + ' lens');
    if (data.filmStock) cameraParts.push('shot on ' + data.filmStock);
    if (data.composition) cameraParts.push(data.composition);

    if (cameraParts.length > 0) {
        parts.push(cameraParts.join(', '));
    }

    // 4. Style & Artistic
    const styleParts = [];
    const styleStr = join(data.style, ', ');
    if (styleStr) styleParts.push(styleStr + ' style');

    const photoStyleStr = join(data.photographerStyle, ', ');
    if (photoStyleStr) styleParts.push('in the style of ' + photoStyleStr);

    if (data.colorGrading) styleParts.push(data.colorGrading + ' color grading');

    const fxStr = join(data.specialEffects, ', ');
    if (fxStr) styleParts.push(fxStr);

    const textureStr = join(data.texture, ', ');
    if (textureStr) styleParts.push(textureStr + ' texture');

    if (styleParts.length > 0) {
        parts.push(styleParts.join(', '));
    }

    // 5. Lighting
    let lightPart = '';
    const lightingStr = join(data.lighting, ' + '); // e.g. "Neon + Studio lighting"
    if (lightingStr) {
        lightPart += lightingStr + ' lighting';
    }
    if (data.lightColor) {
        lightPart += lightPart ? ` with ${data.lightColor} tones` : `${data.lightColor} lighting tones`;
    }
    if (lightPart) {
        parts.push(lightPart);
    }

    // 6. Addons
    if (data.addons && data.addons.length > 0) {
        parts.push(...data.addons);
    }

    let fullPrompt = parts.join(', ');

    // Aspect Ratio & Model Params
    if (data.aspectRatio) {
        fullPrompt += ` --ar ${data.aspectRatio}`;
    }

    if (data.stylize > 0) fullPrompt += ` --s ${data.stylize}`;
    if (data.chaos > 0) fullPrompt += ` --c ${data.chaos}`;
    if (data.weirdness > 0) fullPrompt += ` --w ${data.weirdness}`;

    if (data.aiModel) {
        if (data.aiModel.startsWith('--')) {
            fullPrompt += ` ${data.aiModel}`;
        }
    }

    // Negative Prompt
    if (data.negativePrompt) {
        fullPrompt += ` --no ${data.negativePrompt}`;
    }

    return fullPrompt;
}
