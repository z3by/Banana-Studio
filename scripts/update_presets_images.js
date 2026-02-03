
const fs = require('fs');
const path = require('path');

const presetsFile = path.join(__dirname, '../src/lib/presets.ts');
const lines = fs.readFileSync(presetsFile, 'utf8').split('\n');

const updates = {
    'studioPortrait': 'studioPortrait.png',
    'editorialFashion': 'editorialFashion.png',
    'goldenHour': 'goldenHour.png',
    'productShot': 'productShot.png',
    'streetPhotography': 'streetPhotography.png',
    'cyberpunkNeon': 'cyberpunkNeon.png',
    'fantasyPortrait': 'fantasyPortrait.png',
    'billionaireLuxury': 'billionaireLuxury.png',
    'instagramInfluencer': 'instagramInfluencer.png',
    'melancholicSadness': 'melancholicSadness.png',
    'blackAndWhite': 'blackAndWhite.png',
    'cinematic': 'cinematic.png',
    'naturalBeauty': 'naturalBeauty.png',
    'corporateHeadshot': 'corporateHeadshot.png',
    'weddingBridal': 'weddingBridal.png',
    'lifestyleCasual': 'lifestyleCasual.png',
    'fitnessSports': 'fitnessSports.png',
    'businessCasual': 'businessCasual.png',
    'outdoorAdventure': 'outdoorAdventure.png',
    'petWithPerson': 'petWithPerson.png',
    'maternityGlow': 'maternityGlow.png',
    'graduationDay': 'graduationDay.png',
    'familyPortrait': 'familyPortrait.png',
    'datingProfile': 'datingProfile.png',
    'authorSpeaker': 'authorSpeaker.png',
    'summerVibes': 'summerVibes.png',
    'winterPortrait': 'winterPortrait.png',
    'musicianPerformer': 'musicianPerformer.png',
    'chefCulinary': 'chefCulinary.png',
    'yogaWellness': 'yogaWellness.png',
    'libraryScholar': 'libraryScholar.png',
    'dancer': 'dancer.png',
    'beachSunset': 'beachSunset.png',
    'artistStudio': 'artistStudio.png',
    'gardenBotanical': 'gardenBotanical.png',
    'rainyDay': 'rainyDay.png',
    'motorcycleRider': 'motorcycleRider.png',
    'architecturalPortrait': 'architecturalPortrait.png',
    'cafeBarista': 'cafeBarista.png',
    'forestNature': 'forestNature.png',
    'vintageFilm': 'vintageFilm.png',
    'vaporwave': 'vaporwave.png',
    'steampunkVictorian': 'steampunkVictorian.png',
    'animeManga': 'animeManga.png',
    'popArt': 'popArt.png',
    'filmNoir': 'filmNoir.png',
    'watercolorPainting': 'watercolorPainting.png',
    'neonPortrait': 'neonPortrait.png',
    'sciFiFuture': 'sciFiFuture.png',
    'artDeco': 'artDeco.png',
    'impressionist': 'impressionist.png',
    'comicBook': 'comicBook.png',
    'oilPaintingClassic': 'oilPaintingClassic.png',
    'holographicFuture': 'holographicFuture.png',
    'minimalistMonochrome': 'minimalistMonochrome.png',
    'doubleExposure': 'doubleExposure.png',
    'neonCyberpunk': 'neonCyberpunk.png',
    'abstractExpressionism': 'abstractExpressionism.png',
    'desertSunset': 'desertSunset.png',
    'retroFuturism': 'retroFuturism.png',
    'underwaterDream': 'underwaterDream.png',
    'japaneseAnime': 'japaneseAnime.png',
    'baroqueOpulence': 'baroqueOpulence.png',
    'noirDetective': 'noirDetective.png',
    'qualityEnhance': 'qualityEnhance.png',
    'lightRetouch': 'lightRetouch.png',
    'skinPerfect': 'skinPerfect.png',
    'hdrVivid': 'hdrVivid.png',
    'instagramReady': 'instagramReady.png',
    'linkedinPro': 'linkedinPro.png',
    'softDreamy': 'softDreamy.png',
    'sharpDetail': 'sharpDetail.png',
    'instantPro': 'instantPro.png',
    'hairPerfect': 'hairPerfect.png',
    'lightingFix': 'lightingFix.png',
    'outfitDetail': 'outfitDetail.png',
    'backgroundBlur': 'backgroundBlur.png',
    'colorPop': 'colorPop.png',
    'eyeEnhance': 'eyeEnhance.png',
    'symmetryFix': 'symmetryFix.png',
    'zoomReady': 'zoomReady.png',
    'twitterProfile': 'twitterProfile.png',
    'contrastBoost': 'contrastBoost.png',
    'vintageTone': 'vintageTone.png',
    'professionalHeadroom': 'professionalHeadroom.png',
    'goldenRatioComposition': 'goldenRatioComposition.png',
    'timeFreeze': 'timeFreeze.png',
    'lowKeyMoody': 'lowKeyMoody.png',
    'highKeyBright': 'highKeyBright.png',
    'streetStyleUrban': 'streetStyleUrban.png',
    'etherealSoftFocus': 'etherealSoftFocus.png',
    'colorTheory': 'colorTheory.png',
    'textureDetail': 'textureDetail.png',
    'minimalistClean': 'minimalistClean.png',
    'goldRatio': 'goldRatio.png',
    'doubleExposureArt': 'doubleExposureArt.png',
    'silhouetteBold': 'silhouetteBold.png',
    'reflectionMirror': 'reflectionMirror.png',
    'weatherAtmosphere': 'weatherAtmosphere.png',
    'supercarOwner': 'supercarOwner.png',
    'oldMoney': 'oldMoney.png',
    'yachtLife': 'yachtLife.png',
    'redCarpet': 'redCarpet.png',
    'fitnessModel': 'fitnessModel.png',
    'pureHappiness': 'pureHappiness.png',
    'heartbreak': 'heartbreak.png',
    'dramaticShadows': 'dramaticShadows.png',
    'softGlam': 'softGlam.png',
    'motionFreeze': 'motionFreeze.png',
    'wideAngleDramatic': 'wideAngleDramatic.png',
    'macroCloseup': 'macroCloseup.png',
    'warmGoldenTone': 'warmGoldenTone.png',
    'coolCinematic': 'coolCinematic.png',
    'fashionEditorial': 'fashionEditorial.png',
    'softFocusDreamy': 'softFocusDreamy.png',
    'urbanGritty': 'urbanGritty.png',
    'professionalLinkedin': 'professionalLinkedin.png',
    'blackBackdrop': 'blackBackdrop.png',
    'pastelSoftMood': 'pastelSoftMood.png',
    'mountainSummit': 'mountainSummit.png',
    'coffeeshopVibes': 'coffeeshopVibes.png',
    'winterWonderland': 'winterWonderland.png',
    'autumnLeaves': 'autumnLeaves.png',
    'lensFlareDramatic': 'lensFlareDramatic.png',
    'grainFilmic': 'grainFilmic.png',
    'glamourClassic': 'glamourClassic.png',
    'toneMatching': 'toneMatching.png',
    'libraryScholarly': 'libraryScholarly.png',
    'skylineUrbanNight': 'skylineUrbanNight.png',
    'farmRustic': 'farmRustic.png',
    'floristry': 'floristry.png',
    'desertAdventure': 'desertAdventure.png',
    'marketStreet': 'marketStreet.png',
    'parkJogging': 'parkJogging.png',
    'rooftopDining': 'rooftopDining.png',
    'boutiqueStyler': 'boutiqueStyler.png',
    'vintageRecords': 'vintageRecords.png',
    'laboratoryScience': 'laboratoryScience.png',
    'constructionWorker': 'constructionWorker.png',
    'teacherClassroom': 'teacherClassroom.png',
    'marinaYacht': 'marinaYacht.png',
    'garageMotorcycle': 'garageMotorcycle.png',
    'bakeryChef': 'bakeryChef.png',
    'hospitalMedical': 'hospitalMedical.png',
    'horseRiding': 'horseRiding.png',
    'arcadeGamer': 'arcadeGamer.png',
    'skiResort': 'skiResort.png',
    'penthouseView': 'penthouseView.png',
    'tropicalResort': 'tropicalResort.png',
    'barbershopClassic': 'barbershopClassic.png',
    'architecturalClean': 'architecturalClean.png',
    'blackAndWhiteArt': 'blackAndWhiteArt.png',
    'cyberpunkNeonCity': 'cyberpunkNeonCity.png',
    'egyptianPharaoh': 'egyptianPharaoh.png',
    'elementalFire': 'elementalFire.png',
    'fashionLookbook': 'fashionLookbook.png',
    'foodStyling': 'foodStyling.png',
    'goldHourGlow': 'goldHourGlow.png',
    'holographicDigital': 'holographicDigital.png',
    'instagramReady': 'instagramReady.png',
    'jungleExplorer': 'jungleExplorer.png',
    'lifestyleCandid': 'lifestyleCandid.png',
    'magazineEditorial': 'magazineEditorial.png',
    'medievalKnight': 'medievalKnight.png',
    'moodDramatic': 'moodDramatic.png',
    'motionAction': 'motionAction.png',
    'neonDreamscape': 'neonDreamscape.png',
    'ninjaStealthy': 'ninjaStealthy.png',
    'pirateAdventure': 'pirateAdventure.png',
    'popArtBold': 'popArtBold.png',
    'portraitCinematic': 'portraitCinematic.png',
    'portraitEnvironmental': 'portraitEnvironmental.png',
    'productFocus': 'productFocus.png',
    'reflectionMirror': 'reflectionMirror.png',
    'roboticFuture': 'roboticFuture.png',
    'samuraiWarrior': 'samuraiWarrior.png',
    'softRomantic': 'softRomantic.png',
    'samuraiWarrior': 'samuraiWarrior.png',
    'softRomantic': 'softRomantic.png',
    'spaceAstronaut': 'spaceAstronaut.png',
    'steampunkWorkshop': 'steampunkWorkshop.png',
    'studioClean': 'studioClean.png',
    'timetravelerSteampunk': 'timetravelerSteampunk.png',
    'urbanMoody': 'urbanMoody.png',
    'vintageFilmLook': 'vintageFilmLook.png',
    'wildWestOutlaw': 'wildWestOutlaw.png',
    'apocalypticSurvivor': 'apocalypticSurvivor.png',
    'alienWorldExplorer': 'alienWorldExplorer.png',
    'auroraIce': 'auroraIce.png',
    'beautyGlow': 'beautyGlow.png',
    'botanicalGreenhouse': 'botanicalGreenhouse.png',
    'highFashion': 'highFashion.png',
    'naturalLight': 'naturalLight.png',
    'portraitEnhance': 'portraitEnhance.png'
};

const newLines = [];
let currentId = null;
let skipLines = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for ID
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (idMatch) {
        currentId = idMatch[1];
    }

    // If we are about to write 'data: {', and we have an update for the current ID
    if (line.includes('data: {') && currentId && updates[currentId]) {
        // We are at the insertion point.
        // We need to check if we were previously skipping an existing images block
        // Actually, simpler logic:
        // We output the images block NOW.
        // But we need to ensure we didn't output the *old* images block already.
        // So, if we see 'images: {', we skip until '},'.

        // Let's refine the loop.
    }
}

// Second pass attempt with simpler logic:
// We process file line by line.
// If we find `id: 'target'`, we enter "target mode".
// In target mode, if we see `images: {`, we skip until `},`.
// When we reach `data: {`, we insert our new `images` block first, then the `data` line.
// We exit target mode.

const processedLines = [];
let targetId = null;
let skippingImages = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (idMatch) {
        if (updates[idMatch[1]]) {
            targetId = idMatch[1];
        } else {
            targetId = null;
        }
    }

    if (targetId) {
        if (line.trim().startsWith('images: {')) {
            skippingImages = true;
            // Don't push this line
            continue;
        }

        if (skippingImages) {
            if (line.trim().startsWith('},')) {
                skippingImages = false;
            }
            // Don't push
            continue;
        }

        if (line.trim().startsWith('data: {')) {
            // Insert new images block
            const filename = updates[targetId];
            processedLines.push(`        images: {`);
            processedLines.push(`            before: '/placeholder-preset.png',`);
            processedLines.push(`            after: '/presets/${filename}',`);
            processedLines.push(`        },`);

            // Push the data line
            processedLines.push(line);

            // Done with this target
            targetId = null;
            continue;
        }
    }

    if (!skippingImages) {
        processedLines.push(line);
    }
}

fs.writeFileSync(presetsFile, processedLines.join('\n'));
console.log('Presets updated successfully.');
