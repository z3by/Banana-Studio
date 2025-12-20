'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function Header() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="flex items-center justify-between py-6 px-4 md:px-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    Banana Studio
                </h1>
            </div>

            <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-full border border-zinc-800 hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
                {language === 'en' ? 'العربية' : 'English'}
            </button>
        </header>
    );
}
