'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-2xl" />

            {/* Aurora Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-60" />

            {/* Subtle bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="relative flex items-center justify-between py-4 px-4 md:px-6 max-w-7xl mx-auto">
                {/* Logo & Brand */}
                <div className="flex items-center gap-4 group cursor-pointer select-none">
                    {/* Logo Icon with enhanced glow */}
                    <div className="relative group-hover:scale-105 transition-all duration-500">
                        {/* Outer pulsing ring */}
                        <div className="absolute -inset-3 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-700 rounded-full animate-pulse"></div>

                        {/* Inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 to-amber-600/20 blur-xl opacity-50 group-hover:opacity-90 transition-all duration-500 rounded-xl animate-pulse-glow"></div>

                        {/* Logo Icon */}
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-xl shadow-amber-500/30 border border-amber-300/30 group-hover:shadow-amber-500/50 group-hover:from-amber-100 group-hover:via-amber-300 group-hover:to-amber-500 transition-all duration-500 overflow-hidden">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60" />
                            <span className="relative drop-shadow-sm font-black">B</span>
                        </div>
                    </div>

                    {/* Brand Text */}
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-300 group-hover:from-amber-100 group-hover:via-amber-300 group-hover:to-amber-500 transition-all duration-500">
                            Banana Prompt
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-amber-500/60 animate-pulse"></div>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold group-hover:text-amber-500/60 transition-colors duration-500">
                                AI Studio
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="relative overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all duration-300 group/btn"
                    >
                        {/* Button Background */}
                        <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.06] rounded-xl group-hover/btn:bg-white/[0.04] group-hover/btn:border-amber-500/20 transition-all duration-300" />

                        {/* Hover glow */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5" />
                            <div className="absolute -inset-2 bg-amber-500/10 blur-xl" />
                        </div>

                        {/* Content */}
                        <div className="relative flex items-center gap-2.5">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/50"></div>
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-30"></div>
                            </div>
                            <span className="font-semibold">{language === 'en' ? 'العربية' : 'English'}</span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
