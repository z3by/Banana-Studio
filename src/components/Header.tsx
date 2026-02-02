'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b-0 rounded-none border-b border-white/5">
            <div className="flex items-center justify-between py-4 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-amber-500/20 relative z-10 group-hover:scale-105 transition-transform duration-300">
                            B
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-white/95 group-hover:text-amber-400 transition-colors">
                            Banana Studio
                        </h1>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold group-hover:text-zinc-400 transition-colors">
                            Professional Prompt Engineer
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all active:scale-95"
                    >
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>

                    <a href="https://github.com/z3by/Banana-Studio" target="_blank" rel="noopener noreferrer" className="ml-2 p-2 rounded-full text-zinc-500 hover:text-white transition-colors hover:bg-white/5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 3C6.77 2.1 4.05 1.1 2.37 1.5 1.7 1.83.95 2.16.2 2.5a5.5 5.5 0 0 0-1 3.5c-4.8 4.8-1 3.5-1 3.5 0 1.1 0 2 1.5" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                    </a>
                </div>
            </div>
        </header>
    );
}
