'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from './LanguageContext';
import { generatePrompt, PromptData } from '@/lib/prompt-builder';
import { presets, Preset } from '@/lib/presets';
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
    List,
    Download,
    Share2,
    RotateCcw,
    Layers,
    Star
} from 'lucide-react';

// --- Constants ---
const DROPDOWN_MAX_HEIGHT = 240; // max-h-60 = 15rem = 240px
const DROPDOWN_SPACING = 8; // pixels
const DROPDOWN_MIN_MARGIN = 16; // pixels
const TOAST_DURATION = 2000; // milliseconds
const MAX_HISTORY_ITEMS = 10;
const MAX_RECENT_PRESETS = 10;

// --- Icons ---
const IconCopy = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
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

const useDropdownPosition = (isOpen: boolean, triggerRef: React.RefObject<HTMLElement | null>) => {
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        let frameId: number;
        const updatePosition = () => {
            if (isOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                const dropdownHeight = DROPDOWN_MAX_HEIGHT;

                const style: React.CSSProperties = {
                    position: 'fixed',
                    left: rect.left,
                    width: rect.width,
                };

                if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                    style.bottom = viewportHeight - rect.top + DROPDOWN_SPACING;
                    style.top = 'auto';
                    style.maxHeight = Math.min(dropdownHeight, rect.top - DROPDOWN_MIN_MARGIN);
                } else {
                    style.top = rect.bottom + DROPDOWN_SPACING;
                    style.bottom = 'auto';
                    style.maxHeight = Math.min(dropdownHeight, spaceBelow - DROPDOWN_MIN_MARGIN);
                }
                setDropdownStyle(style);
            }
        };

        const handleUpdate = () => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(updatePosition);
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', handleUpdate, true);
            window.addEventListener('resize', handleUpdate);
        }

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [isOpen, triggerRef]);

    return dropdownStyle;
};

// --- Standalone Components ---

const MultiSelectField = ({ label, value, onChange, options, icon, placeholder = "Select..." }: { label: string, value: string[], onChange: (val: string[]) => void, options: Record<string, string>, icon: React.ReactNode, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownStyle = useDropdownPosition(isOpen, triggerRef);

    // Custom outside click handler that includes the portal dropdown
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!isOpen) return;
            const target = e.target as Node;
            const clickedInsideContainer = containerRef.current?.contains(target);
            const clickedInsideDropdown = dropdownRef.current?.contains(target);
            if (!clickedInsideContainer && !clickedInsideDropdown) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

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

    const dropdownContent = isOpen && typeof document !== 'undefined' ? createPortal(
        <div
            ref={dropdownRef}
            className="z-[9999] glass-panel rounded-xl overflow-auto animate-in fade-in zoom-in-95 duration-100 dark-scrollbar"
            style={dropdownStyle}
        >
            {Object.entries(options).map(([k, v]) => {
                if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                const isSelected = value.includes(k);
                return (
                    <button key={k} type="button" onClick={() => { toggleValue(k); setInputValue(""); }} className={`px-4 py-2 text-sm flex items-center justify-between transition-colors w-full text-left ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-300 hover:bg-white/5'}`}>
                        <span>{v}</span>
                        {isSelected && <Check size={14} />}
                    </button>
                );
            })}
            {inputValue && !Object.values(options).some((v: string) => v.toLowerCase() === inputValue.toLowerCase()) && (
                <button key="custom-add" type="button" onClick={() => { onChange([...value, inputValue]); setInputValue(""); }} className="px-4 py-2 text-sm text-blue-400 hover:bg-white/5 flex items-center gap-2 italic border-t border-white/5 w-full text-left">
                    <PenLine size={12} /> Add &quot;{inputValue}&quot;
                </button>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <div className="space-y-2" ref={containerRef}>
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap px-1">
                {icon} {label}
            </label>
            <div className="relative">
                <div
                    ref={triggerRef}
                    onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
                    className={`w-full bg-black/40 backdrop-blur-sm border rounded-xl p-2 min-h-[52px] flex flex-wrap gap-2 cursor-text text-sm transition-all ${isOpen ? 'border-amber-500/50' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                >
                    {value.map((val) => (
                        <span key={val} className="bg-amber-500/10 text-amber-200 px-3 py-1 rounded-xl text-xs flex items-center gap-1 border border-amber-500/20 animate-in fade-in zoom-in-95 duration-200">
                            {getLabel(val)}
                            <button className="hover:text-amber-400 ml-1 rounded-full p-0.5 hover:bg-amber-500/20" onClick={(e) => { e.stopPropagation(); toggleValue(val); }}>×</button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="bg-transparent outline-none flex-1 min-w-[60px] text-zinc-200 placeholder:text-zinc-600 h-8"
                        placeholder={value.length === 0 ? placeholder : ""}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                    />
                    <div className="ml-auto self-center text-zinc-500 text-xs flex items-center gap-1 pr-2">
                        {isOpen && inputValue.length > 0 && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded hidden md:inline">Press Enter</span>}
                        <ChevronsUpDown size={14} className="opacity-50" />
                    </div>
                </div>
                {dropdownContent}
            </div>
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, icon, placeholder = "Select..." }: { label: string, value: string, onChange: (val: string) => void, options: Record<string, string>, icon: React.ReactNode, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isManual, setIsManual] = useState(false); // Toggle between list and raw input
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownStyle = useDropdownPosition(isOpen, triggerRef);

    // Custom outside click handler that includes the portal dropdown
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!isOpen) return;
            const target = e.target as Node;
            const clickedInsideContainer = containerRef.current?.contains(target);
            const clickedInsideDropdown = dropdownRef.current?.contains(target);
            if (!clickedInsideContainer && !clickedInsideDropdown) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const handleSelect = (key: string) => {
        onChange(key);
        setIsOpen(false);
        setInputValue("");
    };

    const getLabel = (val: string) => {
        return options[val] || val;
    };

    const dropdownContent = isOpen && typeof document !== 'undefined' ? createPortal(
        <div
            ref={dropdownRef}
            className="z-[9999] glass-panel rounded-2xl shadow-2xl overflow-auto animate-in fade-in zoom-in-95 duration-100 dark-scrollbar"
            style={dropdownStyle}
        >
            <div className="p-2 sticky top-0 bg-black/50 backdrop-blur-md border-b border-white/5 z-10">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-black/40"
                    placeholder="Search..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {Object.entries(options).map(([k, v]) => {
                if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                const isSelected = value === k;
                return (
                    <button key={k} type="button" onClick={() => handleSelect(k)} className={`px-4 py-2 text-sm flex items-center justify-between transition-colors w-full text-left ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-300 hover:bg-white/5'}`}>
                        <span>{v}</span>
                        {isSelected && <Check size={14} />}
                    </button>
                );
            })}
            {inputValue && !Object.values(options).some((v: string) => v.toLowerCase() === inputValue.toLowerCase()) && (
                <button key="custom-use" type="button" onClick={() => handleSelect(inputValue)} className="px-4 py-2 text-sm text-blue-400 hover:bg-white/5 flex items-center gap-2 italic border-t border-white/5 w-full text-left">
                    <PenLine size={12} /> Use &quot;{inputValue}&quot;
                </button>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <div className="space-y-2 group" ref={containerRef}>
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5 whitespace-nowrap px-1">
                    {icon} {label}
                </label>
                <button
                    onClick={() => {
                        setIsManual(!isManual);
                        setIsOpen(false);
                    }}
                    className="text-[10px] text-zinc-600 hover:text-amber-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 px-2"
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
                        className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-zinc-100 focus:outline-none focus:border-amber-500/50 appearance-none text-sm transition-all placeholder:text-zinc-600"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type anything..."
                    />
                    <div className="absolute inset-y-0 end-4 flex items-center pointer-events-none text-zinc-500"><PenLine size={14} /></div>
                </div>
            ) : (
                <div className="relative">
                    <div
                        ref={triggerRef}
                        onClick={() => {
                            setIsOpen(!isOpen);
                            if (!isOpen && !isManual) {
                                setInputValue("");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }
                        }}
                        className={`w-full bg-black/40 backdrop-blur-sm border rounded-xl p-4 flex justify-between items-center cursor-pointer text-sm transition-all ${isOpen ? 'border-amber-500/50' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                    >
                        <span className={`truncate ${!value ? 'text-zinc-600' : 'text-zinc-200'}`}>
                            {value ? getLabel(value) : placeholder}
                        </span>
                        <ChevronsUpDown size={14} className="text-zinc-500 opacity-50" />
                    </div>
                    {dropdownContent}
                </div>
            )}
        </div>
    );
};

const SliderField = ({ label, value, onChange, min, max, icon, tooltip }: { label: string, value: number, onChange: (val: number) => void, min: number, max: number, icon: React.ReactNode, tooltip?: string }) => (
    <div className="space-y-4 group p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition-colors">
        <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
                {icon} {label}
                {tooltip && (
                    <div className="relative group/tooltip">
                        <Info size={14} className="text-zinc-500 hover:text-zinc-300 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 backdrop-blur-md">
                            {tooltip}
                        </div>
                    </div>
                )}
            </span>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg text-xs border border-amber-500/20">{value}</span>
        </label>
        <div className="relative py-2">
            <input
                type="range" min={min} max={max} value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500 transition-all"
            />
            <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[10px] text-zinc-600 font-mono"><span>{min}</span><span>{max}</span></div>
        </div>
    </div>
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
    const [currentStep, setCurrentStep] = useState(1);
    const [showToast, setShowToast] = useState<string | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);
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
    const [presetCategory, setPresetCategory] = useState<'common' | 'creative' | 'utility' | 'favorites' | 'recent'>('common');
    const [presetSearch, setPresetSearch] = useState('');
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

    // Calculate filled fields per step
    const getStepFieldCount = (stepId: number): number => {
        switch (stepId) {
            case 1:
                return [data.gender, data.ageGroup, data.ethnicity, data.eyeColor, data.hairColor]
                    .filter(v => v).length +
                    [data.hairStyle, data.makeup, data.pose, data.clothing, data.accessories, data.action]
                        .filter(arr => arr.length > 0).length;
            case 2:
                return [data.background, data.era, data.timeOfDay, data.lightColor]
                    .filter(v => v).length +
                    [data.weather, data.lighting, data.mood]
                        .filter(arr => arr.length > 0).length;
            case 3:
                return [data.cameraType, data.camera, data.aspectRatio]
                    .filter(v => v).length +
                    [data.lens, data.filmStock, data.composition]
                        .filter(arr => arr.length > 0).length;
            case 4:
                return [data.colorGrading]
                    .filter(v => v).length +
                    [data.style, data.photographerStyle, data.specialEffects, data.texture]
                        .filter(arr => arr.length > 0).length;
            case 5:
                return (data.stylize > 0 ? 1 : 0) + (data.chaos > 0 ? 1 : 0) + (data.weirdness > 0 ? 1 : 0) +
                    (data.addons.length > 0 ? 1 : 0) + (data.negativePrompt ? 1 : 0);
            default:
                return 0;
        }
    };

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

        if (parts.length === 0) return '🎨 Start filling fields to see preview...';
        return parts.join(' • ');
    };

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
        localStorage.removeItem('prompt_history_v2');
    };

    // Toast helper
    const showToastMessage = (message: string) => {
        setShowToast(message);
        setTimeout(() => setShowToast(null), 2500);
    };


    // --- Logic ---

    const handleGenerate = () => {
        const result = generatePrompt(data);
        setGenerated(result);
        setCopied(false);
        addToHistory(result);
        showToastMessage('✨ Prompt generated!');
        // Auto-scroll to result after a brief delay
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleCopy = async () => {
        if (!generated) return;
        try {
            await navigator.clipboard.writeText(generated);
            setCopied(true);
            showToastMessage('📋 Copied to clipboard!');
            setTimeout(() => setCopied(false), TOAST_DURATION);
        } catch {
            showToastMessage('❌ Failed to copy to clipboard');
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to clear all fields?')) {
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
            showToastMessage('❌ Failed to copy share link');
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
        showToastMessage('🔄 Step reset!');
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

        // Reset copied state after 2s
        setTimeout(() => setCopied(false), 2000);
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
                            {Object.entries(translations.en.addons).map(([k, enVal]) => {
                                const localVal = t.addons[k as keyof typeof t.addons];
                                const isChecked = data.addons.includes(enVal);
                                return (
                                    <button key={k} type="button" onClick={() => toggleAddon(enVal)} className={`rounded-xl p-3 border transition-all flex items-center gap-3 select-none w-full text-left ${isChecked ? 'bg-zinc-800 border-yellow-500/50 text-yellow-100 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'}`}>
                                        {isChecked ? <CheckCircle2 size={18} className="text-yellow-500" /> : <Circle size={18} className="text-zinc-600" />}
                                        <span className="text-sm font-medium">{localVal}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Negative Prompt */}
                    <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 space-y-4 border-red-900/10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-red-500/80 uppercase tracking-widest flex items-center gap-2">
                                <Ban size={14} /> {t.form.negativePrompt}
                            </h3>
                            <span className="text-[10px] text-zinc-600">{data.negativePrompt.length} {t.form.charCount}</span>
                        </div>
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

            {/* Toast Notification */}
            {showToast && typeof document !== 'undefined' && createPortal(
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-zinc-900 border border-yellow-500/30 px-6 py-3 rounded-2xl shadow-2xl shadow-yellow-500/10 flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-100">{showToast}</span>
                    </div>
                </div>,
                document.body
            )}

            {/* ✨ Quick Start Presets - Prominent Section */}
            <div className="glass-panel border-amber-500/10 rounded-xl p-6 relative overflow-hidden">
                {/* Header */}
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2.5 rounded-xl">
                            <Layers size={20} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                {t.form.presets.title || 'Quick Start Presets'}
                                <span className="text-[10px] font-bold bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full border border-white/5">
                                    {presets.length}
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-400">{t.form.presets.description || 'Choose a preset to instantly configure your prompt'}</p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search presets..."
                            value={presetSearch}
                            onChange={(e) => setPresetSearch(e.target.value)}
                            className="w-full md:w-64 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-black/60 pr-9 transition-all"
                        />
                        {presetSearch ? (
                            <button
                                onClick={() => setPresetSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        ) : (
                            <Sparkles size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        )}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="relative flex items-center gap-1 mb-6 bg-black/40 border border-white/5 p-1 rounded-xl w-fit backdrop-blur-md overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                    <button
                        onClick={() => setPresetCategory('favorites')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${presetCategory === 'favorites'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            }`}
                    >
                        <Star size={14} className={presetCategory === 'favorites' ? 'fill-yellow-400' : ''} />
                        {t.form.presets.favorites || 'Favorites'}
                        {favoritePresets.length > 0 && (
                            <span className="text-xs opacity-70">({favoritePresets.length})</span>
                        )}
                    </button>
                    <button
                        onClick={() => setPresetCategory('recent')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${presetCategory === 'recent'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            }`}
                    >
                        <History size={14} />
                        {t.form.presets.recent || 'Recent'}
                        {recentPresets.length > 0 && (
                            <span className="text-xs opacity-70">({recentPresets.length})</span>
                        )}
                    </button>
                    <button
                        onClick={() => setPresetCategory('common')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${presetCategory === 'common'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${presetCategory === 'common' ? 'bg-emerald-400' : 'bg-emerald-900'}`} />
                        {t.form.presets.common}
                    </button>
                    <button
                        onClick={() => setPresetCategory('creative')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${presetCategory === 'creative'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${presetCategory === 'creative' ? 'bg-purple-400' : 'bg-purple-900'}`} />
                        {t.form.presets.creative}
                    </button>
                    <button
                        onClick={() => setPresetCategory('utility')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${presetCategory === 'utility'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${presetCategory === 'utility' ? 'bg-cyan-400' : 'bg-cyan-900'}`} />
                        {t.form.presets.utility}
                    </button>
                </div>

                {/* Preset Grid - Now larger and more visual */}
                <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {presets
                            .filter(p => {
                                // Filter by category or favorites/recent
                                if (presetCategory === 'favorites') {
                                    return favoritePresets.includes(p.id);
                                } else if (presetCategory === 'recent') {
                                    return recentPresets.includes(p.id);
                                } else {
                                    return p.category === presetCategory;
                                }
                            })
                            .sort((a, b) => {
                                // Sort recent presets by most recent first
                                if (presetCategory === 'recent') {
                                    return recentPresets.indexOf(a.id) - recentPresets.indexOf(b.id);
                                }
                                return 0;
                            })
                            .filter(p => {
                                if (!presetSearch) return true;
                                const translation = t.form.presets[p.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
                                const name = translation?.name || p.id;
                                const desc = translation?.desc || '';
                                return name.toLowerCase().includes(presetSearch.toLowerCase()) ||
                                    desc.toLowerCase().includes(presetSearch.toLowerCase());
                            })
                            .map((preset) => {
                                const presetTranslation = t.form.presets[preset.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
                                const gradientClass = preset.category === 'common'
                                    ? 'from-emerald-900/40 to-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/50 hover:from-emerald-900/60 hover:to-emerald-900/30'
                                    : preset.category === 'creative'
                                        ? 'from-purple-900/40 to-purple-900/10 border-purple-500/20 hover:border-purple-500/50 hover:from-purple-900/60 hover:to-purple-900/30'
                                        : 'from-cyan-900/40 to-cyan-900/10 border-cyan-500/20 hover:border-cyan-500/50 hover:from-cyan-900/60 hover:to-cyan-900/30';

                                const categoryColorText = preset.category === 'common' ? 'text-emerald-400' : preset.category === 'creative' ? 'text-purple-400' : 'text-cyan-400';

                                return (
                                    <div
                                        key={preset.id}
                                        className={`flex-shrink-0 group flex flex-col items-center gap-3 px-5 py-5 rounded-xl border bg-gradient-to-br ${gradientClass} transition-all duration-300 min-w-[150px] relative overflow-hidden cursor-pointer active:scale-[0.98]`}
                                        title={presetTranslation?.desc || preset.id}
                                        onClick={() => applyPreset(preset)}
                                    >
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {/* Favorite Star Button */}
                                        <button
                                            onClick={(e) => toggleFavorite(preset.id, e)}
                                            className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                                            title={favoritePresets.includes(preset.id) ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            <Star size={14} className={`transition-colors ${favoritePresets.includes(preset.id) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-400 hover:text-yellow-400'}`} />
                                        </button>
                                        <span className={`text-3xl transition-transform duration-300 ${categoryColorText}`}>{preset.icon}</span>
                                        <div className="text-center relative z-10">
                                            <div className={`text-sm font-bold text-zinc-100 group-hover:text-white transition-colors`}>
                                                {presetTranslation?.name || preset.id}
                                            </div>
                                            <div className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors mt-1 line-clamp-2 max-w-[130px] leading-relaxed">
                                                {presetTranslation?.desc || ''}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {presets.filter(p => {
                            // Filter by category or favorites/recent
                            if (presetCategory === 'favorites') {
                                return favoritePresets.includes(p.id);
                            } else if (presetCategory === 'recent') {
                                return recentPresets.includes(p.id);
                            } else {
                                return p.category === presetCategory;
                            }
                        }).filter(p => {
                            if (!presetSearch) return true;
                            const translation = t.form.presets[p.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
                            const name = translation?.name || p.id;
                            return name.toLowerCase().includes(presetSearch.toLowerCase());
                        }).length === 0 && (
                                <div className="text-sm text-zinc-500 italic py-8 px-4 w-full text-center flex flex-col items-center gap-3">
                                    <div className="bg-zinc-900/50 p-3 rounded-full">
                                        {presetCategory === 'favorites' ? <Star size={20} className="text-zinc-700" /> : 
                                         presetCategory === 'recent' ? <History size={20} className="text-zinc-700" /> : 
                                         <Sparkles size={20} className="text-zinc-700" />}
                                    </div>
                                    {presetSearch ? `No presets found matching "${presetSearch}"` :
                                     presetCategory === 'favorites' ? 'No favorite presets yet. Click the star on any preset to add it!' :
                                     presetCategory === 'recent' ? 'No recent presets. Apply a preset to see it here!' :
                                     'No presets available'}
                                </div>
                            )}
                    </div>
                    {/* Fade gradient on right edge */}
                    <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-black/80 to-transparent pointer-events-none"></div>
                </div>
            </div>

            {/* Toolbar Actions Row */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-2">
                {/* Left side actions */}
                <div className="flex items-center gap-2">
                    {/* Live Preview Toggle */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${showPreview
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                            }`}
                    >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Preview</span>
                    </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    {/* History Toggle */}
                    <div className="relative" ref={historyRef}>
                        <button 
                            onClick={() => setShowHistory(!showHistory)} 
                            className="flex items-center gap-2 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-sm font-medium"
                            aria-label={t.form.actions.history}
                            aria-expanded={showHistory}
                        >
                            <History size={16} />
                            <span className="hidden sm:inline">{t.form.actions.history}</span>
                            {history.length > 0 && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{history.length}</span>}
                        </button>
                        {showHistory && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-bold text-zinc-300">{t.form.history.title}</h4>
                                    {history.length > 0 && <button 
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
                        )}
                    </div>

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
                </div>
            </div>

            {/* Live Preview Panel */}
            {showPreview && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Eye size={14} className="text-green-400" />
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Live Preview</span>
                    </div>
                    <p className="text-sm text-zinc-300 italic leading-relaxed">{getPreviewSummary()}</p>
                </div>
            )}

            {/* Main Card */}
            <div className="glass-panel rounded-xl overflow-hidden flex flex-col min-h-[600px] border border-white/5 relative">
                {/* Wizard Header (Steps) */}
                <div className="bg-black/20 border-b border-white/5 p-6 md:p-8 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-white/5 border border-white/5 text-amber-400 shadow-inner">{steps[currentStep - 1].icon}</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">{steps[currentStep - 1].title}</span>
                            </h2>
                            <p className="text-sm text-zinc-400 ml-1">{steps[currentStep - 1].desc}</p>
                        </div>
                        <div className="text-5xl font-black text-white/5 select-none">{currentStep}/5</div>
                    </div>
                    {/* Clickable Step Indicators */}
                    <div className="flex items-center justify-between gap-2">
                        {steps.map((s, index) => {
                            const fieldCount = getStepFieldCount(s.id);
                            const isActive = s.id === currentStep;
                            const isCompleted = s.id < currentStep;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setCurrentStep(s.id)}
                                    className={`relative flex-1 group transition-all duration-300 ${isActive ? 'scale-105' : 'hover:scale-[1.02]'}`}
                                >
                                    <div className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border transition-all duration-300 ${isActive
                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                        : isCompleted
                                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                            : 'bg-black/20 border-white/5 text-zinc-600 hover:border-white/10 hover:text-zinc-400'
                                        }`}>
                                        <span className={`text-xs font-bold ${isActive ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-zinc-600'
                                            }`}>
                                            {isCompleted ? <Check size={14} strokeWidth={3} /> : s.id}
                                        </span>
                                        <span className="text-xs font-medium hidden md:inline truncate tracking-wide">{s.title}</span>
                                        {fieldCount > 0 && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-zinc-500'
                                                }`}>
                                                {fieldCount}
                                            </span>
                                        )}
                                    </div>
                                    {/* Progress line connector */}
                                    {index < steps.length - 1 && (
                                        <div className={`absolute top-1/2 -right-1 w-2 h-0.5 transition-all duration-500 ${isCompleted ? 'bg-emerald-500/30' : 'bg-white/5'
                                            }`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {/* Keyboard hint */}
                    <p className="text-[10px] text-zinc-600 text-center mt-4 hidden md:block">{t.form.keyboardHint}</p>
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
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-black font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] order-last md:order-none"
                        >
                            <Wand2 size={18} /> {t.form.navigation.finish}
                        </button>

                        {currentStep < 5 && (
                            <button
                                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold transition-all flex items-center gap-2"
                            >
                                {t.form.navigation.next} {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* Result Section */}
            {/* Result Section */}
            {generated && (
                <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 scroll-mt-8">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Sparkles size={16} className="text-amber-500" />
                            {t.form.resultLabel}
                        </label>
                        <span className="text-xs text-zinc-600 font-mono">
                            {generated.length} / 1000
                        </span>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-8 relative group backdrop-blur-md">
                        <p className="text-sm md:text-base text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed break-words pe-20 selection:bg-amber-500/30 selection:text-amber-100">
                            {generated}
                        </p>
                        {/* Action buttons */}
                        <div className="absolute top-6 end-6 flex flex-col gap-2">
                            <button
                                onClick={handleCopy}
                                className="bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20 p-3 rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
                                title={t.form.copy}
                            >
                                {copied ? <Check size={16} className="text-emerald-400" /> : <IconCopy />}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20 p-3 rounded-xl transition-all backdrop-blur-md"
                                title={t.form.actions.download}
                            >
                                <Download size={16} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="bg-black/40 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20 p-3 rounded-xl transition-all backdrop-blur-md"
                                title={t.form.actions.share}
                            >
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Floating Mobile Generate Button */}
            <button
                onClick={handleGenerate}
                className="fixed bottom-6 right-6 md:hidden z-50 bg-gradient-to-r from-amber-500 to-orange-600 text-black p-4 rounded-full shadow-2xl shadow-amber-500/30 animate-in fade-in zoom-in duration-300 ring-4 ring-black/50"
                title={t.form.navigation.finish}
            >
                <Wand2 size={24} strokeWidth={2.5} />
            </button>

        </div>
    );
}
