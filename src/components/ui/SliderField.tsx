import React, { useState } from 'react';
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
    const [isDragging, setIsDragging] = useState(false);

    // Generate tick marks at 25% intervals
    const ticks = [0, 25, 50, 75, 100];

    return (
        <div className="flex flex-col gap-4 glass-card rounded-2xl p-5 hover:border-white/10 transition-all group noise-overlay">
            <div className="flex items-center justify-between relative">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                    <span className="text-amber-500/70 group-hover:text-amber-400 transition-colors icon-bounce">{icon}</span>
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
                    <div className={`absolute inset-0 bg-amber-500/30 blur-md transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    <span className={`relative text-sm font-bold text-amber-300 bg-gradient-to-r from-amber-500/20 to-amber-500/15 px-3 py-1 rounded-lg border border-amber-500/30 tabular-nums transition-all ${isDragging ? 'scale-110 shadow-lg shadow-amber-500/20' : ''}`}>
                        {value}
                    </span>
                </div>
            </div>

            <div className="relative h-4 group/slider py-0.5">
                {/* Track Background with gradient */}
                <div className="absolute inset-y-1 inset-x-0 rounded-full bg-gradient-to-r from-zinc-900 via-zinc-800/80 to-zinc-900 border border-white/[0.06] overflow-hidden shadow-inner" />

                {/* Tick marks */}
                <div className="absolute inset-y-1 inset-x-0">
                    {ticks.map((tick) => (
                        <div
                            key={tick}
                            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-white/10 rounded-full"
                            style={{ left: `${tick}%`, transform: `translateX(-50%) translateY(-50%)` }}
                        />
                    ))}
                </div>

                {/* Filled Track with multi-color gradient */}
                <div
                    className="absolute top-1 bottom-1 left-0 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-150 overflow-hidden shadow-lg shadow-amber-500/20"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Animated shine */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Custom Thumb */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-150 ${isDragging ? 'scale-125' : ''}`}
                    style={{ left: `${percentage}%` }}
                >
                    {/* Floating value tooltip */}
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-amber-300 text-xs font-bold rounded border border-amber-500/30 transition-all ${isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        {value}
                    </div>

                    {/* Outer glow ring */}
                    <div className={`absolute -inset-3 bg-amber-500/40 rounded-full blur-lg transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover/slider:opacity-80'}`} />

                    {/* Thumb */}
                    <div className={`relative w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 border-2 border-amber-200/60 transition-all ${isDragging ? 'shadow-amber-500/70' : 'group-hover/slider:scale-110 group-hover/slider:shadow-amber-500/60'}`}>
                        {/* Inner shine */}
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/50 to-transparent" />
                        {/* Inner dot */}
                        <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500" />
                    </div>
                </div>
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between text-[10px] text-zinc-600 font-medium px-1 -mt-1">
                <span className="tabular-nums">{min}</span>
                <span className="tabular-nums">{max}</span>
            </div>
        </div>
    );
};

