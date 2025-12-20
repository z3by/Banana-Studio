'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 bg-black/50">
            <div className="flex items-center justify-between py-4 px-4 md:px-8 max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-gradient-gold">
                        Banana Studio
                    </h1>
                </div>

                <button
                    onClick={toggleLanguage}
                    className="px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-zinc-300 hover:text-white"
                >
                    {language === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
        </header>
    );
}
