'use client';

import React, { useState } from 'react';
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
    Ban
} from 'lucide-react';

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);

export function PromptForm() {
    const { t } = useLanguage();

    const defaultAddonKeys = ['highlyDetailed', 'resolution8k', 'masterpiece', 'professional', 'photorealistic', 'sharpFocus'];
    const getTranslatedAddons = () => defaultAddonKeys.map(key => t.addons[key as keyof typeof t.addons]);

    const initialData: PromptData = {
        gender: '',
        ageGroup: '',
        ethnicity: '',
        eyeColor: '',
        hairColor: '',
        hairStyle: '',
        makeup: '',
        clothing: '',
        accessories: '',
        action: '',
        pose: '',
        background: '',
        era: '',
        weather: '',
        timeOfDay: '',
        camera: '',
        cameraType: '',
        lens: '',
        filmStock: '',
        style: '',
        photographerStyle: '',
        lighting: '',
        lightColor: '',
        colorGrading: '',
        aspectRatio: '',
        negativePrompt: '',
        addons: [],
    };

    const [data, setData] = useState<PromptData>({
        ...initialData,
        addons: getTranslatedAddons()
    });

    const [generated, setGenerated] = useState('');
    const [copied, setCopied] = useState(false);

    // Toggle negative prompt visibility
    const [showNegative, setShowNegative] = useState(false);

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

    const handleChange = (field: keyof PromptData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleAddon = (addonValue: string) => {
        setData(prev => {
            const newAddons = prev.addons.includes(addonValue)
                ? prev.addons.filter(a => a !== addonValue)
                : [...prev.addons, addonValue];
            return { ...prev, addons: newAddons };
        });
    };

    // Helper to render select fields
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
            <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm transition-shadow placeholder:text-zinc-600 truncate"
                value={(data[field] as string) || ''}
                onChange={(e) => handleChange(field, e.target.value)}
            >
                <option value="">{t.form.selectOption}</option>
                {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                ))}
            </select>
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
                            {renderSelect(t.form.clothing, 'clothing', t.options.clothing, <Shirt size={14} />)}
                            {renderSelect(t.form.accessories, 'accessories', t.options.accessories, <Glasses size={14} />)}
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
                            {renderSelect(t.form.lighting, 'lighting', t.lighting, <Lightbulb size={14} />)}
                            {renderSelect(t.form.lightColor, 'lightColor', t.options.lightColor, <Palette size={14} />)}
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
                    </div>

                    {/* Style & Grading Group */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800/50 pb-2 pt-2">
                            <Palette size={14} /> Style & Production
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {renderSelect(t.form.style, 'style', t.styles, <Palette size={14} />)}
                            {renderSelect(t.form.photographerStyle, 'photographerStyle', t.options.photographerStyle, <User size={14} />)}
                            {renderSelect(t.form.colorGrading, 'colorGrading', t.options.colorGrading, <MonitorPlay size={14} />)}
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

                    {/* Negative Prompt */}
                    <div className="pt-2">
                        <button
                            onClick={() => setShowNegative(!showNegative)}
                            className="text-xs font-bold text-red-500/80 uppercase tracking-widest flex items-center gap-2 hover:text-red-400 transition-colors"
                        >
                            <Ban size={14} /> {t.form.negativePrompt}
                            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded ml-auto transition-transform duration-200" style={{ transform: showNegative ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                        </button>

                        {showNegative && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <textarea
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 appearance-none text-sm placeholder:text-zinc-700 resize-none"
                                    rows={2}
                                    placeholder={t.form.negativePlaceholder}
                                    value={data.negativePrompt}
                                    onChange={(e) => handleChange('negativePrompt', e.target.value)}
                                />
                            </div>
                        )}
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
