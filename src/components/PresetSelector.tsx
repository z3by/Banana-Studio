import React, { useState, useEffect } from 'react';
import { Star, History, Sparkles, ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [category, search]);

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
                    {/* Pagination Logic */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {filteredPresets.slice((currentPage - 1) * 12, currentPage * 12).map(preset => {
                                const translation = t.form.presets[preset.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
                                const name = translation?.name || preset.id;
                                const desc = translation?.desc || '';
                                const isFav = favoritePresets.includes(preset.id);

                                // Use provided image or fallback to placeholder
                                const imageUrl = preset.images?.after || '/placeholder-preset.png';

                                let accentColor = 'emerald';
                                if (preset.category === 'creative') accentColor = 'purple';
                                if (preset.category === 'utility') accentColor = 'cyan';

                                return (
                                    <div
                                        key={preset.id}
                                        onClick={() => onSelect(preset)}
                                        className={`
                                            group relative flex flex-col rounded-xl overflow-hidden
                                            border border-white/5 bg-black/40
                                            cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-${accentColor}-500/30 hover:shadow-lg hover:shadow-${accentColor}-900/10
                                        `}
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 group-hover:brightness-110 transition-all">
                                            <img
                                                src={imageUrl}
                                                alt={name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                            {/* Favorite Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(preset.id, e); }}
                                                className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md bg-black/20 border border-white/10 transition-all ${isFav ? 'text-yellow-400 opacity-100' : 'text-white/60 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-black/50'}`}
                                            >
                                                <Star size={12} className={isFav ? 'fill-yellow-400' : ''} />
                                            </button>

                                            {/* Icon (Optional overlay) */}
                                            <div className="absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-md bg-black/20 border border-white/10 text-lg leading-none">
                                                {preset.icon}
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                                            <div className="text-xs font-bold text-zinc-100 truncate leading-tight mb-0.5">{name}</div>
                                            <div className="text-[10px] text-zinc-400 truncate leading-tight group-hover:text-zinc-300 transition-colors">{desc}</div>
                                        </div>

                                        {/* Active State Border */}
                                        <div className={`absolute inset-0 border-2 border-${accentColor}-500/0 group-hover:border-${accentColor}-500/50 rounded-xl pointer-events-none transition-all duration-300`} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {filteredPresets.length > 12 && (
                            <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                                >
                                    <ChevronLeft size={14} />
                                    {t.ui?.previous || 'Previous'}
                                </button>

                                <span className="text-[10px] text-zinc-500 font-mono">
                                    {currentPage} / {Math.ceil(filteredPresets.length / 12)}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredPresets.length / 12), p + 1))}
                                    disabled={currentPage === Math.ceil(filteredPresets.length / 12)}
                                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                                >
                                    {t.ui?.next || 'Next'}
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {filteredPresets.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-zinc-500 gap-3">
                            <ImageIcon size={24} className="opacity-20" />
                            <div className="text-xs italic">
                                {search ? 'No matches found' : 'No presets in this category'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
