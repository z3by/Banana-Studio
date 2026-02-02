import React, { useState, useEffect } from 'react';
import { Star, History, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { presets, Preset } from '@/lib/presets';

interface PresetSelectorProps {
    t: any;
    recentPresets: string[];
    favoritePresets: string[];
    onSelect: (preset: Preset) => void;
    onToggleFavorite: (presetId: string, e: React.MouseEvent) => void;
}

export const PresetSelector = ({
    t,
    recentPresets,
    favoritePresets,
    onSelect,
    onToggleFavorite
}: PresetSelectorProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('common');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categories = [
        { id: 'favorites', label: t.form.presets.favorites || 'Favorites', icon: Star, color: 'yellow' },
        { id: 'recent', label: t.form.presets.recent || 'Recent', icon: History, color: 'blue' },
        { id: 'common', label: t.form.presets.common, color: 'emerald' },
        { id: 'creative', label: t.form.presets.creative, color: 'purple' },
        { id: 'utility', label: t.form.presets.utility, color: 'cyan' },
    ];

    const filteredPresets = presets
        .filter(p => {
            if (category === 'favorites') return favoritePresets.includes(p.id);
            if (category === 'recent') return recentPresets.includes(p.id);
            return p.category === category;
        })
        .sort((a, b) => {
            if (category === 'recent') {
                return recentPresets.indexOf(a.id) - recentPresets.indexOf(b.id);
            }
            return 0;
        })
        .filter(p => {
            if (!search) return true;
            const translation = t.form.presets[p.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
            const name = translation?.name || p.id;
            const desc = translation?.desc || '';
            return name.toLowerCase().includes(search.toLowerCase()) ||
                desc.toLowerCase().includes(search.toLowerCase());
        });

    return (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 transition-all duration-500">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                            {t.form.presets.title || 'Quick Start Presets'}
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-zinc-300">
                                {presets.length}
                            </span>
                        </h2>
                        <p className="text-[10px] text-zinc-400">
                            {t.form.presets.description || 'Choose to instantly configure'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 transition-colors"
                >
                    {isOpen ? <ChevronLeft size={16} className="rotate-90" /> : <ChevronRight size={16} className="rotate-90" />}
                </button>
            </div>

            {/* Content */}
            {isOpen && (
                <div className="p-4 bg-black/10 animate-in slide-in-from-top-2 fade-in duration-300">

                    {/* Search & Tabs */}
                    <div className="flex flex-col gap-4 mb-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t.ui.search}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/30 transition-all pr-8"
                            />
                            {search ? (
                                <button onClick={() => setSearch('')} className="absolute right-2.5 top-2 text-zinc-500 hover:text-white">
                                    <X size={12} />
                                </button>
                            ) : (
                                <Sparkles size={12} className="absolute right-2.5 top-2.5 text-zinc-600" />
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`
                                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                                        ${category === cat.id
                                            ? `bg-${cat.color}-500/20 text-${cat.color}-400 border border-${cat.color}-500/20`
                                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'}
                                    `}
                                >
                                    {cat.icon ? <cat.icon size={12} className={category === cat.id ? `text-${cat.color}-400` : ''} /> : <div className={`w-1.5 h-1.5 rounded-full bg-${cat.color}-400`} />}
                                    {cat.label}
                                    {mounted && cat.id === 'favorites' && favoritePresets.length > 0 && <span className="opacity-50 ml-0.5">({favoritePresets.length})</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                        {filteredPresets.map(preset => {
                            const translation = t.form.presets[preset.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
                            const name = translation?.name || preset.id;
                            const desc = translation?.desc || '';
                            const isFav = favoritePresets.includes(preset.id);

                            let colorClass = 'border-emerald-500/20 from-emerald-900/20 to-emerald-900/5 hover:border-emerald-500/40';
                            if (preset.category === 'creative') colorClass = 'border-purple-500/20 from-purple-900/20 to-purple-900/5 hover:border-purple-500/40';
                            if (preset.category === 'utility') colorClass = 'border-cyan-500/20 from-cyan-900/20 to-cyan-900/5 hover:border-cyan-500/40';

                            return (
                                <div
                                    key={preset.id}
                                    onClick={() => onSelect(preset)}
                                    className={`
                                        group relative flex flex-col items-center gap-2 p-3 rounded-xl border bg-gradient-to-br ${colorClass} 
                                        cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]
                                    `}
                                >
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(preset.id, e); }}
                                        className={`absolute top-1.5 right-1.5 p-1 rounded-md transition-all ${isFav ? 'text-yellow-400 opacity-100' : 'text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-black/40'}`}
                                    >
                                        <Star size={12} className={isFav ? 'fill-yellow-400' : ''} />
                                    </button>

                                    <div className="text-2xl mt-1">{preset.icon}</div>
                                    <div className="text-center w-full">
                                        <div className="text-[11px] font-bold text-zinc-200 truncate leading-tight mb-0.5">{name}</div>
                                        <div className="text-[9px] text-zinc-500 truncate leading-tight group-hover:text-zinc-400">{desc}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredPresets.length === 0 && (
                            <div className="col-span-full py-8 text-center text-zinc-500 text-xs italic">
                                {search ? 'No matches found' : 'No presets in this category'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
