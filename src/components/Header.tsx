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
                            Banana Prompt
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


                </div>
            </div>
        </header>
    );
}
