
const fs = require('fs');
const path = require('path');

const presetsFile = path.join(__dirname, '../src/lib/presets.ts');
const fileContent = fs.readFileSync(presetsFile, 'utf8');
const lines = fileContent.split('\n');

function generatePrompt(data) {
    const sectionHeader = (title) => `**${title}**`;
    const sections = [];

    // Simple identity function for translation mock
    const t = (v) => v;

    // Helper to format a line if value exists
    const line = (key, value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        const valStr = Array.isArray(value) ? value.filter(Boolean).join(', ') : value;
        if (!valStr) return null;
        return `${key}: ${valStr}`;
    };

    // 2. Natural Language Summary (Anchor)
    const summaryParts = [
        'A',
        (data.mood && data.mood[0]) || 'stunning',
        'portrait of a',
        data.ageGroup || 'person',
        data.ethnicity || '',
        data.gender || '',
        data.background ? `in ${data.background}` : '',
        (data.action && data.action.length > 0) ? `performing ${data.action.join(' and ')}` : ''
    ].filter(Boolean).join(' ');

    sections.push(`${sectionHeader('CORE CONCEPT')}\n"${summaryParts}"`);

    // 3. Subject Details
    const subjectLines = [
        line('Gender', data.gender),
        line('Age', data.ageGroup),
        line('Ethnicity', data.ethnicity),
        line('Hair', [data.hairColor, ...(data.hairStyle || [])].filter(Boolean).join(', ')),
        line('Eyes', data.eyeColor),
        line('Makeup', data.makeup),
        line('Clothing', data.clothing),
        line('Accessories', data.accessories),
        line('Pose', data.pose),
        line('Action', data.action)
    ].filter(Boolean);

    if (subjectLines.length > 0) {
        sections.push(`${sectionHeader('SUBJECT DETAILS')}\n${subjectLines.join('\n')}`);
    }

    // 4. Environment
    const envLines = [
        line('Background', data.background),
        line('Era', data.era),
        line('Weather', data.weather),
        line('Time', data.timeOfDay),
        line('Mood', data.mood)
    ].filter(Boolean);

    if (envLines.length > 0) {
        sections.push(`${sectionHeader('ENVIRONMENT')}\n${envLines.join('\n')}`);
    }

    // 5. Technical
    const techLines = [
        line('Camera', [data.cameraType, data.camera].filter(Boolean).join(', ')),
        line('Lens', data.lens),
        line('Film Stock', data.filmStock),
        line('Composition', data.composition),
        line('Lighting', [data.lightColor, ...(data.lighting || [])].filter(Boolean).join(', '))
    ].filter(Boolean);

    if (techLines.length > 0) {
        sections.push(`${sectionHeader('TECHNICAL SPECS')}\n${techLines.join('\n')}`);
    }

    // 6. Style
    const styleLines = [
        line('Art Style', data.style),
        line('Inspiration', data.photographerStyle),
        line('Color Grading', data.colorGrading),
        line('Texture', data.texture),
        line('Effects', data.specialEffects),
        line('Addons', data.addons)
    ].filter(Boolean);

    if (styleLines.length > 0) {
        sections.push(`${sectionHeader('STYLE & ARTISTRY')}\n${styleLines.join('\n')}`);
    }

    const qualityKeywords = [
        'Masterpiece', 'Best Quality', 'Ultra High Res', '8k', 'HDR', 'Sharp Focus',
        'Intricate Details', 'Professional Photography', 'Cinematic Lighting'
    ];
    sections.push(`${sectionHeader('QUALITY TAGS')}\n${qualityKeywords.join(', ')}`);

    return sections.join('\n\n');
}

// Line-by-line parser state
let currentId = null;
let inDataBlock = false;
let braceCount = 0;
let dataLines = [];

for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();

    // Find ID
    const idMatch = l.match(/id:\s*'([^']+)'/);
    if (idMatch && !inDataBlock) {
        currentId = idMatch[1];
    }

    // Start of Data Block
    if (l.includes('data: {')) {
        inDataBlock = true;
        braceCount = 1; // inner brace
        dataLines = ['{'];
        continue;
    }

    // Inside Data Block
    if (inDataBlock) {
        dataLines.push(lines[i]); // Keep original indentation for easier reading, though trimming is fine for eval usually

        // Count braces to find end
        const openBraces = (lines[i].match(/{/g) || []).length;
        const closeBraces = (lines[i].match(/}/g) || []).length;
        braceCount += openBraces - closeBraces;

        if (braceCount === 0) {
            // End of block
            inDataBlock = false;
            try {
                // Join lines and cleanup trailing comma if present on the last line (before closing brace)
                let blockStr = dataLines.join('\n');
                // Remove trailing comma after the closing brace if it exists in the capture (it might be `},`)
                blockStr = blockStr.replace(/},$/, '}').replace(/,$/, '');

                // Eval the object
                // We need to be careful about unquoted keys which are valid in JS/TS but eval might strict parse? 
                // Using Function to loosen valid JS object literal parsing
                const data = new Function(`return ${blockStr}`)();

                if (currentId && !['studioPortrait', 'editorialFashion', 'goldenHour', 'productShot', 'streetPhotography', 'cyberpunkNeon', 'fantasyPortrait', 'billionaireLuxury', 'instagramInfluencer', 'melancholicSadness'].includes(currentId)) {
                    // Defaults
                    const sampleData = { ...data };

                    // List of presets that are clearly objects or styles not needing a person
                    const objectPresets = [
                        'productShot', 'foodStyling', 'vintageRecords', 'botanicalGreenhouse',
                        'flowerCrown', // maybe person? Let's check. Actually flowerCrown implies a person wearing it.
                        'qualityEnhance', 'lightRetouch', 'skinPerfect', 'hdrVivid', 'instagramReady', 'linkedinPro',
                        'softDreamy', 'sharpDetail', 'instantPro', 'hairPerfect', 'lightingFix', 'outfitDetail',
                        'backgroundBlur', 'colorPop', 'eyeEnhance', 'symmetryFix', 'zoomReady', 'twitterProfile',
                        'contrastBoost', 'vintageTone', 'professionalHeadroom', 'goldenRatioComposition',
                        'dramaticShadows', 'softGlam', 'motionFreeze', 'wideAngleDramatic', 'macroCloseup',
                        'warmGoldenTone', 'coolCinematic', 'fashionEditorial', 'softFocusDreamy', 'urbanGritty',
                        'professionalLinkedin', 'blackBackdrop', 'pastelSoftMood', 'mountainSummit', 'coffeeshopVibes',
                        'winterWonderland', 'yogaStudio', 'autumnLeaves', 'poolsideSummer', 'lensFlareDramatic',
                        'grainFilmic', 'glamourClassic', 'toneMatching', 'libraryScholarly', 'skylineUrbanNight',
                        'farmRustic', 'floristry', 'desertAdventure', 'marketStreet', 'rooftopDining', 'boutiqueStyler',
                        'laboratoryScience', 'concertStage', 'vineyardWinery', 'skiResort', 'penthouseView',
                        'tropicalResort', 'barbershopClassic', 'steampunkWorkshop', 'holographicDigital',
                        'neonDreamscape', 'crystalMagic', 'elementalFire', 'bioluminescentForest', 'auroraIce',
                        'goldHourGlow', 'portraitEnhance', 'moodDramatic', 'softRomantic', 'urbanMoody',
                        'highFashion', 'vintageFilmLook', 'studioClean', 'naturalLight', 'motionAction',
                        'beautyGlow', 'productFocus', 'portraitCinematic', 'architecturalClean', 'magazineEditorial',
                        'blackAndWhiteArt', 'portraitEnvironmental', 'fashionLookbook', 'lifestyleCandid',
                        'timeFreeze', 'lowKeyMoody', 'highKeyBright', 'streetStyleUrban', 'etherealSoftFocus',
                        'colorTheory', 'textureDetail', 'minimalistClean', 'goldRatio', 'doubleExposureArt',
                        'silhouetteBold', 'reflectionMirror', 'weatherAtmosphere', 'oldMoney', 'yachtLife',
                        'redCarpet', 'fitnessModel', 'pureHappiness', 'euphoricDream', 'romanticDate', 'heartbreak'
                    ];

                    const isPerson = !objectPresets.includes(currentId) &&
                        !['mountainSummit', 'winterWonderland', 'autumnLeaves', 'skylineUrbanNight', 'marinaYacht', 'tropicalResort', 'botanicalGreenhouse', 'neonDreamscape', 'bioluminescentForest', 'auroraIce', 'jungleExplorer', 'alienWorldExplorer', 'architecturalClean', 'foodStyling', 'textureDetail', 'reflectionMirror', 'weatherAtmosphere'].includes(currentId);

                    // For the sake of "One guy for all images", we will apply it to almost everything that ISN'T clearly an object/scene.
                    // Even "yachtLife" or "oldMoney" which are in objectPresets for safety above, actually imply a lifestyle, so maybe should have a person.
                    // The user said: "no images of girls, only one guy for all images". 
                    // Let's err on the side of adding the guy unless it's strictly a "Product Focus" or "Landscape".

                    const strictlyNonHuman = [
                        'productShot', 'foodStyling', 'vintageRecords', 'botanicalGreenhouse',
                        'autumnLeaves', 'skylineUrbanNight', 'mountainSummit', 'winterWonderland',
                        'textureDetail', 'reflectionMirror', 'weatherAtmosphere', 'productFocus',
                        'architecturalClean', 'neonDreamscape', 'auroraIce', 'bioluminescentForest',
                        'crystalMagic' // maybe?
                    ];

                    if (!strictlyNonHuman.includes(currentId)) {
                        sampleData.gender = 'Man';
                        sampleData.ethnicity = 'Syrian';
                        sampleData.ageGroup = 'Young Adult';
                        delete sampleData.makeup;
                    } else {
                        delete sampleData.gender;
                        delete sampleData.ethnicity;
                        delete sampleData.ageGroup;
                    }

                    const prompt = generatePrompt(sampleData);
                    console.log(`PRESET_ID:${currentId}`);
                    console.log(`PROMPT_Start`);
                    console.log(prompt);
                    console.log(`PROMPT_End`);
                    console.log('---');
                }
            } catch (e) {
                console.error(`Failed to parse/eval data for ${currentId}:`, e.message);
                // console.log('Block was:', dataLines.join('\n'));
            }
            currentId = null;
        }
    }
}
