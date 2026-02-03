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
            className="z-[9999] glass-panel rounded-lg overflow-auto animate-in fade-in zoom-in-95 duration-100 dark-scrollbar border border-white/10 shadow-2xl"
            style={dropdownStyle}
        >
            {Object.entries(options).map(([k, v]) => {
                if (inputValue && !v.toLowerCase().includes(inputValue.toLowerCase()) && !k.toLowerCase().includes(inputValue.toLowerCase())) return null;
                const isSelected = value.includes(k);
                return (
                    <button key={k} type="button" onClick={() => { toggleValue(k); setInputValue(""); }} className={`px-4 py-2 text-sm flex items-center justify-between transition-all w-full text-left ${isSelected ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-300 hover:bg-white/5'}`}>
                        <span>{v}</span>
                        {isSelected && <Check size={14} />}
                    </button>
                );
            })}
            {inputValue && !Object.values(options).some((v: string) => v.toLowerCase() === inputValue.toLowerCase()) && (
                <button key="custom-add" type="button" onClick={() => { onChange([...value, inputValue]); setInputValue(""); }} className="px-4 py-2 text-sm text-blue-400 hover:bg-white/5 flex items-center gap-2 italic border-t border-white/5 w-full text-left">
                    <PenLine size={12} /> {addLabel} &quot;{inputValue}&quot;
                </button>
            )}
        </div>,
        document.body
    ) : null;

    return (
        <div className="space-y-1.5" ref={containerRef}>
            <div className="flex justify-between items-baseline px-1 mb-1.5">
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
                {description && <span className="text-[10px] text-zinc-600">{description}</span>}
            </div>
            <div className="relative">
                <div
                    ref={triggerRef}
                    onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
                    className={`w-full input-minimal rounded-lg p-2 min-h-[42px] flex flex-wrap gap-2 cursor-text text-sm transition-all ${isOpen ? 'ring-1 ring-amber-500/50 bg-white/10' : ''}`}
                >
                    {value.map((val) => (
                        <span key={val} className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-xs flex items-center gap-1 border border-amber-500/10">
                            {getLabel(val)}
                            <button className="hover:text-amber-100/70 p-0.5" onClick={(e) => { e.stopPropagation(); toggleValue(val); }}>×</button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="bg-transparent outline-none flex-1 min-w-[60px] text-zinc-200 placeholder:text-zinc-600 h-6 text-sm"
                        placeholder={value.length === 0 ? placeholder : ""}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
                {dropdownContent}
            </div>
        </div >
    );
};
