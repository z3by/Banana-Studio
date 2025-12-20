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
    Check
} from 'lucide-react';

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);

export function PromptForm() {
    const { t } = useLanguage();

    const defaultAddonKeys = ['highlyDetailed', 'resolution8k', 'masterpiece', 'professional', 'photorealistic', 'sharpFocus'];
    const getTranslatedAddons = () => defaultAddonKeys.map(key => t.addons[key as keyof typeof t.addons]);

    // Initial State
    const initialData: PromptData = {
        gender: '',
        ageGroup: '',
        ethnicity: '',
        eyeColor: '',
        hairColor: '',
        hairStyle: '',
        makeup: '',
        clothing: [],     // Multi
        accessories: [],  // Multi
        pose: '',
        action: '',
        background: '',
        era: '',
        weather: '',
        timeOfDay: '',

        mood: [],         // Multi

        camera: '',
        cameraType: '',
        lens: '',
        filmStock: '',
        composition: '',

        style: [],             // Multi
        photographerStyle: [], // Multi
        lighting: [],          // Multi
        lightColor: '',
        colorGrading: '',
        specialEffects: [],    // Multi
        texture: [],           // Multi

        aiModel: '',
        aspectRatio: '',
        negativePrompt: '',
        stylize: 0,
        chaos: 0,
        weirdness: 0,
        addons: [],
    };

    const [data, setData] = useState<PromptData>({
        ...initialData,
        addons: getTranslatedAddons()
    });

    const [generated, setGenerated] = useState('');
    const [copied, setCopied] = useState(false);
    const [showNegative, setShowNegative] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Helper for closing dropdowns when clicking outside
    const useOutsideClick = (callback: () => void) => {
        const ref = useRef<HTMLDivElement>(null);
        useEffect(() => {
            const handleClick = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    callback();
                }
            };
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }, [callback]);
        return ref;
    };

    const handleGenerate = () => {
        const result = generatePrompt(data);
        setGenerated(result);
        setCopied(false);
    };

    const handleCopy = () => {
        if (!generated) return;
        navigator.clipboard.writeText(generated);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setData({
            ...initialData,
            addons: getTranslatedAddons()
        });
        setGenerated('');
        setCopied(false);
    };

    const handleChange = (field: keyof PromptData, value: string | number) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // Generic Multi-Select Toggle
    const toggleSelection = (field: keyof PromptData, value: string) => {
        setData(prev => {
            const current = prev[field] as string[];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    // Addon Specific Toggle (wraps Generic)
    const toggleAddon = (value: string) => toggleSelection('addons', value);


    // --- Render Components ---

    // 1. Single Select Dropdown
    const renderSelect = (
        label: string,
        field: keyof PromptData,
        options: Record<string, string>,
        icon?: React.ReactNode
    ) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                {icon}
                {label}
            </label>
            <div className="relative">
                <select
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm transition-shadow placeholder:text-zinc-600 truncate pr-8"
                    value={(data[field] as string) || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                >
                    <option value="">{t.form.selectOption}</option>
                    {Object.entries(options).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-zinc-500">
                    <ChevronsUpDown size={14} />
                </div>
            </div>
        </div>
    );

    // 2. Multi-Select Dropdown with Tags
    const MultiSelectField = ({
        label,
        field,
        options,
        icon
    }: {
        label: string,
        field: keyof PromptData,
        options: Record<string, string>,
        icon?: React.ReactNode
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const ref = useOutsideClick(() => setIsOpen(false));
        const selectedValues = data[field] as string[];

        return (
            <div className="space-y-2" ref={ref}>
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                    {icon}
                    {label}
                </label>

                <div className="relative">
                    {/* Trigger Area */}
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full bg-zinc-950 border rounded-xl p-2.5 min-h-[46px] flex flex-wrap gap-1.5 cursor-pointer text-sm transition-all
              ${isOpen ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-zinc-800 hover:border-zinc-700'}
            `}
                    >
                        {selectedValues.length === 0 && (
                            <span className="text-zinc-600 self-center px-1">{t.form.selectOption}</span>
                        )}

                        {selectedValues.map((val) => (
                            <span key={val} className="bg-zinc-800/80 text-zinc-200 px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 border border-zinc-700/50">
                                {val}
                                <button
                                    className="hover:text-red-400 ml-1 focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(field, val);
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}

                        <div className="ml-auto self-center text-zinc-500 pr-1">
                            <ChevronsUpDown size={14} />
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
                            {Object.entries(options).map(([key, value]) => {
                                const isSelected = selectedValues.includes(value);
                                return (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            toggleSelection(field, value);
                                            // Optional: Keep open for multiple selection
                                        }}
                                        className={`
                                px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                                ${isSelected ? 'bg-yellow-500/10 text-yellow-500' : 'text-zinc-300 hover:bg-zinc-800'}
                            `}
                                    >
                                        <span>{value}</span>
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

    // 3. Slider Component
    const renderSlider = (
        label: string,
        field: 'stylize' | 'chaos' | 'weirdness',
        min: number,
        max: number,
        icon?: React.ReactNode
    ) => (
        <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">{icon} {label}</span>
                <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded text-xs">
                    {data[field]}
                </span>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                value={data[field]}
                onChange={(e) => handleChange(field, parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-600">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">

            {/* Form Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
                <div className="space-y-8">

                    {/* Subject Details Group */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-yellow-500/80 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800/50 pb-2">
                            <User size={14} /> Subject Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {renderSelect(t.form.gender, 'gender', t.options.gender)}
                            {renderSelect(t.form.ageGroup, 'ageGroup', t.options.ageGroup)}
                            {renderSelect(t.form.ethnicity, 'ethnicity', t.options.ethnicity, <Globe size={14} />)}
                            {renderSelect(t.form.eyeColor, 'eyeColor', t.options.eyeColor, <Eye size={14} />)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {renderSelect(t.form.hairStyle, 'hairStyle', t.options.hairStyle, <Scissors size={14} />)}
                            {renderSelect(t.form.hairColor, 'hairColor', t.options.hairColor)}
                            {renderSelect(t.form.makeup, 'makeup', t.options.makeup, <Smile size={14} />)}
                            {renderSelect(t.form.pose, 'pose', t.options.pose, <User size={14} />)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <MultiSelectField label={t.form.clothing} field="clothing" options={t.options.clothing} icon={<Shirt size={14} />} />
                            <MultiSelectField label={t.form.accessories} field="accessories" options={t.options.accessories} icon={<Glasses size={14} />} />
                            {renderSelect(t.form.action, 'action', t.options.action, <Meh size={14} />)}
                        </div>
                    </div>

                    {/* Scene & Atmosphere Group */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-400/80 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800/50 pb-2 pt-2">
                            <CloudSun size={14} /> Scene & Atmosphere
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {renderSelect(t.form.background, 'background', t.options.background, <ImageIcon size={14} />)}
                            {renderSelect(t.form.era, 'era', t.options.era, <Hourglass size={14} />)}
                            {renderSelect(t.form.weather, 'weather', t.options.weather, <CloudSun size={14} />)}
                            {renderSelect(t.form.timeOfDay, 'timeOfDay', t.options.timeOfDay, <Clock size={14} />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MultiSelectField label={t.form.lighting} field="lighting" options={t.lighting} icon={<Lightbulb size={14} />} />
                            {renderSelect(t.form.lightColor, 'lightColor', t.options.lightColor, <Palette size={14} />)}
                            <MultiSelectField label={t.form.mood} field="mood" options={t.options.mood} icon={<Focus size={14} />} />
                        </div>
                    </div>

                    {/* Technical Camera Group */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-red-400/80 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800/50 pb-2 pt-2">
                            <Camera size={14} /> Camera & Technical
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {renderSelect(t.form.cameraType, 'cameraType', t.options.cameraType, <CameraIcon size={14} />)}
                            {renderSelect(t.form.camera, 'camera', t.options.camera, <Aperture size={14} />)}
                            {renderSelect(t.form.lens, 'lens', t.options.lens, <Eye size={14} />)}
                            {renderSelect(t.form.filmStock, 'filmStock', t.options.filmStock, <Film size={14} />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {renderSelect(t.form.composition, 'composition', t.options.composition, <Layout size={14} />)}
                        </div>
                    </div>

                    {/* Style & Grading Group */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800/50 pb-2 pt-2">
                            <Palette size={14} /> Style & Production
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MultiSelectField label={t.form.style} field="style" options={t.styles} icon={<Palette size={14} />} />
                            <MultiSelectField label={t.form.photographerStyle} field="photographerStyle" options={t.options.photographerStyle} icon={<User size={14} />} />
                            {renderSelect(t.form.colorGrading, 'colorGrading', t.options.colorGrading, <MonitorPlay size={14} />)}
                            <MultiSelectField label={t.form.specialEffects} field="specialEffects" options={t.options.specialEffects} icon={<Sparkles size={14} />} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MultiSelectField label={t.form.texture} field="texture" options={t.options.texture} icon={<Gauge size={14} />} />
                            {renderSelect(t.form.aiModel, 'aiModel', t.options.aiModel, <Cpu size={14} />)}
                            {renderSelect(t.form.aspectRatio, 'aspectRatio', t.options.aspectRatio, <Maximize size={14} />)}
                        </div>
                    </div>

                    {/* Addons Checkboxes */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-green-400/80 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800/50 pb-2 pt-2">
                            <Settings size={14} /> {t.form.addons}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Object.entries(t.addons).map(([key, value]) => {
                                const isChecked = data.addons.includes(value);
                                return (
                                    <div
                                        key={key}
                                        onClick={() => toggleAddon(value)}
                                        className={`
                                cursor-pointer rounded-xl p-3 border transition-all flex items-center gap-3 select-none
                                ${isChecked
                                                ? 'bg-zinc-800 border-yellow-500/50 text-yellow-100 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]'
                                                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'}
                            `}
                                    >
                                        {isChecked
                                            ? <CheckCircle2 size={18} className="text-yellow-500" />
                                            : <Circle size={18} className="text-zinc-600" />
                                        }
                                        <span className="text-sm font-medium">{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Collapsible Sections (Negative & Advanced) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">

                        {/* Negative Prompt */}
                        <div>
                            <button
                                onClick={() => setShowNegative(!showNegative)}
                                className="text-xs font-bold text-red-500/80 uppercase tracking-widest flex items-center gap-2 hover:text-red-400 transition-colors mb-4"
                            >
                                <Ban size={14} /> {t.form.negativePrompt}
                                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded ml-auto transition-transform duration-200" style={{ transform: showNegative ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                            </button>

                            {showNegative && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <textarea
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 appearance-none text-sm placeholder:text-zinc-700 resize-none"
                                        rows={3}
                                        placeholder={t.form.negativePlaceholder}
                                        value={data.negativePrompt}
                                        onChange={(e) => handleChange('negativePrompt', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Advanced Params */}
                        <div>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-xs font-bold text-cyan-500/80 uppercase tracking-widest flex items-center gap-2 hover:text-cyan-400 transition-colors mb-4"
                            >
                                <Sliders size={14} /> {t.form.advancedParams}
                                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded ml-auto transition-transform duration-200" style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                            </button>

                            {showAdvanced && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 space-y-5">
                                    {renderSlider(t.form.stylize, 'stylize', 0, 1000, <Palette size={14} />)}
                                    {renderSlider(t.form.chaos, 'chaos', 0, 100, <Sparkles size={14} />)}
                                    {renderSlider(t.form.weirdness, 'weirdness', 0, 3000, <Gauge size={14} />)}
                                </div>
                            )}
                        </div>

                    </div>


                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={handleGenerate}
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Wand2 size={20} />
                            {t.form.generate}
                        </button>

                        <button
                            onClick={handleReset}
                            className="bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 p-4 rounded-2xl transition-all"
                            aria-label={t.form.reset}
                            title={t.form.reset}
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

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
                            {copied ? (
                                <span className="text-green-400 text-xs font-bold px-1">{t.form.copied}</span>
                            ) : (
                                <IconCopy />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
