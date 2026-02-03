import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, PenLine } from 'lucide-react';
import { useDropdownPosition } from '@/hooks/use-dropdown-position';

interface MultiSelectFieldProps {
    label: string;
    value: string[];
    onChange: (val: string[]) => void;
    options: Record<string, string>;
    icon: React.ReactNode;
    placeholder?: string;
    addLabel?: string;

    description?: string;
    tooltip?: string;
}

export const MultiSelectField = ({ label, value, onChange, options, icon, placeholder = "Select...", addLabel = "Add", description, tooltip }: MultiSelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
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

    const getLabel = (val: string) => options[val] || val;

    const dropdownContent = isOpen && typeof document !== 'undefined' ? createPortal(
        <div
            ref={dropdownRef}
            className="z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150 dark-scrollbar"
            style={dropdownStyle}
        >
            <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/98 to-black/99 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden max-h-[200px] overflow-auto">
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="py-1.5">
                    {Object.entries(options).map(([k, v]) => {
                        if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                        const isSelected = value.includes(k);
                        return (
                            <button
                                key={k}
                                type="button"
                                onClick={() => { toggleValue(k); setInputValue(""); }}
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
                            key="custom-add"
                            type="button"
                            onClick={() => { onChange([...value, inputValue]); setInputValue(""); }}
                            className="w-full px-3.5 py-2.5 text-left text-sm text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 border-t border-white/[0.04] mx-1.5 rounded-lg"
                            style={{ width: 'calc(100% - 12px)' }}
                        >
                            <div className="p-1 rounded bg-amber-500/20">
                                <PenLine size={12} />
                            </div>
                            <span className="font-medium">{addLabel} &quot;{inputValue}&quot;</span>
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="space-y-2.5 group" ref={containerRef}>
            <div className="flex justify-between items-baseline px-1 mb-1.5">
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
            </div>
            <div className="relative">
                <div
                    ref={triggerRef}
                    onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
                    className={`w-full rounded-xl px-4 py-3 min-h-[48px] flex flex-wrap gap-2 cursor-text text-sm transition-all duration-300 ${value.length > 0
                        ? 'bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-amber-500/20 shadow-[0_0_20px_-8px_rgba(255,184,0,0.15)]'
                        : 'bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.03]'
                        } ${isOpen ? 'ring-2 ring-amber-500/20 border-amber-500/30' : ''}`}
                >
                    {value.length > 0 && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] to-transparent pointer-events-none rounded-xl" />}
                    {value.map((val) => (
                        <span
                            key={val}
                            className="group/pill relative inline-flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/10 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-500/25 transition-all hover:border-amber-500/40 hover:shadow-[0_0_12px_-3px_rgba(255,184,0,0.3)] z-10"
                        >
                            <span className="truncate max-w-[100px]">{getLabel(val)}</span>
                            <button
                                className="text-amber-400/60 hover:text-red-400 transition-colors p-0.5 -mr-1 rounded hover:bg-red-500/10"
                                onClick={(e) => { e.stopPropagation(); toggleValue(val); }}
                            >×</button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="bg-transparent outline-none flex-1 min-w-[60px] text-zinc-200 placeholder:text-zinc-500 h-6 text-sm relative z-10"
                        placeholder={value.length === 0 ? placeholder : ""}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
                {dropdownContent}
            </div>
        </div>
    );
};
