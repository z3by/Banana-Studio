'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between py-4 px-4 md:px-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-amber-500/20">
                        B
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight text-white/90">
                        Banana Studio
                    </h1>
                </div>

                <button
                    onClick={toggleLanguage}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    {language === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
        </header>
    );
}
