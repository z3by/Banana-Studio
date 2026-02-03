import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, History, Sparkles, ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react';
import { presets, Preset } from '@/lib/presets';
import { translations } from '@/i18n/translations';

interface PresetSelectorProps {
    t: typeof translations['en'];
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
    const [category, setCategory] = useState('portrait');
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Reset page when category or search changes - this is a legitimate use case
    // for setting state in an effect to reset dependent state
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [category, search]);

    const categories = [
        { id: 'favorites', label: t.form.presets.favorites || 'Favorites', icon: Star, color: 'amber' },
        { id: 'recent', label: t.form.presets.recent || 'Recent', icon: History, color: 'blue' },
        { id: 'portrait', label: t.form.presets.portrait || 'Portrait', color: 'rose' },
        { id: 'lifestyle', label: t.form.presets.lifestyle || 'Lifestyle', color: 'emerald' },
        { id: 'event', label: t.form.presets.event || 'Events', color: 'pink' },
        { id: 'outdoor', label: t.form.presets.outdoor || 'Outdoor', color: 'green' },
        { id: 'professional', label: t.form.presets.professional || 'Professional', color: 'blue' },
        { id: 'artistic', label: t.form.presets.artistic || 'Artistic', color: 'purple' },
        { id: 'fantasy', label: t.form.presets.fantasy || 'Fantasy', color: 'violet' },
        { id: 'tools', label: t.form.presets.tools || 'Quick Tools', color: 'cyan' },
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
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-500 relative">
            {/* Subtle Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/[0.04] bg-gradient-to-r from-black/30 via-black/20 to-black/30 relative">
                <div className="flex items-center gap-4">
                    {/* Icon with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-500/30 blur-xl opacity-60 animate-pulse" />
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-500/15 to-amber-600/10 text-amber-400 border border-amber-500/20">
                            <Sparkles size={20} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                            {t.form.presets.title || 'Quick Start Presets'}
                            <span className="text-[10px] bg-gradient-to-r from-white/10 to-white/5 px-2 py-0.5 rounded-full text-zinc-300 font-medium">
                                {presets.length}
                            </span>
                        </h2>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                            {t.form.presets.description || 'Choose to instantly configure'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all duration-300"
                >
                    <ChevronLeft size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
                </button>
            </div>

            {/* Content */}
            {isOpen && (
                <div className="p-5 bg-gradient-to-b from-black/20 to-black/5 animate-in slide-in-from-top-2 fade-in duration-300">

                    {/* Search & Tabs */}
                    <div className="flex flex-col gap-4 mb-5">
                        {/* Search */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder={t.ui.search}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/40 focus:bg-black/60 focus:ring-2 focus:ring-amber-500/10 transition-all pr-10 placeholder:text-zinc-600"
                            />
                            {search ? (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-zinc-500 hover:text-amber-400 transition-colors p-0.5">
                                    <X size={14} />
                                </button>
                            ) : (
                                <Sparkles size={14} className="absolute right-3.5 top-3 text-zinc-600 group-focus-within:text-amber-500/50 transition-colors" />
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="relative">
                            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {categories.map(cat => {
                                    const isActive = category === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={`
                                                relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 overflow-hidden
                                                ${isActive
                                                    ? 'text-amber-300 border border-amber-500/30'
                                                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-white/5 hover:bg-white/[0.02]'}
                                            `}
                                        >
                                            {/* Active Background */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/5" />
                                            )}
                                            <span className="relative flex items-center gap-2">
                                                {cat.icon ? <cat.icon size={13} className={isActive ? 'text-amber-400' : ''} /> : <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400' : 'bg-zinc-600'}`} />}
                                                {cat.label}
                                                {mounted && cat.id === 'favorites' && favoritePresets.length > 0 && (
                                                    <span className={`text-[10px] ${isActive ? 'text-amber-400/70' : 'text-zinc-600'}`}>({favoritePresets.length})</span>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Right fade */}
                            <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-black/60 to-transparent pointer-events-none z-10 md:hidden" />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredPresets.slice((currentPage - 1) * 12, currentPage * 12).map(preset => {
                                const translation = t.form.presets[preset.id as keyof typeof t.form.presets] as { name: string; desc: string } | undefined;
                                const name = translation?.name || preset.id;
                                const desc = translation?.desc || '';
                                const isFav = favoritePresets.includes(preset.id);

                                const imageUrl = preset.images?.after || '/placeholder-preset.png';

                                return (
                                    <div
                                        key={preset.id}
                                        onClick={() => onSelect(preset)}
                                        className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] border border-white/[0.04] hover:border-amber-500/30 bg-gradient-to-b from-white/[0.02] to-transparent"
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                                            <Image
                                                src={imageUrl}
                                                alt={name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

                                            {/* Top Shine on Hover */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Favorite Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(preset.id, e); }}
                                                className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isFav
                                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20'
                                                    : 'bg-black/30 text-white/50 border border-white/10 opacity-0 group-hover:opacity-100 hover:text-amber-400 hover:bg-black/50 hover:border-amber-500/30'
                                                    }`}
                                            >
                                                <Star size={12} className={isFav ? 'fill-amber-400' : ''} />
                                            </button>

                                            {/* Emoji Icon */}
                                            <div className="absolute top-2.5 left-2.5 p-2 rounded-lg backdrop-blur-md bg-black/30 border border-white/10 text-base leading-none shadow-lg">
                                                {preset.icon}
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3.5 pt-8 bg-gradient-to-t from-black via-black/95 to-transparent">
                                            <div className="text-sm font-bold text-zinc-100 truncate leading-tight mb-1 group-hover:text-amber-100 transition-colors duration-300">{name}</div>
                                            <div className="text-[11px] text-zinc-500 truncate leading-tight group-hover:text-zinc-400 transition-colors duration-300">{desc}</div>
                                        </div>

                                        {/* Hover Glow Border */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-amber-500/20" />

                                        {/* Bottom Glow */}
                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {filteredPresets.length > 12 && (
                            <div className="flex items-center justify-between px-2 pt-4 border-t border-white/[0.04]">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-all duration-300 group px-3 py-1.5 rounded-lg hover:bg-white/5"
                                >
                                    <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                                    {t.ui?.previous || 'Previous'}
                                </button>

                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: Math.ceil(filteredPresets.length / 12) }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === i + 1
                                                ? 'bg-amber-500 w-6'
                                                : 'bg-zinc-700 hover:bg-zinc-600'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredPresets.length / 12), p + 1))}
                                    disabled={currentPage === Math.ceil(filteredPresets.length / 12)}
                                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 transition-all duration-300 group px-3 py-1.5 rounded-lg hover:bg-white/5"
                                >
                                    {t.ui?.next || 'Next'}
                                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                    {filteredPresets.length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center text-zinc-600 gap-4">
                            <div className="p-4 rounded-full bg-white/[0.02] border border-white/5">
                                <ImageIcon size={28} className="opacity-30" />
                            </div>
                            <div className="text-sm">
                                {search ? 'No matches found' : 'No presets in this category'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
