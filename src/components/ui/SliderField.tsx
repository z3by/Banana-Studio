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

export const SliderField = ({ label, value, onChange, min, max, icon, tooltip }: SliderFieldProps) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col gap-4 glass-card rounded-2xl p-5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                    <span className="text-amber-500/70 group-hover:text-amber-400 transition-colors">{icon}</span>
                    <span>{label}</span>
                    {tooltip && (
                        <div className="relative group/tooltip">
                            <Info size={14} className="text-zinc-600 hover:text-zinc-400 cursor-help transition-colors" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 backdrop-blur-md border border-white/10 text-zinc-200 text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </label>
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-sm font-bold text-amber-300 bg-gradient-to-r from-amber-500/15 to-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/25 tabular-nums">
                        {value}
                    </span>
                </div>
            </div>

            <div className="relative h-3 group/slider">
                {/* Track Background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-zinc-900 via-zinc-800/80 to-zinc-900 border border-white/[0.04] overflow-hidden" />

                {/* Filled Track */}
                <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-150 overflow-hidden"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shine */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-80" />
                </div>

                {/* Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Custom Thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-150"
                    style={{ left: `${percentage}%` }}
                >
                    {/* Outer glow ring */}
                    <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-md opacity-0 group-hover/slider:opacity-100 transition-opacity" />

                    {/* Thumb */}
                    <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/40 border-2 border-amber-200/50 group-hover/slider:scale-110 group-hover/slider:shadow-amber-500/60 transition-all">
                        {/* Inner shine */}
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                    </div>
                </div>
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between text-[10px] text-zinc-600 font-medium px-1 -mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};
