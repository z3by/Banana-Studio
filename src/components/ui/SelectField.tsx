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
            className="z-[9999] glass-panel rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 dark-scrollbar"
            style={dropdownStyle}
        >
            <div className="p-2 sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/5 z-10">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-white/5 border border-transparent rounded-md px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:bg-white/10 transition-colors"
                    placeholder={searchPlaceholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            <div className="max-h-[200px] overflow-auto">
                {Object.entries(options).map(([k, v]) => {
                    if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                    const isSelected = value === k;
                    return (
                        <button key={k} type="button" onClick={() => handleSelect(k)} className={`px-4 py-2 text-sm flex items-center justify-between transition-colors w-full text-left ${isSelected ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-300 hover:bg-white/5'}`}>
                            <span>{v}</span>
                            {isSelected && <Check size={14} />}
                        </button>
                    );
                })}
                {inputValue && !Object.values(options).some((v: string) => v.toLowerCase() === inputValue.toLowerCase()) && (
                    <button key="custom-use" type="button" onClick={() => handleSelect(inputValue)} className="px-4 py-2 text-sm text-blue-400 hover:bg-white/5 flex items-center gap-2 italic border-t border-white/5 w-full text-left">
                        <PenLine size={12} /> {useLabel} &quot;{inputValue}&quot;
                    </button>
                )}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="space-y-1.5 group" ref={containerRef}>
            <div className="flex justify-between items-center px-1">
                <label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5 uppercase tracking-wide">
                    {icon} {label}
                    {tooltip && (
                        <div className="group/tooltip relative">
                            <div className="cursor-help text-zinc-600 hover:text-zinc-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-zinc-200 text-[10px] rounded border border-white/10 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
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
                            className="w-full input-minimal rounded-lg px-3 py-2.5 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={manualPlaceholder}
                        />
                        <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-zinc-600"><PenLine size={12} /></div>
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
                        className={`w-full input-minimal rounded-lg px-3 py-2.5 flex justify-between items-center cursor-pointer text-sm transition-all ${isOpen ? 'ring-1 ring-amber-500/50 bg-white/10' : ''}`}
                    >
                        <span className={`truncate ${!value ? 'text-zinc-600' : 'text-zinc-200'}`}>
                            {value ? getLabel(value) : placeholder}
                        </span>
                        <ChevronsUpDown size={14} className="text-zinc-600" />
                    </div>
                )}
                {dropdownContent}
            </div>
        </div>
    );
};
