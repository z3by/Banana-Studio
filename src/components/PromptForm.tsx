'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { generatePrompt, PromptData } from '@/lib/prompt-builder';
import {
    Clipboard,
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
    Cpu,
    Layout,
    Gauge,
    Sliders,
    Focus,
    ChevronsUpDown,
    Check,
    ChevronRight,
    ChevronLeft,
    Dices,
    History,
    Trash2,
    Info,
    PenLine,
    Keyboard,
    List
} from 'lucide-react';

// --- Icons ---
const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);

const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) callback();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback]);
    return ref;
};

// --- Standalone Components ---

const MultiSelectField = ({ label, value, onChange, options, icon, placeholder = "Select..." }: { label: string, value: string[], onChange: (val: string[]) => void, options: Record<string, string>, icon: any, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const ref = useOutsideClick(() => setIsOpen(false));
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleValue = (val: string) => {
        const updated = value.includes(val) ? value.filter(i => i !== val) : [...value, val];
        onChange(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue("");
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    // Find label for a given english value
    const getLabel = (val: string) => {
        // If val is in options values (it's English), return the label. 
        // But wait, the options passed here are { key: "Localized Value" }. 
        // Actually, I am changing how options are passed. I will pass { [EnglishValue]: "Localized Label" }.
        return options[val] || val;
    };

    return (
        <div className="space-y-2" ref={ref}>
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                {icon} {label}
            </label>
            <div className="relative">
                <div
                    onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
                    className={`w-full bg-zinc-950 border rounded-xl p-2 min-h-[46px] flex flex-wrap gap-1.5 cursor-text text-sm transition-all ${isOpen ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                    {value.map((val) => (
                        <span key={val} className="bg-zinc-800/80 text-zinc-200 px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 border border-zinc-700/50 animate-in fade-in zoom-in-95 duration-200">
                            {getLabel(val)}
                            <button className="hover:text-red-400 ml-1 rounded-full p-0.5 hover:bg-zinc-700" onClick={(e) => { e.stopPropagation(); toggleValue(val); }}>×</button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="bg-transparent outline-none flex-1 min-w-[60px] text-zinc-200 placeholder:text-zinc-600 h-6"
                        placeholder={value.length === 0 ? placeholder : ""}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                    />
                    <div className="ml-auto self-center text-zinc-500 text-xs flex items-center gap-1">
                        {isOpen && inputValue.length > 0 && <span className="text-[10px] bg-zinc-800 px-1 rounded hidden md:inline">Press Enter</span>}
                        <ChevronsUpDown size={14} className="opacity-50" />
                    </div>
                </div>
                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100 dark-scrollbar">
                        {Object.entries(options).map(([k, v]: any) => {
                            if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                            const isSelected = value.includes(k);
                            return (
                                <div key={k} onClick={() => { toggleValue(k); setInputValue(""); }} className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-yellow-500/10 text-yellow-500' : 'text-zinc-300 hover:bg-zinc-800'}`}>
                                    <span>{v}</span>
                                    {isSelected && <Check size={14} />}
                                </div>
                            );
                        })}
                        {inputValue && !Object.values(options).some((v: any) => v.toLowerCase() === inputValue.toLowerCase()) && (
                            <div onClick={() => { onChange([...value, inputValue]); setInputValue(""); }} className="px-4 py-2.5 text-sm cursor-pointer text-blue-400 hover:bg-zinc-800 flex items-center gap-2 italic border-t border-zinc-800/50">
                                <PenLine size={12} /> Add "{inputValue}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, icon, placeholder = "Select..." }: { label: string, value: string, onChange: (val: string) => void, options: Record<string, string>, icon: any, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isManual, setIsManual] = useState(false); // Toggle between list and raw input
    const ref = useOutsideClick(() => setIsOpen(false));
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial value for search input when opening list
    useEffect(() => {
        if (isOpen && !isManual) {
            setInputValue("");
            inputRef.current?.focus();
        }
    }, [isOpen, isManual]);

    const handleSelect = (key: string) => {
        onChange(key);
        setIsOpen(false);
        setInputValue("");
    };

    const getLabel = (val: string) => {
        return options[val] || val;
    };

    return (
        <div className="space-y-2 group" ref={ref}>
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                    {icon} {label}
                </label>
                <button
                    onClick={() => {
                        setIsManual(!isManual);
                        setIsOpen(false);
                    }}
                    className="text-[10px] text-zinc-600 hover:text-yellow-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={isManual ? "Switch to List" : "Switch to Manual Input"}
                >
                    {isManual ? <List size={12} /> : <Keyboard size={12} />}
                    {isManual ? "List" : "Type"}
                </button>
            </div>

            {isManual ? (
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm transition-shadow placeholder:text-zinc-600"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type anything..."
                    />
                    <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-zinc-500"><PenLine size={14} /></div>
                </div>
            ) : (
                <div className="relative">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full bg-zinc-950 border rounded-xl p-3 flex justify-between items-center cursor-pointer text-sm transition-all ${isOpen ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                        <span className={`truncate ${!value ? 'text-zinc-600' : 'text-zinc-200'}`}>
                            {value ? getLabel(value) : placeholder}
                        </span>
                        <ChevronsUpDown size={14} className="text-zinc-500 opacity-50" />
                    </div>

                    {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100 dark-scrollbar" style={{ position: 'absolute' }}>
                            <div className="p-2 sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800/50 z-10">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50"
                                    placeholder="Search..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            {Object.entries(options).map(([k, v]: any) => {
                                if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                                const isSelected = value === k;
                                return (
                                    <div key={k} onClick={() => handleSelect(k)} className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-yellow-500/10 text-yellow-500' : 'text-zinc-300 hover:bg-zinc-800'}`}>
                                        <span>{v}</span>
                                        {isSelected && <Check size={14} />}
                                    </div>
                                );
                            })}
                            {inputValue && !Object.values(options).some((v: any) => v.toLowerCase() === inputValue.toLowerCase()) && (
                                <div onClick={() => handleSelect(inputValue)} className="px-4 py-2.5 text-sm cursor-pointer text-blue-400 hover:bg-zinc-800 flex items-center gap-2 italic border-t border-zinc-800/50">
                                    <PenLine size={12} /> Use "{inputValue}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const SliderField = ({ label, value, onChange, min, max, icon, tooltip }: any) => (
    <div className="space-y-3 group">
        <label className="text-sm font-medium text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
                {icon} {label}
                {tooltip && (
                    <div className="relative group/tooltip">
                        <Info size={12} className="text-zinc-600 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 shadow-lg z-10">
                            {tooltip}
                        </div>
                    </div>
                )}
            </span>
            <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded text-xs">{value}</span>
        </label>
        <input
            type="range" min={min} max={max} value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-600"><span>{min}</span><span>{max}</span></div>
    </div>
);


import { translations } from '@/i18n/translations';

export function PromptForm() {
    const { t, language } = useLanguage();
    const isRTL = language === 'ar';

    const defaultAddonKeys = ['highlyDetailed', 'resolution8k', 'masterpiece', 'professional', 'photorealistic', 'sharpFocus'];
    const getTranslatedAddons = () => defaultAddonKeys.map(key => {
        // For addons, we still iterate keys, but we need to verify how they are stored in PromptData.
        // Currently PromptData stores the *translated* string for addons.
        // We should probably switch addons to use English values too, but let's focus on the main fields first.
        return t.addons[key as keyof typeof t.addons];
    });

    // Helper to generate options: Key = English Value, Value = Localized Label
    const getOptions = (section: string, field: string) => {
        // Access English options
        const enOptions = (translations.en as any)[section]?.[field] || {};
        // Access Localized options
        const localOptions = (translations[language] as any)[section]?.[field] || {};

        // Build object: { "English Value": "Localized Label" }
        // We iterate over the KEYS of the options object (e.g. 'woman', 'man')
        return Object.keys(enOptions).reduce((acc, key) => {
            const enVal = enOptions[key];
            const localVal = localOptions[key];
            acc[enVal] = localVal;
            return acc;
        }, {} as Record<string, string>);
    };

    // Helper for 'styles' and 'lighting' which are top-level or different structure
    const getFlatOptions = (field: string) => {
        const enOptions = (translations.en as any)[field] || {};
        const localOptions = (translations[language] as any)[field] || {};
        return Object.keys(enOptions).reduce((acc, key) => {
            const enVal = enOptions[key];
            const localVal = localOptions[key];
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
        aiModel: '', aspectRatio: '', negativePrompt: '',
        stylize: 0, chaos: 0, weirdness: 0,
        addons: [],
    };

    const [data, setData] = useState<PromptData>({ ...initialData, addons: [] });
    const [generated, setGenerated] = useState('');
    const [copied, setCopied] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Load History on Mount
    useEffect(() => {
        const saved = localStorage.getItem('prompt_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse history', e);
            }
        }
    }, []);

    // Save History
    const addToHistory = (prompt: string) => {
        const newHistory = [prompt, ...history].slice(0, 5); // Keep last 5
        setHistory(newHistory);
        localStorage.setItem('prompt_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('prompt_history');
    };


    // --- Logic ---

    const handleGenerate = () => {
        const result = generatePrompt(data);
        setGenerated(result);
        setCopied(false);
        addToHistory(result);
    };

    const handleCopy = () => {
        if (!generated) return;
        navigator.clipboard.writeText(generated);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to clear all fields?')) {
            setData({ ...initialData, addons: getTranslatedAddons() });
            setGenerated('');
            setCurrentStep(1);
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
        newData.aiModel = Math.random() > 0.5 ? pick(enT.options.aiModel) : '';

        // Advanced
        newData.stylize = Math.random() > 0.5 ? Math.floor(Math.random() * 500) : 0;
        newData.chaos = Math.random() > 0.8 ? Math.floor(Math.random() * 50) : 0;
        newData.weirdness = Math.random() > 0.9 ? Math.floor(Math.random() * 1000) : 0;

        setData(newData);
    };

    const handleChange = (field: keyof PromptData, value: any) => {
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
                        <SelectField
                            label={t.form.gender}
                            value={data.gender}
                            onChange={(v) => handleChange('gender', v)}
                            options={getOptions('options', 'gender')}
                            icon={<User size={14} />}
                            placeholder={t.form.selectOption}
                        />
                        <SelectField label={t.form.ageGroup} value={data.ageGroup} onChange={(v) => handleChange('ageGroup', v)} options={getOptions('options', 'ageGroup')} icon={<User size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.ethnicity} value={data.ethnicity} onChange={(v) => handleChange('ethnicity', v)} options={getOptions('options', 'ethnicity')} icon={<Globe size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.eyeColor} value={data.eyeColor} onChange={(v) => handleChange('eyeColor', v)} options={getOptions('options', 'eyeColor')} icon={<Eye size={14} />} placeholder={t.form.selectOption} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.hairStyle} value={data.hairStyle} onChange={(v) => handleChange('hairStyle', v)} options={getOptions('options', 'hairStyle')} icon={<Scissors size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.hairColor} value={data.hairColor} onChange={(v) => handleChange('hairColor', v)} options={getOptions('options', 'hairColor')} icon={<Palette size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.makeup} value={data.makeup} onChange={(v) => handleChange('makeup', v)} options={getOptions('options', 'makeup')} icon={<Smile size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.pose} value={data.pose} onChange={(v) => handleChange('pose', v)} options={getOptions('options', 'pose')} icon={<User size={14} />} placeholder={t.form.selectOption} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MultiSelectField label={t.form.clothing} value={data.clothing} onChange={(v) => handleChange('clothing', v)} options={getOptions('options', 'clothing')} icon={<Shirt size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.accessories} value={data.accessories} onChange={(v) => handleChange('accessories', v)} options={getOptions('options', 'accessories')} icon={<Glasses size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.action} value={data.action} onChange={(v) => handleChange('action', v)} options={getOptions('options', 'action')} icon={<Meh size={14} />} placeholder={t.form.selectOption} />
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.background} value={data.background} onChange={(v) => handleChange('background', v)} options={getOptions('options', 'background')} icon={<ImageIcon size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.era} value={data.era} onChange={(v) => handleChange('era', v)} options={getOptions('options', 'era')} icon={<Hourglass size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.weather} value={data.weather} onChange={(v) => handleChange('weather', v)} options={getOptions('options', 'weather')} icon={<CloudSun size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.timeOfDay} value={data.timeOfDay} onChange={(v) => handleChange('timeOfDay', v)} options={getOptions('options', 'timeOfDay')} icon={<Clock size={14} />} placeholder={t.form.selectOption} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.lighting} value={data.lighting} onChange={(v) => handleChange('lighting', v)} options={getFlatOptions('lighting')} icon={<Lightbulb size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.lightColor} value={data.lightColor} onChange={(v) => handleChange('lightColor', v)} options={getOptions('options', 'lightColor')} icon={<Palette size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.mood} value={data.mood} onChange={(v) => handleChange('mood', v)} options={getOptions('options', 'mood')} icon={<Focus size={14} />} placeholder={t.form.selectOption} />
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.cameraType} value={data.cameraType} onChange={(v) => handleChange('cameraType', v)} options={getOptions('options', 'cameraType')} icon={<CameraIcon size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.camera} value={data.camera} onChange={(v) => handleChange('camera', v)} options={getOptions('options', 'camera')} icon={<Aperture size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.lens} value={data.lens} onChange={(v) => handleChange('lens', v)} options={getOptions('options', 'lens')} icon={<Eye size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.filmStock} value={data.filmStock} onChange={(v) => handleChange('filmStock', v)} options={getOptions('options', 'filmStock')} icon={<Film size={14} />} placeholder={t.form.selectOption} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.composition} value={data.composition} onChange={(v) => handleChange('composition', v)} options={getOptions('options', 'composition')} icon={<Layout size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.aspectRatio} value={data.aspectRatio} onChange={(v) => handleChange('aspectRatio', v)} options={getOptions('options', 'aspectRatio')} icon={<Maximize size={14} />} placeholder={t.form.selectOption} />
                    </div>
                </div>
            );
            case 4: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.style} value={data.style} onChange={(v) => handleChange('style', v)} options={getFlatOptions('styles')} icon={<Palette size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.photographerStyle} value={data.photographerStyle} onChange={(v) => handleChange('photographerStyle', v)} options={getOptions('options', 'photographerStyle')} icon={<User size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.colorGrading} value={data.colorGrading} onChange={(v) => handleChange('colorGrading', v)} options={getOptions('options', 'colorGrading')} icon={<MonitorPlay size={14} />} placeholder={t.form.selectOption} />
                        <MultiSelectField label={t.form.specialEffects} value={data.specialEffects} onChange={(v) => handleChange('specialEffects', v)} options={getOptions('options', 'specialEffects')} icon={<Sparkles size={14} />} placeholder={t.form.selectOption} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.texture} value={data.texture} onChange={(v) => handleChange('texture', v)} options={getOptions('options', 'texture')} icon={<Gauge size={14} />} placeholder={t.form.selectOption} />
                        <SelectField label={t.form.aiModel} value={data.aiModel} onChange={(v) => handleChange('aiModel', v)} options={getOptions('options', 'aiModel')} icon={<Cpu size={14} />} placeholder={t.form.selectOption} />
                    </div>
                </div>
            );
            case 5: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Advanced Sliders */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 space-y-6">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Sliders size={14} /> {t.form.advancedParams}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <SliderField label={t.form.stylize} value={data.stylize} onChange={(v: number) => handleChange('stylize', v)} min={0} max={1000} icon={<Palette size={14} />} tooltip={t.form.guidance.stylize} />
                            <SliderField label={t.form.chaos} value={data.chaos} onChange={(v: number) => handleChange('chaos', v)} min={0} max={100} icon={<Sparkles size={14} />} tooltip={t.form.guidance.chaos} />
                            <SliderField label={t.form.weirdness} value={data.weirdness} onChange={(v: number) => handleChange('weirdness', v)} min={0} max={3000} icon={<Gauge size={14} />} tooltip={t.form.guidance.weirdness} />
                        </div>
                    </div>

                    {/* Addons */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 space-y-4">
                        <h3 className="text-xs font-bold text-green-400/80 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={14} /> {t.form.addons}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Object.entries(t.addons).map(([k, v]: any) => {
                                const isChecked = data.addons.includes(v);
                                return (
                                    <div key={k} onClick={() => toggleAddon(v)} className={`cursor-pointer rounded-xl p-3 border transition-all flex items-center gap-3 select-none ${isChecked ? 'bg-zinc-800 border-yellow-500/50 text-yellow-100 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'}`}>
                                        {isChecked ? <CheckCircle2 size={18} className="text-yellow-500" /> : <Circle size={18} className="text-zinc-600" />}
                                        <span className="text-sm font-medium">{v}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 space-y-4 border-red-900/10">
                        <h3 className="text-xs font-bold text-red-500/80 uppercase tracking-widest flex items-center gap-2">
                            <Ban size={14} /> {t.form.negativePrompt}
                        </h3>
                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 appearance-none text-sm placeholder:text-zinc-700 resize-none"
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
        <div className="w-full max-w-6xl mx-auto space-y-8">

            {/* Top Toolbar */}
            <div className="flex justify-end gap-3 px-2">
                {/* History Toggle */}
                <div className="relative">
                    <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-sm">
                        <History size={16} /> {t.form.actions.history}
                    </button>
                    {showHistory && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-zinc-300">{t.form.history.title}</h4>
                                {history.length > 0 && <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"><Trash2 size={12} /> {t.form.history.clear}</button>}
                            </div>
                            {history.length === 0 ? (
                                <p className="text-xs text-zinc-600 italic">{t.form.history.empty}</p>
                            ) : (
                                <div className="space-y-2">
                                    {history.map((h, i) => (
                                        <div key={i} className="text-xs bg-zinc-950 border border-zinc-800 p-2 rounded hover:bg-zinc-800 cursor-pointer text-zinc-400 line-clamp-2"
                                            onClick={() => { setGenerated(h); setShowHistory(false); }}>
                                            {h}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button onClick={handleRandomize} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all text-sm font-medium">
                    <Dices size={16} /> {t.form.actions.randomize}
                </button>

                <button
                    onClick={handleReset}
                    className="text-zinc-500 hover:text-red-400 p-2 rounded-lg transition-all"
                    title={t.form.actions.clear}
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Main Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-sm shadow-xl overflow-hidden flex flex-col min-h-[600px]">

                {/* Wizard Header (Steps) */}
                <div className="bg-zinc-950/80 border-b border-zinc-800 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                {steps[currentStep - 1].icon} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">{steps[currentStep - 1].title}</span>
                            </h2>
                            <p className="text-sm text-zinc-500">{steps[currentStep - 1].desc}</p>
                        </div>
                        <div className="text-4xl font-black text-zinc-800 select-none opacity-50">{currentStep}/5</div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden flex">
                        {steps.map((s) => (
                            <div key={s.id} className={`h-full transition-all duration-500 ${s.id <= currentStep ? 'bg-yellow-500' : 'bg-transparent'} flex-1 border-r border-zinc-950/50 last:border-0`} />
                        ))}
                    </div>
                </div>

                {/* Wizard Body */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {renderStepContent()}
                </div>

                {/* Wizard Footer (Navigation) */}
                <div className="p-6 md:p-8 border-t border-zinc-800 bg-zinc-950/30 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                        className="px-6 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400 transition-all font-medium flex items-center gap-2"
                    >
                        {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />} {t.form.navigation.back}
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                            className="px-8 py-3 rounded-xl bg-zinc-100 text-black hover:bg-white font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                        >
                            {t.form.navigation.next} {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)]"
                        >
                            <Wand2 size={18} /> {t.form.navigation.finish}
                        </button>
                    )}
                </div>

            </div>

            {/* Result Section */}
            {generated && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                    <label className="text-sm font-medium text-zinc-400 block mb-2 px-1">
                        {t.form.resultLabel}
                    </label>
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-3xl p-8 relative group shadow-2xl">
                        <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 leading-relaxed font-light break-words pe-14">
                            {generated}
                        </p>
                        <button
                            onClick={handleCopy}
                            className="absolute top-6 end-6 bg-zinc-800/50 hover:bg-zinc-700/80 text-zinc-300 p-3 rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
                            title={t.form.copy}
                        >
                            {copied ? <span className="text-green-400 text-xs font-bold px-1">{t.form.copied}</span> : <IconCopy />}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
