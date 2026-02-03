import React from 'react';
import { X, BookOpen, Camera, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface WizardGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WizardGuide = ({ isOpen, onClose }: WizardGuideProps) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const steps = [
        {
            title: t.guidance.steps.subject.title,
            desc: t.guidance.steps.subject.desc,
            icon: <User className="text-amber-400" size={24} />,
            color: "from-amber-500/20 to-orange-500/20",
            borderColor: "hover:border-amber-500/30"
        },
        {
            title: t.guidance.steps.scene.title,
            desc: t.guidance.steps.scene.desc,
            icon: <ImageIcon className="text-blue-400" size={24} />,
            color: "from-blue-500/20 to-cyan-500/20",
            borderColor: "hover:border-blue-500/30"
        },
        {
            title: t.guidance.steps.camera.title,
            desc: t.guidance.steps.camera.desc,
            icon: <Camera className="text-emerald-400" size={24} />,
            color: "from-emerald-500/20 to-teal-500/20",
            borderColor: "hover:border-emerald-500/30"
        },
        {
            title: t.guidance.steps.style.title,
            desc: t.guidance.steps.style.desc,
            icon: <Sparkles className="text-purple-400" size={24} />,
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "hover:border-purple-500/30"
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="orb orb-amber w-64 h-64 top-1/4 left-1/4" />
                <div className="orb orb-purple w-48 h-48 bottom-1/4 right-1/4" />
            </div>

            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel animate-spring-in noise-overlay">
                {/* Top shine line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

                {/* Header */}
                <div className="relative p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.03] via-white/[0.05] to-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500/15 rounded-xl border border-amber-500/20 animate-bounce-subtle">
                            <BookOpen className="text-amber-400" size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gradient-gold">{t.guidance.guideTitle}</h2>
                            <p className="text-xs text-zinc-500">{t.guidance.guideSubtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-zinc-400 hover:text-white hover:scale-110 active:scale-95"
                        aria-label="Close guide"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border border-white/5 bg-gradient-to-br ${step.color} ${step.borderColor} transition-all duration-300 group animate-spring-in stagger-${idx + 1} hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}
                            style={{ animationFillMode: 'backwards' }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-black/50 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/5">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-200 mb-1 flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-amber-500/60 bg-amber-500/10 px-1.5 py-0.5 rounded">0{idx + 1}</span>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-gradient-to-t from-zinc-950/80 to-transparent text-center">
                    <p className="text-xs text-zinc-500 mb-4 flex items-center justify-center gap-2">
                        <Sparkles size={12} className="text-amber-500/60" />
                        {t.guidance.proTip}
                    </p>
                    <button
                        onClick={onClose}
                        className="relative px-8 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:via-amber-300 hover:to-amber-400 text-black font-bold rounded-xl transition-all text-sm w-full md:w-auto shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] overflow-hidden shine-sweep"
                    >
                        <span className="relative z-10">{t.guidance.startCreating}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
