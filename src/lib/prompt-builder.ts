export type PromptData = {
    gender: string;
    ageGroup: string;
    ethnicity: string;
    eyeColor: string;
    hairColor: string;
    hairStyle: string;
    clothing: string;
    accessories: string;
    makeup: string;
    pose: string;
    action: string;
    background: string;
    weather: string;
    timeOfDay: string;
    era: string;
    camera: string;
    cameraType: string;
    lens: string;
    filmStock: string;
    style: string;
    photographerStyle: string;
    lighting: string;
    lightColor: string;
    colorGrading: string;
    aspectRatio: string;
    negativePrompt: string;
    addons: string[];
};

export function generatePrompt(data: PromptData): string {
    const parts = [];

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

    if (data.clothing) {
        subjectPart += ', wearing ' + data.clothing;
    }

    if (data.accessories) {
        subjectPart += ', wearing ' + data.accessories;
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

    // 2. Environment & Era
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

    if (envPart) {
        parts.push(envPart);
    }

    // 3. Technical & Camera
    const cameraParts = [];
    if (data.cameraType) cameraParts.push(data.cameraType);
    if (data.camera) cameraParts.push(data.camera + ' shot');
    if (data.lens) cameraParts.push(data.lens + ' lens');
    if (data.filmStock) cameraParts.push('shot on ' + data.filmStock);

    if (cameraParts.length > 0) {
        parts.push(cameraParts.join(', '));
    }

    // 4. Style & Artistic
    const styleParts = [];
    if (data.style) styleParts.push(data.style + ' style');
    if (data.photographerStyle) styleParts.push('in the style of ' + data.photographerStyle);
    if (data.colorGrading) styleParts.push(data.colorGrading + ' color grading');

    if (styleParts.length > 0) {
        parts.push(styleParts.join(', '));
    }

    // 5. Lighting
    let lightPart = '';
    if (data.lighting) {
        lightPart += data.lighting + ' lighting';
    }
    if (data.lightColor) {
        lightPart += lightPart ? ` with ${data.lightColor} tones` : `${data.lightColor} lighting tones`;
    }
    if (lightPart) {
        parts.push(lightPart);
    }

    // 6. Aspect Ratio (often appended as parameter but we'll add as text for now or param)
    // Usually AR is a parameter --ar 16:9. Let's append it to the end if present.

    // 7. Addons
    if (data.addons && data.addons.length > 0) {
        parts.push(...data.addons);
    }

    // Combine positive prompt
    let fullPrompt = parts.join(', ');

    // Aspect Ratio (Midjourney/Niji style)
    if (data.aspectRatio) {
        fullPrompt += ` --ar ${data.aspectRatio}`;
    }

    // Negative Prompt
    if (data.negativePrompt) {
        fullPrompt += ` --no ${data.negativePrompt}`;
    }

    return fullPrompt;
}
