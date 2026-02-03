
const fs = require('fs');
const path = require('path');

// Extract preset IDs from presets.ts
const presetsPath = path.join(__dirname, '../src/lib/presets.ts');
const presetsContent = fs.readFileSync(presetsPath, 'utf8');
const idRegex = /id:\s*'([^']+)'/g;
let match;
const presetIds = [];

while ((match = idRegex.exec(presetsContent)) !== null) {
    presetIds.push(match[1]);
}

// Get existing images
const imagesPath = path.join(__dirname, '../public/presets');
const existingImages = fs.readdirSync(imagesPath);

const missingPresets = [];
const foundPresets = [];

presetIds.forEach(id => {
    // Check for obvious matches (id.png) or if it's referenced in the updates map in my head, 
    // but better to just check if `id.png` exists since that's my naming convention.
    // Also check if the file content actually references an image for this ID if I was being super thorough, 
    // but checking for file existence of `id.png` is a good first step given how I've been working.

    // Actually, let's check what the file *says* the image path is? 
    // The previous script `update_presets_images.js` was doing mappings. 
    // But `src/lib/presets.ts` has the actual source of truth for what image files are currently *configured*.

    // Let's refine: I want to find presets where the image file *does not exist* OR 
    // presets that don't have an image property set.

    // For now, let's stick to the user request: "missing images for presets".
    // I will check if `public/presets/${id}.png` exists.

    const possibleFilenames = [
        `${id}.png`,
        `${id}.jpg`,
        `${id}.jpeg`,
        // Start checking strictly for what I generated
    ];

    const found = existingImages.some(img => img === `${id}.png`);

    if (!found) {
        missingPresets.push(id);
    } else {
        foundPresets.push(id);
    }
});

console.log(`Total Presets: ${presetIds.length}`);
console.log(`Found Images: ${foundPresets.length}`);
console.log(`Missing Images: ${missingPresets.length}`);

if (missingPresets.length > 0) {
    console.log('--- Missing Images for IDs ---');
    missingPresets.forEach(id => console.log(id));
} else {
    console.log('All presets have corresponding images!');
}
