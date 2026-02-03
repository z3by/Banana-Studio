'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export function LandingContent() {
    const { t } = useLanguage();

    return (
        <div className="space-y-24 py-16">
            {/* Features Section */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                        {t.landing.features.title}
                    </h2>
                    <div className="h-1 w-24 bg-amber-500/30 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard
                        title={t.landing.features.professionalPresets.title}
                        desc={t.landing.features.professionalPresets.desc}
                        icon="✨"
                    />
                    <FeatureCard
                        title={t.landing.features.advancedControl.title}
                        desc={t.landing.features.advancedControl.desc}
                        icon="🎛️"
                    />
                    <FeatureCard
                        title={t.landing.features.culturalCompliance.title}
                        desc={t.landing.features.culturalCompliance.desc}
                        icon="🛡️"
                    />
                    <FeatureCard
                        title={t.landing.features.multiLanguage.title}
                        desc={t.landing.features.multiLanguage.desc}
                        icon="🌍"
                    />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10 space-y-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            {t.landing.howItWorks.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard
                            number="1"
                            title={t.landing.howItWorks.step1.title}
                            desc={t.landing.howItWorks.step1.desc}
                        />
                        <StepCard
                            number="2"
                            title={t.landing.howItWorks.step2.title}
                            desc={t.landing.howItWorks.step2.desc}
                        />
                        <StepCard
                            number="3"
                            title={t.landing.howItWorks.step3.title}
                            desc={t.landing.howItWorks.step3.desc}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-white">
                    {t.landing.faq.title}
                </h2>

                <div className="grid gap-4">
                    <FAQItem q={t.landing.faq.q1.q} a={t.landing.faq.q1.a} />
                    <FAQItem q={t.landing.faq.q2.q} a={t.landing.faq.q2.a} />
                    <FAQItem q={t.landing.faq.q3.q} a={t.landing.faq.q3.a} />
                    <FAQItem q={t.landing.faq.q4.q} a={t.landing.faq.q4.a} />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
    return (
        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/50 flex items-center justify-center font-bold text-xl">
                {number}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-lg font-medium text-amber-100 mb-2">{q}</h3>
            <p className="text-zinc-400 leading-relaxed">{a}</p>
        </div>
    );
}
