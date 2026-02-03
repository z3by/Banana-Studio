'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 rounded-none shadow-none backdrop-blur-xl bg-black/40">
            <div className="flex items-center justify-between py-4 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 group cursor-pointer select-none">
                    <div className="relative group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-amber-500/30 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-glow"></div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20 relative z-10 border border-amber-200/20">
                            B
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400 group-hover:text-gradient-gold transition-all duration-300">
                            Banana Prompt
                        </h1>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold group-hover:text-amber-500/80 transition-colors duration-300">
                            Professional AI Studio
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="glass-card px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:border-amber-500/30 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>
                </div>
            </div>
        </header>
    );
}
