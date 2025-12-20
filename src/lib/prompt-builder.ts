export type PromptData = {
    gender: string;
    ageGroup: string;
    hairColor: string;
    hairStyle: string;
    clothing: string;
    accessories: string;
    action: string;
    background: string;
    weather: string;
    timeOfDay: string;
    camera: string;
    cameraType: string;
    lens: string;
    filmStock: string;
    style: string;
    photographerStyle: string;
    lighting: string;
    colorGrading: string;
    addons: string[];
};

export function generatePrompt(data: PromptData): string {
    const parts = [];

    // 1. Subject Description
    let subjectPart = '';

    if (data.ageGroup) subjectPart += data.ageGroup + ' ';
    if (data.gender) subjectPart += data.gender;

    if (data.hairColor || data.hairStyle) {
        subjectPart += ' with';
        if (data.hairStyle) subjectPart += ' ' + data.hairStyle;
        if (data.hairColor) subjectPart += ' ' + data.hairColor + ' hair';
    }

    if (data.clothing) {
        subjectPart += ' wearing ' + data.clothing;
    }

    if (data.accessories) {
        subjectPart += ' wearing ' + data.accessories;
    }

    if (data.action) {
        subjectPart += ', ' + data.action;
    }

    if (subjectPart.trim()) {
        parts.push(subjectPart.trim());
    }

    // 2. Environment & Atmosphere
    let envPart = '';
    if (data.background) {
        envPart += data.background;
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
    if (data.lighting) {
        parts.push(`${data.lighting} lighting`);
    }

    // 6. Addons (Quality boosters & extras)
    if (data.addons && data.addons.length > 0) {
        parts.push(...data.addons);
    }

    return parts.join(', ');
}
