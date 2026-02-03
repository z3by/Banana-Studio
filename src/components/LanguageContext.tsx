'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/i18n/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (typeof translations)['en'];
    dir: 'ltr' | 'rtl';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Use lazy initialization to read from localStorage during initial state
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('banana_language');
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
                return savedLanguage as Language;
            }
        }
        return 'en';
    });

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('banana_language', lang);
    };

    const t = translations[language];
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [dir, language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: t as (typeof translations)['en'], dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
