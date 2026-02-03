'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from './LanguageContext';
import { generatePrompt, PromptData } from '@/lib/prompt-builder';
import { Preset } from '@/lib/presets';
import {
    RefreshCw,
    Wand2,
    User,
    Palette,
    Lightbulb,
    Shirt,
    Meh,
    Scissors,
    Camera,
    Image as ImageIcon,
    Glasses,
    CloudSun,
    Clock,
    Film,
    Aperture,
    Eye,
    Settings,
    MonitorPlay,
    CheckCircle2,
    Circle,
    Smile,
    Globe,
    Camera as CameraIcon,
    Hourglass,
    Maximize,
    Ban,
    Sparkles,
    Layout,
    Gauge,
    Sliders,
    Focus,

    Check,
    ChevronRight,
    ChevronLeft,
    Dices,
    History,
    Trash2,
    Info,

    Download,
    Share2,
    RotateCcw,

} from 'lucide-react';

// --- Constants ---
const TOAST_DURATION = 2000; // milliseconds
const MAX_HISTORY_ITEMS = 10;
const MAX_RECENT_PRESETS = 10;

import { useOutsideClick } from '@/hooks/use-outside-click';
import { MultiSelectField } from './ui/MultiSelectField';
import { SelectField } from './ui/SelectField';
import { PresetSelector } from './PresetSelector';
import { SliderField } from './ui/SliderField';
import { WizardGuide } from './WizardGuide';

// --- Icons ---
const IconCopy = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);



import { translations } from '@/i18n/translations';

export function PromptForm() {
    const { t, language } = useLanguage();
    const isRTL = language === 'ar';

    const defaultAddonKeys = ['highlyDetailed', 'resolution8k', 'masterpiece', 'professional', 'photorealistic', 'sharpFocus'];
    const getDefaultAddons = () => defaultAddonKeys.map(key => {
        // Return English values for addons
        return translations.en.addons[key as keyof typeof translations.en.addons];
    });

    // Helper to generate options: Key = English Value, Value = Localized Label
    const getOptions = (section: string, field: string) => {
        // Access English options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enOptions = (translations.en as any)[section]?.[field] || {};
        // Access Localized options
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const localOptions = (translations[language] as any)[section]?.[field] || {};

        // Build object: { "English Value": "Localized Label" }
        // We iterate over the KEYS of the options object (e.g. 'woman', 'man')
        return Object.keys(enOptions).reduce((acc, key) => {
            const enVal = enOptions[key];
            const localVal = localOptions[key];
            // Fallback to English value if translation is missing
            acc[enVal] = localVal;
            return acc;
        }, {} as Record<string, string>);
    };

    // Helper for 'styles' and 'lighting' which are top-level or different structure
    const getFlatOptions = (field: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enOptions = (translations.en as any)[field] || {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const localOptions = (translations[language] as any)[field] || {};
        return Object.keys(enOptions).reduce((acc, key) => {
            const enVal = enOptions[key];
            const localVal = localOptions[key];
            // Fallback to English value if translation is missing
            acc[enVal] = localVal;
            return acc;
        }, {} as Record<string, string>);
    };

    // Initial Data
    const initialData: PromptData = {
        gender: '', ageGroup: '', ethnicity: '', eyeColor: '', hairColor: '',
        hairStyle: [], // Multi-Select
        makeup: [], // Multi-Select
        clothing: [], accessories: [],
        pose: [], action: [], // Multi-Select
        background: '', era: '',
        weather: [], // Multi-Select
        timeOfDay: '', mood: [],
        camera: '', cameraType: '',
        lens: [], filmStock: [], // Multi-Select
        composition: [], // Multi-Select
        style: [], photographerStyle: [], lighting: [], lightColor: '', colorGrading: '', specialEffects: [], texture: [],
        aspectRatio: '', negativePrompt: '',
        stylize: 0, chaos: 0, weirdness: 0,
        addons: [],
    };

    const [data, setData] = useState<PromptData>({ ...initialData, addons: [] });
    const [generated, setGenerated] = useState('');
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showToast, setShowToast] = useState<string | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [history, setHistory] = useState<{ prompt: string, timestamp: number }[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('prompt_history_v2');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    // Failed to parse history, return empty array
                }
            }
        }
        return [];
    });
    const [showHistory, setShowHistory] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [favoritePresets, setFavoritePresets] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('favoritePresets');
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [recentPresets, setRecentPresets] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('recentPresets');
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const historyRef = useOutsideClick(() => setShowHistory(false));

    // Keyboard navigation and shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+G to generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                handleGenerate();
                return;
            }

            // Ctrl+C to copy (only when not selecting text)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && generated && !window.getSelection()?.toString()) {
                e.preventDefault();
                handleCopy();
                return;
            }

            // Arrow key navigation (only when not in input)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if ((e.key === 'ArrowRight' && !isRTL) || (e.key === 'ArrowLeft' && isRTL)) {
                setCurrentStep(prev => Math.min(5, prev + 1));
            } else if ((e.key === 'ArrowLeft' && !isRTL) || (e.key === 'ArrowRight' && isRTL)) {
                setCurrentStep(prev => Math.max(1, prev - 1));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRTL, generated]);

    // Generate live preview summary - includes ALL fields
    const getPreviewSummary = (): string => {
        const parts: string[] = [];

        // Step 1: Subject
        const subject = [data.ageGroup, data.ethnicity, data.gender].filter(Boolean).join(' ');
        if (subject) parts.push(subject);

        // Physical features
        if (data.eyeColor) parts.push(`${data.eyeColor} eyes`);
        if (data.hairColor || data.hairStyle.length > 0) {
            const hair = [data.hairColor, ...data.hairStyle.slice(0, 1)].filter(Boolean).join(' ');
            if (hair) parts.push(`${hair} hair`);
        }
        if (data.makeup.length > 0) parts.push(`${data.makeup[0]} makeup`);

        // Clothing & Accessories
        if (data.clothing.length > 0) parts.push(`wearing ${data.clothing.slice(0, 2).join(', ')}`);
        if (data.accessories.length > 0) parts.push(`with ${data.accessories.slice(0, 2).join(', ')}`);

        // Action/Pose
        if (data.action.length > 0) parts.push(data.action[0]);
        if (data.pose.length > 0) parts.push(data.pose[0]);

        // Step 2: Scene
        if (data.background) parts.push(`in ${data.background}`);
        if (data.era) parts.push(`(${data.era})`);
        if (data.timeOfDay) parts.push(`at ${data.timeOfDay}`);
        if (data.weather.length > 0) parts.push(data.weather[0]);
        if (data.mood.length > 0) parts.push(`${data.mood[0]} mood`);
        if (data.lighting.length > 0) parts.push(`${data.lighting[0]} lighting`);
        if (data.lightColor) parts.push(`${data.lightColor} light`);

        // Step 3: Camera
        if (data.camera) parts.push(data.camera);
        if (data.cameraType) parts.push(`shot on ${data.cameraType}`);
        if (data.lens.length > 0) parts.push(data.lens[0]);
        if (data.filmStock.length > 0) parts.push(data.filmStock[0]);
        if (data.composition.length > 0) parts.push(data.composition[0]);
        if (data.aspectRatio) parts.push(data.aspectRatio);

        // Step 4: Style
        if (data.style.length > 0) parts.push(`${data.style[0]} style`);
        if (data.photographerStyle.length > 0) parts.push(`inspired by ${data.photographerStyle[0]}`);
        if (data.colorGrading) parts.push(`${data.colorGrading} grading`);
        if (data.specialEffects.length > 0) parts.push(data.specialEffects[0]);
        if (data.texture.length > 0) parts.push(data.texture[0]);

        // Step 5: Advanced
        if (data.addons.length > 0) parts.push(`+${data.addons.length} addons`);
        if (data.stylize > 0) parts.push(`stylize:${data.stylize}`);
        if (data.chaos > 0) parts.push(`chaos:${data.chaos}`);
        if (data.weirdness > 0) parts.push(`weird:${data.weirdness}`);
        if (data.negativePrompt) parts.push(`⛔ ${data.negativePrompt.slice(0, 30)}...`);

        if (parts.length === 0) return t.form.messages.previewPlaceholder;
        return parts.join(' • ');
    };

    // Save History
    // Save History
    const addToHistory = (prompt: string) => {
        const newEntry = { prompt, timestamp: Date.now() };
        const newHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
        setHistory(newHistory);
        try {
            localStorage.setItem('prompt_history_v2', JSON.stringify(newHistory));
        } catch {
            // Failed to save to localStorage - storage might be full or disabled
        }
    };

    const clearHistory = () => {
        setHistory([]);
        try {
            localStorage.removeItem('prompt_history_v2');
        } catch {
            // Failed to clear localStorage
        }
    };

    // Toast helper
    const showToastMessage = (message: string) => {
        setShowToast(message);
        setTimeout(() => setShowToast(null), TOAST_DURATION);
    };


    // --- Logic ---

    const handleGenerate = () => {
        setIsGenerating(true);
        // Brief delay to show loading state for UI feedback
        setTimeout(() => {
            const result = generatePrompt(data);
            setGenerated(result);
            setCopied(false);
            addToHistory(result);
            setIsGenerating(false);
            showToastMessage(t.form.messages.promptGenerated);
            // Auto-scroll to result after a brief delay
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }, 100);
    };

    const handleCopy = async () => {
        if (!generated) return;
        try {
            await navigator.clipboard.writeText(generated);
            setCopied(true);
            showToastMessage(t.form.messages.copiedToClipboard);
            setTimeout(() => setCopied(false), TOAST_DURATION);
        } catch {
            showToastMessage(t.form.messages.failedToCopy);
        }
    };

    const handleReset = () => {
        if (window.confirm(t.form.messages.confirmClear)) {
            setData({ ...initialData, addons: getDefaultAddons() });
            setGenerated('');
            setCurrentStep(1);
        }
    };

    // Download prompt as .txt file
    const handleDownload = () => {
        if (!generated) return;
        const blob = new Blob([generated], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `banana-studio-prompt-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToastMessage(t.form.downloaded);
    };

    // Share prompt via URL
    const handleShare = async () => {
        if (!generated) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}?prompt=${encodeURIComponent(generated)}`;

        // Try Web Share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t.form.shareTitle,
                    text: generated,
                    url: shareUrl
                });
                return;
            } catch {
                // User cancelled or share failed, fall back to clipboard
            }
        }

        // Fall back to copying link
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToastMessage(t.form.shareCopied);
        } catch {
            showToastMessage(t.form.messages.failedToShare);
        }
    };

    // Reset only current step fields
    const handleResetStep = () => {
        setData(prev => {
            const updated = { ...prev };
            switch (currentStep) {
                case 1:
                    updated.gender = '';
                    updated.ageGroup = '';
                    updated.ethnicity = '';
                    updated.eyeColor = '';
                    updated.hairColor = '';
                    updated.hairStyle = [];
                    updated.makeup = [];
                    updated.pose = [];
                    updated.clothing = [];
                    updated.accessories = [];
                    updated.action = [];
                    break;
                case 2:
                    updated.background = '';
                    updated.era = '';
                    updated.weather = [];
                    updated.timeOfDay = '';
                    updated.lighting = [];
                    updated.lightColor = '';
                    updated.mood = [];
                    break;
                case 3:
                    updated.cameraType = '';
                    updated.camera = '';
                    updated.lens = [];
                    updated.filmStock = [];
                    updated.composition = [];
                    updated.aspectRatio = '';
                    break;
                case 4:
                    updated.style = [];
                    updated.photographerStyle = [];
                    updated.colorGrading = '';
                    updated.specialEffects = [];
                    updated.texture = [];
                    break;
                case 5:
                    updated.stylize = 0;
                    updated.chaos = 0;
                    updated.weirdness = 0;
                    updated.addons = [];
                    updated.negativePrompt = '';
                    break;
            }
            return updated;
        });
        showToastMessage(t.form.messages.stepReset);
    };

    // Apply a preset to the current form data (resets everything first)
    const applyPreset = (preset: Preset) => {
        // Start from a clean slate
        const updated = { ...initialData } as Record<string, unknown>;
        // Apply preset data on top of initial data
        Object.entries(preset.data).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
                updated[key] = value;
            }
        });

        const finalData = updated as unknown as PromptData;
        setData(finalData);

        // Auto-generate prompt
        const result = generatePrompt(finalData);
        setGenerated(result);
        setCopied(true);
        addToHistory(result);

        // Auto-copy to clipboard
        navigator.clipboard.writeText(result).catch(() => {
            // Don't show error message here as preset was already applied successfully
        });

        // Track recent preset usage
        const newRecent = [preset.id, ...recentPresets.filter(id => id !== preset.id)].slice(0, MAX_RECENT_PRESETS);
        setRecentPresets(newRecent);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('recentPresets', JSON.stringify(newRecent));
            } catch {
                // Failed to save to localStorage
            }
        }

        // Get preset translation
        const presetTranslation = t.form.presets[preset.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
        const presetName = presetTranslation?.name || preset.id;

        // Show unified toast message
        showToastMessage(`${preset.icon} ${presetName} ${t.form.presets.applied} 📋 ${t.form.copied}`);

        // Auto-scroll to result after a brief delay
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // Reset copied state
        setTimeout(() => setCopied(false), TOAST_DURATION);
    };

    // Toggle favorite preset
    const toggleFavorite = (presetId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent applying preset when clicking favorite icon
        const newFavorites = favoritePresets.includes(presetId)
            ? favoritePresets.filter(id => id !== presetId)
            : [...favoritePresets, presetId];
        setFavoritePresets(newFavorites);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('favoritePresets', JSON.stringify(newFavorites));
            } catch {
                // Failed to save to localStorage
            }
        }
    };


    const handleRandomize = () => {
        // Use English translations for randomization source
        const enT = translations.en;

        // Helper to pick random from object values
        const pick = (obj: Record<string, string>) => {
            const values = Object.values(obj);
            return values[Math.floor(Math.random() * values.length)];
        };

        // Helper to pick multiple random items (1 to 3 items)
        const pickMulti = (obj: Record<string, string>) => {
            const values = Object.values(obj);
            const count = Math.floor(Math.random() * 3) + 1; // 1-3 items
            const shuffled = values.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        const newData: PromptData = { ...data };

        // Subject
        // Subject
        newData.gender = pick(enT.options.gender);
        newData.ageGroup = pick(enT.options.ageGroup);
        newData.ethnicity = pick(enT.options.ethnicity);
        newData.eyeColor = Math.random() > 0.5 ? pick(enT.options.eyeColor) : '';
        newData.hairColor = Math.random() > 0.5 ? pick(enT.options.hairColor) : '';
        newData.hairStyle = Math.random() > 0.5 ? pickMulti(enT.options.hairStyle) : []; // Multi
        newData.makeup = Math.random() > 0.7 ? pickMulti(enT.options.makeup) : []; // Multi
        newData.pose = Math.random() > 0.3 ? pickMulti(enT.options.pose) : []; // Multi
        newData.action = Math.random() > 0.5 ? pickMulti(enT.options.action) : []; // Multi
        newData.clothing = Math.random() > 0.2 ? pickMulti(enT.options.clothing) : [];
        newData.accessories = Math.random() > 0.5 ? pickMulti(enT.options.accessories) : [];

        // Scene
        newData.background = pick(enT.options.background);
        newData.era = Math.random() > 0.5 ? pick(enT.options.era) : '';
        newData.weather = Math.random() > 0.5 ? pickMulti(enT.options.weather) : []; // Multi
        newData.timeOfDay = Math.random() > 0.3 ? pick(enT.options.timeOfDay) : '';
        newData.mood = Math.random() > 0.3 ? pickMulti(enT.options.mood) : [];

        // Camera
        newData.cameraType = Math.random() > 0.5 ? pick(enT.options.cameraType) : '';
        newData.camera = Math.random() > 0.5 ? pick(enT.options.camera) : '';
        newData.lens = Math.random() > 0.5 ? pickMulti(enT.options.lens) : []; // Multi
        newData.filmStock = Math.random() > 0.6 ? pickMulti(enT.options.filmStock) : []; // Multi
        newData.composition = Math.random() > 0.6 ? pickMulti(enT.options.composition) : []; // Multi
        newData.aspectRatio = Math.random() > 0.3 ? pick(enT.options.aspectRatio) : '';

        // Style
        newData.style = Math.random() > 0.2 ? [pick(enT.styles)] : [];
        newData.photographerStyle = Math.random() > 0.7 ? [pick(enT.options.photographerStyle)] : [];
        newData.lighting = Math.random() > 0.4 ? pickMulti(enT.lighting) : [];
        newData.lightColor = Math.random() > 0.6 ? pick(enT.options.lightColor) : '';
        newData.colorGrading = Math.random() > 0.6 ? pick(enT.options.colorGrading) : '';
        newData.specialEffects = Math.random() > 0.8 ? pickMulti(enT.options.specialEffects) : [];
        newData.texture = Math.random() > 0.8 ? pickMulti(enT.options.texture) : [];


        // Advanced
        newData.stylize = Math.random() > 0.5 ? Math.floor(Math.random() * 500) : 0;
        newData.chaos = Math.random() > 0.8 ? Math.floor(Math.random() * 50) : 0;
        newData.weirdness = Math.random() > 0.9 ? Math.floor(Math.random() * 1000) : 0;

        // Addons - Randomize
        const allAddons = Object.values(enT.addons); // Use english values
        // Randomly pick 0 to 4 addons
        const addonCount = Math.floor(Math.random() * 5);
        newData.addons = allAddons.sort(() => 0.5 - Math.random()).slice(0, addonCount);

        setData(newData);
    };

    const handleChange = (field: keyof PromptData, value: string | string[] | number) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleAddon = (value: string) => {
        setData(prev => {
            const current = prev.addons;
            const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
            return { ...prev, addons: updated };
        });
    };

    // --- Wizard Steps Content ---

    const steps = [
        { id: 1, title: t.form.steps.subject, desc: t.form.stepDesc.subject, icon: <User size={18} /> },
        { id: 2, title: t.form.steps.scene, desc: t.form.stepDesc.scene, icon: <CloudSun size={18} /> },
        { id: 3, title: t.form.steps.camera, desc: t.form.stepDesc.camera, icon: <Camera size={18} /> },
        { id: 4, title: t.form.steps.style, desc: t.form.stepDesc.style, icon: <Palette size={18} /> },
        { id: 5, title: t.form.steps.finalize, desc: t.form.stepDesc.finalize, icon: <Wand2 size={18} /> },
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.gender} value={data.gender} onChange={(v) => handleChange('gender', v)} options={getOptions('options', 'gender')} icon={<User size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} />
                        <SelectField label={t.form.ageGroup} value={data.ageGroup} onChange={(v) => handleChange('ageGroup', v)} options={getOptions('options', 'ageGroup')} icon={<User size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} />
                        <SelectField label={t.form.ethnicity} value={data.ethnicity} onChange={(v) => handleChange('ethnicity', v)} options={getOptions('options', 'ethnicity')} icon={<Globe size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} />
                        <SelectField label={t.form.eyeColor} value={data.eyeColor} onChange={(v) => handleChange('eyeColor', v)} options={getOptions('options', 'eyeColor')} icon={<Eye size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.hairStyle} value={data.hairStyle} onChange={(v) => handleChange('hairStyle', v)} options={getOptions('options', 'hairStyle')} icon={<Scissors size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.hairStyle} />
                        <SelectField label={t.form.hairColor} value={data.hairColor} onChange={(v) => handleChange('hairColor', v)} options={getOptions('options', 'hairColor')} icon={<Palette size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} />
                        <MultiSelectField label={t.form.makeup} value={data.makeup} onChange={(v) => handleChange('makeup', v)} options={getOptions('options', 'makeup')} icon={<Smile size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.makeup} />
                        <MultiSelectField label={t.form.pose} value={data.pose} onChange={(v) => handleChange('pose', v)} options={getOptions('options', 'pose')} icon={<User size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.pose} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MultiSelectField label={t.form.clothing} value={data.clothing} onChange={(v) => handleChange('clothing', v)} options={getOptions('options', 'clothing')} icon={<Shirt size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.clothing} />
                        <MultiSelectField label={t.form.accessories} value={data.accessories} onChange={(v) => handleChange('accessories', v)} options={getOptions('options', 'accessories')} icon={<Glasses size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.accessories} />
                        <MultiSelectField label={t.form.action} value={data.action} onChange={(v) => handleChange('action', v)} options={getOptions('options', 'action')} icon={<Meh size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.action} />
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.background} value={data.background} onChange={(v) => handleChange('background', v)} options={getOptions('options', 'background')} icon={<ImageIcon size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.background} />
                        <SelectField label={t.form.era} value={data.era} onChange={(v) => handleChange('era', v)} options={getOptions('options', 'era')} icon={<Hourglass size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.era} />
                        <MultiSelectField label={t.form.weather} value={data.weather} onChange={(v) => handleChange('weather', v)} options={getOptions('options', 'weather')} icon={<CloudSun size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.weather} />
                        <SelectField label={t.form.timeOfDay} value={data.timeOfDay} onChange={(v) => handleChange('timeOfDay', v)} options={getOptions('options', 'timeOfDay')} icon={<Clock size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.timeOfDay} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.lighting} value={data.lighting} onChange={(v) => handleChange('lighting', v)} options={getFlatOptions('lighting')} icon={<Lightbulb size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.lighting} />
                        <SelectField label={t.form.lightColor} value={data.lightColor} onChange={(v) => handleChange('lightColor', v)} options={getOptions('options', 'lightColor')} icon={<Palette size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} />
                        <MultiSelectField label={t.form.mood} value={data.mood} onChange={(v) => handleChange('mood', v)} options={getOptions('options', 'mood')} icon={<Focus size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.mood} />
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.cameraType} value={data.cameraType} onChange={(v) => handleChange('cameraType', v)} options={getOptions('options', 'cameraType')} icon={<CameraIcon size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.cameraType} />
                        <SelectField label={t.form.camera} value={data.camera} onChange={(v) => handleChange('camera', v)} options={getOptions('options', 'camera')} icon={<Aperture size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.camera} />
                        <MultiSelectField label={t.form.lens} value={data.lens} onChange={(v) => handleChange('lens', v)} options={getOptions('options', 'lens')} icon={<Eye size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.lens} />
                        <MultiSelectField label={t.form.filmStock} value={data.filmStock} onChange={(v) => handleChange('filmStock', v)} options={getOptions('options', 'filmStock')} icon={<Film size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.filmStock} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.composition} value={data.composition} onChange={(v) => handleChange('composition', v)} options={getOptions('options', 'composition')} icon={<Layout size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.composition} />
                        <SelectField label={t.form.aspectRatio} value={data.aspectRatio} onChange={(v) => handleChange('aspectRatio', v)} options={getOptions('options', 'aspectRatio')} icon={<Maximize size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.aspectRatio} />
                    </div>
                </div>
            );
            case 4: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.style} value={data.style} onChange={(v) => handleChange('style', v)} options={getFlatOptions('styles')} icon={<Palette size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.style} />
                        <MultiSelectField label={t.form.photographerStyle} value={data.photographerStyle} onChange={(v) => handleChange('photographerStyle', v)} options={getOptions('options', 'photographerStyle')} icon={<User size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.photographerStyle} />
                        <SelectField label={t.form.colorGrading} value={data.colorGrading} onChange={(v) => handleChange('colorGrading', v)} options={getOptions('options', 'colorGrading')} icon={<MonitorPlay size={14} />} placeholder={t.ui.select} searchPlaceholder={t.ui.search} manualPlaceholder={t.ui.typeAnything} useLabel={t.ui.use} description={t.form.fieldDescriptions.colorGrading} />
                        <MultiSelectField label={t.form.specialEffects} value={data.specialEffects} onChange={(v) => handleChange('specialEffects', v)} options={getOptions('options', 'specialEffects')} icon={<Sparkles size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.specialEffects} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.texture} value={data.texture} onChange={(v) => handleChange('texture', v)} options={getOptions('options', 'texture')} icon={<Gauge size={14} />} placeholder={t.ui.select} addLabel={t.ui.add} description={t.form.fieldDescriptions.texture} />
                    </div>
                </div>
            );
            case 5: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Advanced Sliders */}
                    {/* Advanced Sliders */}
                    <div className="glass-panel p-8 rounded-2xl space-y-8">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Sliders size={14} className="text-amber-500" /> {t.form.advancedParams}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <SliderField label={t.form.stylize} value={data.stylize} onChange={(v: number) => handleChange('stylize', v)} min={0} max={1000} icon={<Palette size={14} />} tooltip={t.form.tooltips.styling} />
                            <SliderField label={t.form.chaos} value={data.chaos} onChange={(v: number) => handleChange('chaos', v)} min={0} max={100} icon={<Sparkles size={14} />} tooltip={t.form.tooltips.chaos} />
                            <SliderField label={t.form.weirdness} value={data.weirdness} onChange={(v: number) => handleChange('weirdness', v)} min={0} max={3000} icon={<Gauge size={14} />} tooltip={t.form.tooltips.weirdness} />
                        </div>
                    </div>

                    {/* Addons */}
                    <div className="glass-panel p-8 rounded-2xl space-y-6">
                        <h3 className="text-xs font-bold text-green-400/80 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={14} className="text-green-400" /> {t.form.addons}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.entries(translations.en.addons).map(([k, enVal]) => {
                                const localVal = t.addons[k as keyof typeof t.addons];
                                const isChecked = data.addons.includes(enVal);
                                return (
                                    <button key={k} type="button" onClick={() => toggleAddon(enVal)} className={`rounded-xl p-4 border transition-all flex items-center gap-3 select-none w-full text-left ${isChecked ? 'bg-amber-500/10 border-amber-500/50 text-amber-100 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/5'}`}>
                                        {isChecked ? <CheckCircle2 size={18} className="text-amber-500" /> : <Circle size={18} className="text-zinc-700" />}
                                        <span className="text-sm font-medium">{localVal}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="glass-panel p-8 rounded-2xl space-y-4 border-red-500/10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-red-400/80 uppercase tracking-widest flex items-center gap-2">
                                <Ban size={14} className="text-red-500" /> {t.form.negativePrompt}
                            </h3>
                            <span className="text-[10px] text-zinc-500 font-mono tracking-widest">{data.negativePrompt.length} {t.form.charCount}</span>
                        </div>
                        <textarea
                            className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 appearance-none text-sm placeholder:text-zinc-600 resize-none transition-all"
                            rows={2}
                            placeholder={t.form.negativePlaceholder}
                            value={data.negativePrompt}
                            onChange={(e) => handleChange('negativePrompt', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
    };


    return (
        <div className="w-full mx-auto space-y-8">

            {/* Toast Notification */}
            {showToast && typeof document !== 'undefined' && createPortal(
                <div className="toast-notification fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300" role="status" aria-live="polite">
                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-500/40 px-6 py-3 rounded-2xl shadow-2xl shadow-amber-500/20 flex items-center gap-3">
                        <span className="text-sm font-medium text-white">{showToast}</span>
                    </div>
                </div>,
                document.body
            )}

            {/* ✨ Quick Start Presets - Prominent Section */}
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <PresetSelector
                    t={t}
                    recentPresets={recentPresets}
                    favoritePresets={favoritePresets}
                    onSelect={applyPreset}
                    onToggleFavorite={toggleFavorite}
                />
            </div>

            {/* Toolbar Actions Row */}
            < div className="flex flex-wrap justify-between items-center gap-3 px-2" >
                {/* Left side actions */}
                < div className="flex items-center gap-2" >
                    {/* Live Preview Toggle */}
                    < button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${showPreview
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                            }`}
                    >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Preview</span>
                    </button >
                </div >

                {/* Right side actions */}
                < div className="flex items-center gap-2" >
                    {/* History Toggle */}
                    < div className="relative" ref={historyRef} >
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-sm font-medium"
                            aria-label={t.form.actions.history}
                            aria-expanded={showHistory}
                        >
                            <History size={16} />
                            <span className="hidden sm:inline">{t.form.actions.history}</span>
                            {mounted && history.length > 0 && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{history.length}</span>}
                        </button>
                        {
                            showHistory && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-zinc-300">{t.form.history.title}</h4>
                                        {mounted && history.length > 0 && <button
                                            onClick={clearHistory}
                                            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
                                            aria-label={t.form.history.clear}
                                        ><Trash2 size={12} /> {t.form.history.clear}</button>}
                                    </div>
                                    {history.length === 0 ? (
                                        <p className="text-xs text-zinc-600 italic">{t.form.history.empty}</p>
                                    ) : (
                                        <div className="space-y-2 max-h-64 overflow-y-auto dark-scrollbar">
                                            {history.map((h, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className="text-xs bg-zinc-950 border border-zinc-800 p-3 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 transition-all group w-full text-left"
                                                    onClick={() => { setGenerated(h.prompt); setShowHistory(false); showToastMessage('📜 Prompt loaded from history'); }}
                                                >
                                                    <p className="line-clamp-2 group-hover:text-zinc-200 transition-colors">{h.prompt}</p>
                                                    <p className="text-[10px] text-zinc-600 mt-1.5 flex items-center gap-1"><Clock size={10} /> {new Date(h.timestamp).toLocaleString()}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </div >

                    <button
                        onClick={() => setIsGuideOpen(true)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all text-sm font-medium"
                        title={t.guidance.guideTitle}
                    >
                        <Info size={16} /> <span className="hidden sm:inline">{t.ui.help}</span>
                    </button>

                    <button
                        onClick={handleRandomize}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all text-sm font-medium"
                        aria-label={t.form.actions.randomize}
                    >
                        <Dices size={16} /> <span className="hidden sm:inline">{t.form.actions.randomize}</span>
                    </button>

                    <button
                        onClick={handleResetStep}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all text-sm font-medium"
                        title={t.form.actions.resetStep}
                        aria-label={t.form.actions.resetStep}
                    >
                        <RotateCcw size={16} /> <span className="hidden md:inline">{t.form.actions.resetStep}</span>
                    </button>

                    <button
                        onClick={handleReset}
                        className="text-zinc-500 hover:text-red-400 p-2.5 rounded-xl hover:bg-red-500/10 transition-all"
                        title={t.form.actions.clear}
                    >
                        <RefreshCw size={16} />
                    </button>
                </div >
            </div >

            {/* Live Preview Panel */}
            {
                showPreview && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye size={14} className="text-green-400" />
                            <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Live Preview</span>
                        </div>
                        <p className="text-sm text-zinc-300 italic leading-relaxed">{getPreviewSummary()}</p>
                    </div>
                )
            }

            {/* Main Card */}
            <div className="glass-panel rounded-xl overflow-hidden flex flex-col min-h-[600px] border border-white/5 relative">
                {/* Wizard Header (Steps) */}
                <div className="bg-[#0c0c0e]/50 border-b border-white/5 p-6 backdrop-blur-xl">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                <span className="text-amber-400">{steps[currentStep - 1].icon}</span>
                                <span>{steps[currentStep - 1].title}</span>
                            </h2>
                            <p className="text-sm text-zinc-400 mt-1">{steps[currentStep - 1].desc}</p>
                        </div>
                        <div className="text-4xl font-bold text-white/5 select-none">{currentStep}<span className="text-2xl text-white/5">/5</span></div>
                    </div>
                    {/* Minimal Step Indicators */}
                    <div className="flex items-center gap-2">
                        {steps.map((s) => {
                            const isActive = s.id === currentStep;
                            const isCompleted = s.id < currentStep;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setCurrentStep(s.id)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${isActive ? 'w-12 bg-amber-500' : isCompleted ? 'w-8 bg-zinc-600 hover:bg-zinc-500' : 'w-8 bg-zinc-800 hover:bg-zinc-700'}`}
                                    title={s.title} />
                            );
                        })}
                    </div>
                </div>

                {/* Wizard Body */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-black/20">
                    {renderStepContent()}
                </div>

                {/* Wizard Footer (Navigation) */}
                <div className="p-6 md:p-8 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-wrap gap-4 justify-between items-center">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                        className="px-6 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all font-medium flex items-center gap-2"
                    >
                        {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />} {t.form.navigation.back}
                    </button>

                    <div className="flex gap-3">
                        {/* Always show Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="btn-primary px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-black font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-amber-400 disabled:hover:to-orange-600 disabled:hover:shadow-lg disabled:hover:shadow-amber-500/20 disabled:transform-none"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="spinner w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Wand2 size={18} /> {t.form.navigation.finish}
                                </>
                            )}
                        </button>

                        {currentStep < 5 && (
                            <button
                                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold transition-all flex items-center gap-2 hover:shadow-lg"
                            >
                                {t.form.navigation.next} {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* Result Section */}
            {/* Result Section */}
            {
                generated && (
                    <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 scroll-mt-8">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-500" />
                                {t.form.resultLabel}
                            </label>
                            <span className="text-xs text-zinc-600 font-mono bg-white/5 px-2 py-0.5 rounded">
                                {generated.length} / 1000
                            </span>
                        </div>
                        <div className="glass-panel border-amber-500/20 rounded-2xl p-8 relative group shadow-[0_0_50px_-10px_rgba(251,191,36,0.1)]">
                            <p dir="ltr" className="text-sm md:text-base text-zinc-100 font-mono whitespace-pre-wrap leading-relaxed break-words pe-12 selection:bg-amber-500/30 selection:text-amber-100">
                                {generated}
                            </p>

                            {/* Action buttons - Bottom Right */}
                            <div className="flex gap-2 mt-8 justify-end border-t border-white/5 pt-4">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white text-zinc-400 transition-all text-sm font-medium"
                                >
                                    {copied ? <Check size={16} className="text-emerald-400" /> : <IconCopy className="w-4 h-4" />}
                                    {copied ? 'Copied' : t.form.copy}
                                </button>
                                <div className="w-px bg-white/10 mx-1" />
                                <button
                                    onClick={handleDownload}
                                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-all"
                                    title={t.form.actions.download}
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-all"
                                    title={t.form.actions.share}
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Floating Mobile Generate Button */}
            <button
                onClick={handleGenerate}
                className="fixed bottom-6 right-6 md:hidden z-50 bg-gradient-to-r from-amber-500 to-orange-600 text-black p-4 rounded-full shadow-2xl shadow-amber-500/30 animate-in fade-in zoom-in duration-300 ring-4 ring-black/50"
                title={t.form.navigation.finish}
            >
                <Wand2 size={24} strokeWidth={2.5} />
            </button>

            {/* Wizard Guide */}
            <WizardGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div >
    );
}
