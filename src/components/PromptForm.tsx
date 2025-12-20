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
    Info
} from 'lucide-react';

// --- Icons ---
const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);

export function PromptForm() {
    const { t, language } = useLanguage();
    const isRTL = language === 'ar';

    const defaultAddonKeys = ['highlyDetailed', 'resolution8k', 'masterpiece', 'professional', 'photorealistic', 'sharpFocus'];
    const getTranslatedAddons = () => defaultAddonKeys.map(key => t.addons[key as keyof typeof t.addons]);

    // Initial Data
    const initialData: PromptData = {
        gender: '', ageGroup: '', ethnicity: '', eyeColor: '', hairColor: '', hairStyle: '', makeup: '',
        clothing: [], accessories: [], pose: '', action: '',
        background: '', era: '', weather: '', timeOfDay: '', mood: [],
        camera: '', cameraType: '', lens: '', filmStock: '', composition: '',
        style: [], photographerStyle: [], lighting: [], lightColor: '', colorGrading: '', specialEffects: [], texture: [],
        aiModel: '', aspectRatio: '', negativePrompt: '',
        stylize: 0, chaos: 0, weirdness: 0,
        addons: [],
    };

    const [data, setData] = useState<PromptData>({ ...initialData, addons: getTranslatedAddons() });
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
        newData.gender = pick(t.options.gender);
        newData.ageGroup = pick(t.options.ageGroup);
        newData.ethnicity = pick(t.options.ethnicity);
        newData.eyeColor = Math.random() > 0.5 ? pick(t.options.eyeColor) : '';
        newData.hairColor = Math.random() > 0.5 ? pick(t.options.hairColor) : '';
        newData.hairStyle = Math.random() > 0.5 ? pick(t.options.hairStyle) : '';
        newData.makeup = Math.random() > 0.7 ? pick(t.options.makeup) : ''; // Less chance
        newData.pose = Math.random() > 0.3 ? pick(t.options.pose) : '';
        newData.action = Math.random() > 0.5 ? pick(t.options.action) : '';
        newData.clothing = Math.random() > 0.2 ? pickMulti(t.options.clothing) : [];
        newData.accessories = Math.random() > 0.5 ? pickMulti(t.options.accessories) : [];

        // Scene
        newData.background = pick(t.options.background);
        newData.era = Math.random() > 0.5 ? pick(t.options.era) : '';
        newData.weather = Math.random() > 0.5 ? pick(t.options.weather) : '';
        newData.timeOfDay = Math.random() > 0.3 ? pick(t.options.timeOfDay) : '';
        newData.mood = Math.random() > 0.3 ? pickMulti(t.options.mood) : [];

        // Camera
        newData.cameraType = Math.random() > 0.5 ? pick(t.options.cameraType) : '';
        newData.camera = Math.random() > 0.5 ? pick(t.options.camera) : '';
        newData.lens = Math.random() > 0.5 ? pick(t.options.lens) : '';
        newData.filmStock = Math.random() > 0.6 ? pick(t.options.filmStock) : '';
        newData.composition = Math.random() > 0.6 ? pick(t.options.composition) : '';
        newData.aspectRatio = Math.random() > 0.3 ? pick(t.options.aspectRatio) : '';

        // Style
        newData.style = Math.random() > 0.2 ? [pick(t.styles)] : [];
        newData.photographerStyle = Math.random() > 0.7 ? [pick(t.options.photographerStyle)] : [];
        newData.lighting = Math.random() > 0.4 ? pickMulti(t.lighting) : [];
        newData.lightColor = Math.random() > 0.6 ? pick(t.options.lightColor) : '';
        newData.colorGrading = Math.random() > 0.6 ? pick(t.options.colorGrading) : '';
        newData.specialEffects = Math.random() > 0.8 ? pickMulti(t.options.specialEffects) : [];
        newData.texture = Math.random() > 0.8 ? pickMulti(t.options.texture) : [];
        newData.aiModel = Math.random() > 0.5 ? pick(t.options.aiModel) : '';

        // Advanced
        newData.stylize = Math.random() > 0.5 ? Math.floor(Math.random() * 500) : 0;
        newData.chaos = Math.random() > 0.8 ? Math.floor(Math.random() * 50) : 0;
        newData.weirdness = Math.random() > 0.9 ? Math.floor(Math.random() * 1000) : 0;

        setData(newData);
    };

    const handleChange = (field: keyof PromptData, value: string | number) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleSelection = (field: keyof PromptData, value: string) => {
        setData(prev => {
            const current = prev[field] as string[];
            const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const toggleAddon = (value: string) => toggleSelection('addons', value);
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

    // --- Components ---

    const MultiSelectField = ({ label, field, options, icon }: any) => {
        const [isOpen, setIsOpen] = useState(false);
        const ref = useOutsideClick(() => setIsOpen(false));
        const selectedValues = data[field as keyof PromptData] as string[];

        return (
            <div className="space-y-2" ref={ref}>
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                    {icon} {label}
                </label>
                <div className="relative">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full bg-zinc-950 border rounded-xl p-2.5 min-h-[46px] flex flex-wrap gap-1.5 cursor-pointer text-sm transition-all ${isOpen ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                        {selectedValues.length === 0 && <span className="text-zinc-600 self-center px-1">{t.form.selectOption}</span>}
                        {selectedValues.map((val) => (
                            <span key={val} className="bg-zinc-800/80 text-zinc-200 px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 border border-zinc-700/50">
                                {val}
                                <button className="hover:text-red-400 ml-1" onClick={(e) => { e.stopPropagation(); toggleSelection(field, val); }}>×</button>
                            </span>
                        ))}
                        <div className="ml-auto self-center text-zinc-500 pr-1"><ChevronsUpDown size={14} /></div>
                    </div>
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
                            {Object.entries(options).map(([k, v]: any) => {
                                const isSelected = selectedValues.includes(v);
                                return (
                                    <div key={k} onClick={() => toggleSelection(field, v)} className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-yellow-500/10 text-yellow-500' : 'text-zinc-300 hover:bg-zinc-800'}`}>
                                        <span>{v}</span>
                                        {isSelected && <Check size={14} />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const SelectField = ({ label, field, options, icon }: any) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                {icon} {label}
            </label>
            <div className="relative">
                <select
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm transition-shadow placeholder:text-zinc-600 truncate pr-8"
                    value={(data[field as keyof PromptData] as string) || ''}
                    onChange={(e) => handleChange(field as keyof PromptData, e.target.value)}
                >
                    <option value="">{t.form.selectOption}</option>
                    {Object.entries(options).map(([k, v]: any) => <option key={k} value={v}>{v}</option>)}
                </select>
                <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-zinc-500"><ChevronsUpDown size={14} /></div>
            </div>
        </div>
    );

    const SliderField = ({ label, field, min, max, icon, tooltip }: any) => (
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
                <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded text-xs">{data[field as keyof PromptData]}</span>
            </label>
            <input
                type="range" min={min} max={max} value={data[field as keyof PromptData] as number}
                onChange={(e) => handleChange(field as keyof PromptData, parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-600"><span>{min}</span><span>{max}</span></div>
        </div>
    );

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
                        <SelectField label={t.form.gender} field="gender" options={t.options.gender} />
                        <SelectField label={t.form.ageGroup} field="ageGroup" options={t.options.ageGroup} />
                        <SelectField label={t.form.ethnicity} field="ethnicity" options={t.options.ethnicity} icon={<Globe size={14} />} />
                        <SelectField label={t.form.eyeColor} field="eyeColor" options={t.options.eyeColor} icon={<Eye size={14} />} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.hairStyle} field="hairStyle" options={t.options.hairStyle} icon={<Scissors size={14} />} />
                        <SelectField label={t.form.hairColor} field="hairColor" options={t.options.hairColor} />
                        <SelectField label={t.form.makeup} field="makeup" options={t.options.makeup} icon={<Smile size={14} />} />
                        <SelectField label={t.form.pose} field="pose" options={t.options.pose} icon={<User size={14} />} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MultiSelectField label={t.form.clothing} field="clothing" options={t.options.clothing} icon={<Shirt size={14} />} />
                        <MultiSelectField label={t.form.accessories} field="accessories" options={t.options.accessories} icon={<Glasses size={14} />} />
                        <SelectField label={t.form.action} field="action" options={t.options.action} icon={<Meh size={14} />} />
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.background} field="background" options={t.options.background} icon={<ImageIcon size={14} />} />
                        <SelectField label={t.form.era} field="era" options={t.options.era} icon={<Hourglass size={14} />} />
                        <SelectField label={t.form.weather} field="weather" options={t.options.weather} icon={<CloudSun size={14} />} />
                        <SelectField label={t.form.timeOfDay} field="timeOfDay" options={t.options.timeOfDay} icon={<Clock size={14} />} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.lighting} field="lighting" options={t.lighting} icon={<Lightbulb size={14} />} />
                        <SelectField label={t.form.lightColor} field="lightColor" options={t.options.lightColor} icon={<Palette size={14} />} />
                        <MultiSelectField label={t.form.mood} field="mood" options={t.options.mood} icon={<Focus size={14} />} />
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.cameraType} field="cameraType" options={t.options.cameraType} icon={<CameraIcon size={14} />} />
                        <SelectField label={t.form.camera} field="camera" options={t.options.camera} icon={<Aperture size={14} />} />
                        <SelectField label={t.form.lens} field="lens" options={t.options.lens} icon={<Eye size={14} />} />
                        <SelectField label={t.form.filmStock} field="filmStock" options={t.options.filmStock} icon={<Film size={14} />} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SelectField label={t.form.composition} field="composition" options={t.options.composition} icon={<Layout size={14} />} />
                        <SelectField label={t.form.aspectRatio} field="aspectRatio" options={t.options.aspectRatio} icon={<Maximize size={14} />} />
                    </div>
                </div>
            );
            case 4: return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.style} field="style" options={t.styles} icon={<Palette size={14} />} />
                        <MultiSelectField label={t.form.photographerStyle} field="photographerStyle" options={t.options.photographerStyle} icon={<User size={14} />} />
                        <SelectField label={t.form.colorGrading} field="colorGrading" options={t.options.colorGrading} icon={<MonitorPlay size={14} />} />
                        <MultiSelectField label={t.form.specialEffects} field="specialEffects" options={t.options.specialEffects} icon={<Sparkles size={14} />} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MultiSelectField label={t.form.texture} field="texture" options={t.options.texture} icon={<Gauge size={14} />} />
                        <SelectField label={t.form.aiModel} field="aiModel" options={t.options.aiModel} icon={<Cpu size={14} />} />
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
                            <SliderField label={t.form.stylize} field="stylize" min={0} max={1000} icon={<Palette size={14} />} tooltip={t.form.guidance.stylize} />
                            <SliderField label={t.form.chaos} field="chaos" min={0} max={100} icon={<Sparkles size={14} />} tooltip={t.form.guidance.chaos} />
                            <SliderField label={t.form.weirdness} field="weirdness" min={0} max={3000} icon={<Gauge size={14} />} tooltip={t.form.guidance.weirdness} />
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
