import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, PenLine, List, Keyboard, ChevronsUpDown } from 'lucide-react';
import { useDropdownPosition } from '@/hooks/use-dropdown-position';

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: Record<string, string>;
    icon: React.ReactNode;
    placeholder?: string;
    searchPlaceholder?: string;
    manualPlaceholder?: string;
    useLabel?: string;

    description?: string;
    tooltip?: string;
}

export const SelectField = ({ label, value, onChange, options, icon, placeholder = "Select...", searchPlaceholder = "Search...", manualPlaceholder = "Type anything...", useLabel = "Use", description, tooltip }: SelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isManual, setIsManual] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownStyle = useDropdownPosition(isOpen, triggerRef);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!isOpen) return;
            const target = e.target as Node;
            const clickedInsideContainer = containerRef.current?.contains(target);
            const clickedInsideDropdown = dropdownRef.current?.contains(target);
            if (!clickedInsideContainer && !clickedInsideDropdown) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const handleSelect = (key: string) => {
        onChange(key);
        setIsOpen(false);
        setInputValue("");
    };

    const getLabel = (val: string) => options[val] || val;

    const dropdownContent = isOpen && typeof document !== 'undefined' ? createPortal(
        <div
            ref={dropdownRef}
            className="z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150 dark-scrollbar"
            style={dropdownStyle}
        >
            <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/98 to-black/99 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="p-3 sticky top-0 bg-black/40 backdrop-blur-md border-b border-white/[0.04] z-10">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:bg-white/[0.05] focus:border-amber-500/30 transition-all"
                        placeholder={searchPlaceholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                <div className="max-h-[200px] overflow-auto py-1.5">
                    {Object.entries(options).map(([k, v]) => {
                        if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                        const isSelected = value === k;
                        return (
                            <button
                                key={k}
                                type="button"
                                onClick={() => handleSelect(k)}
                                className={`relative w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-all duration-200 mx-1.5 rounded-lg overflow-hidden group/option
                                    ${isSelected ? 'text-amber-300' : 'text-zinc-300 hover:text-white'}`}
                                style={{ width: 'calc(100% - 12px)' }}
                            >
                                <div className={`absolute inset-0 transition-opacity duration-200 ${isSelected
                                        ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent opacity-100'
                                        : 'bg-white/[0.04] opacity-0 group-hover/option:opacity-100'
                                    }`} />
                                <span className="truncate relative font-medium">{v}</span>
                                {isSelected && <Check size={14} className="text-amber-400 flex-shrink-0 relative" />}
                            </button>
                        );
                    })}
                    {inputValue && !Object.values(options).some((v: string) => v.toLowerCase() === inputValue.toLowerCase()) && (
                        <button
                            key="custom-use"
                            type="button"
                            onClick={() => handleSelect(inputValue)}
                            className="w-full px-3.5 py-2.5 text-left text-sm text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 border-t border-white/[0.04] mx-1.5 rounded-lg"
                            style={{ width: 'calc(100% - 12px)' }}
                        >
                            <div className="p-1 rounded bg-amber-500/20">
                                <PenLine size={12} />
                            </div>
                            <span className="font-medium">{useLabel} &quot;{inputValue}&quot;</span>
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="space-y-2.5 group" ref={containerRef}>
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                    <span className="text-amber-500/70 group-hover:text-amber-400 transition-colors">{icon}</span>
                    <span>{label}</span>
                    {tooltip && (
                        <div className="group/tooltip relative">
                            <div className="cursor-help text-zinc-600 hover:text-zinc-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-black/95 text-zinc-200 text-[10px] rounded-lg border border-white/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </label>
                {description && <span className="text-[10px] text-zinc-500">{description}</span>}
                <button
                    onClick={() => { setIsManual(!isManual); setIsOpen(false); }}
                    className="text-[10px] text-zinc-600 hover:text-amber-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={isManual ? "Switch to List" : "Switch to Manual Input"}
                >
                    {isManual ? <List size={12} /> : <Keyboard size={12} />}
                </button>
            </div>

            <div className="relative">
                {isManual ? (
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.06] rounded-xl px-4 py-3 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 transition-all"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={manualPlaceholder}
                        />
                        <div className="absolute inset-y-0 end-4 flex items-center pointer-events-none text-zinc-600"><PenLine size={14} /></div>
                    </div>
                ) : (
                    <div
                        ref={triggerRef}
                        onClick={() => {
                            setIsOpen(!isOpen);
                            if (!isOpen && !isManual) {
                                setInputValue("");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }
                        }}
                        className={`w-full rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer text-sm transition-all duration-300 ${value
                                ? 'bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-amber-500/20 shadow-[0_0_20px_-8px_rgba(255,184,0,0.15)]'
                                : 'bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.03]'
                            } ${isOpen ? 'ring-2 ring-amber-500/20 border-amber-500/30' : ''}`}
                    >
                        {value && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] to-transparent pointer-events-none rounded-xl" />}
                        <span className={`truncate relative ${!value ? 'text-zinc-500 opacity-60' : 'text-zinc-100 font-medium'}`}>
                            {value ? getLabel(value) : placeholder}
                        </span>
                        <ChevronsUpDown size={16} className={`relative text-zinc-500 transition-colors ${isOpen ? 'text-amber-400' : ''}`} />
                    </div>
                )}
                {dropdownContent}
            </div>
        </div>
    );
};
