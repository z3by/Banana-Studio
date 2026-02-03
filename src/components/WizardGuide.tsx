import React from 'react';
import { X, BookOpen, Camera, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface WizardGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WizardGuide = ({ isOpen, onClose }: WizardGuideProps) => {
    const { t, language } = useLanguage();
    const isRTL = language === 'ar';

    if (!isOpen) return null;

    const steps = [
        {
            title: t.guidance.steps.subject.title,
            desc: t.guidance.steps.subject.desc,
            icon: <User className="text-amber-400" size={24} />,
            color: "from-amber-500/20 to-orange-500/20"
        },
        {
            title: t.guidance.steps.scene.title,
            desc: t.guidance.steps.scene.desc,
            icon: <ImageIcon className="text-blue-400" size={24} />,
            color: "from-blue-500/20 to-cyan-500/20"
        },
        {
            title: t.guidance.steps.camera.title,
            desc: t.guidance.steps.camera.desc,
            icon: <Camera className="text-emerald-400" size={24} />,
            color: "from-emerald-500/20 to-teal-500/20"
        },
        {
            title: t.guidance.steps.style.title,
            desc: t.guidance.steps.style.desc,
            icon: <Sparkles className="text-purple-400" size={24} />,
            color: "from-purple-500/20 to-pink-500/20"
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <BookOpen className="text-amber-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-100">{t.guidance.guideTitle}</h2>
                            <p className="text-xs text-zinc-500">{t.guidance.guideSubtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border border-white/5 bg-gradient-to-br ${step.color} hover:border-white/10 transition-all group`}>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-black/40 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-200 mb-1 flex items-center gap-2">
                                        <span className="text-xs font-mono opacity-50">0{idx + 1}</span>
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
                <div className="p-6 border-t border-white/5 bg-zinc-950/50 text-center">
                    <p className="text-xs text-zinc-500 mb-4">{t.guidance.proTip}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-sm w-full md:w-auto"
                    >
                        {t.guidance.startCreating}
                    </button>
                </div>
            </div>
        </div>
    );
};
