import React from 'react';
import { Info } from 'lucide-react';

interface SliderFieldProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    icon: React.ReactNode;
    tooltip?: string;
}

export const SliderField = ({ label, value, onChange, min, max, icon, tooltip }: SliderFieldProps) => (
    <div className="space-y-3 group glass-card p-4 rounded-lg">
        <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
                {icon} {label}
                {tooltip && (
                    <div className="relative group/tooltip">
                        <Info size={14} className="text-zinc-500 hover:text-zinc-300 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                            {tooltip}
                        </div>
                    </div>
                )}
            </span>
            <span className="text-amber-400 font-mono text-xs">{value}</span>
        </label>
        <div className="relative py-1">
            <input
                type="range" min={min} max={max} value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-700/50 rounded-full appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
            />
            <div className="absolute -bottom-3 left-0 right-0 flex justify-between text-[8px] text-zinc-600 font-mono uppercase"><span>{min}</span><span>{max}</span></div>
        </div>
    </div>
);
