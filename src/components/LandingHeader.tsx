'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function LandingHeader() {
    const { t } = useLanguage();

    return (
        <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                {t.landing.title}
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
                {t.landing.subtitle}
            </p>
        </div>
    );
}
