'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md">
            <div className="flex items-center justify-between py-4 px-4 md:px-8 max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold tracking-tight text-white">
                        Banana Studio
                    </h1>
                </div>

                <button
                    onClick={toggleLanguage}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm text-zinc-400 hover:text-white"
                >
                    {language === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
        </header>
    );
}
