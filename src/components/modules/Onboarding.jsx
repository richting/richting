import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Search, Heart, Target, Zap, CheckCircle2, HelpCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Scout from '../ui/Scout';
import { useScout } from '../../hooks/useScout';
import { scoutMessages } from '../../utils/scoutMessages';

const Onboarding = () => {
    const { nextStep, setStep, setLoginMode } = useStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const { say } = useScout();

    // Scout messages for each slide
    useEffect(() => {
        switch (currentSlide) {
            case 0:
                say(scoutMessages.onboarding.welcome, 'happy');
                setTimeout(() => {
                    say("Ik help je jouw ideale carrière te vinden! 🦅", 'neutral');
                }, 3000);
                break;
            case 1:
                say("We leren je eerst goed kennen, daarna ontdek je wat past! 🎯", 'thinking');
                break;
            case 2:
                say(scoutMessages.onboarding.timeInfo, 'neutral');
                break;
        }
    }, [currentSlide, say]);

    const handleLoginClick = () => {
        setLoginMode(true);
        setStep(5); // Go to AuthScreen (Step 5)
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => prev + 1);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => prev - 1);
    };

    const startApp = () => {
        say(scoutMessages.onboarding.letsDo, 'celebrating');
        setTimeout(() => {
            nextStep(); // Goes to VibeSwipe (Step 1)
        }, 1500);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-md mx-auto px-6 overflow-hidden relative">

            {/* Scout Mascot */}
            <Scout />

            {/* Login Button */}
            <motion.div
                className="absolute top-4 right-4 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <button
                    onClick={handleLoginClick}
                    className="text-sm font-medium text-gray-500 hover:text-blue-600 px-3 py-1 rounded-full transition-colors"
                >
                    Inloggen
                </button>
            </motion.div>

            {/* Slide Indicators */}
            <div className="absolute top-12 flex space-x-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`h-1 rounded-full transition-colors duration-300 ${i <= currentSlide ? 'bg-blue-600' : 'bg-gray-200'}`}
                        initial={{ width: 8 }}
                        animate={{ width: i === currentSlide ? 24 : 8 }}
                    />
                ))}
            </div>

            <AnimatePresence initial={false} mode='wait'>

                {/* SLIDE 0: WELKOM + DE VRAAG */}
                {currentSlide === 0 && (
                    <motion.div
                        key="slide0"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full flex flex-col items-center text-center mt-10"
                    >
                        <div className="bg-blue-50 p-6 rounded-full mb-6">
                            <Sparkles className="w-12 h-12 text-blue-600" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Welkom bij <span className="text-blue-600">Richting</span>
                        </h1>

                        <p className="text-gray-500 text-sm mb-10">
                            Je persoonlijke carrière-gids
                        </p>

                        {/* De Vraag - subtiel probleem aankaarten */}
                        <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 text-left border border-blue-100">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="bg-white p-2 rounded-lg shrink-0">
                                    <HelpCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        Weet jij al welke richting je op wilt?
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Voor veel jongeren is dit de <strong>moeilijkste vraag</strong>.
                                        Eindeloze lijsten met banen helpen niet. Persoonlijkheidstesten zonder
                                        opvolging ook niet.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-blue-100">
                                <p className="text-sm text-gray-800 font-medium mb-2">
                                    🎯 Wij helpen je anders
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Je leert jezelf eerst <strong>echt kennen</strong>, en ontdekt daarna
                                    welke banen bij <strong>jou als persoon</strong> passen. Geen scrollen,
                                    maar gerichte voorstellen.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center group"
                        >
                            Hoe werkt het?
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {/* SLIDE 1: HOE HET WERKT (2 DELEN) - de oplossing in actie */}
                {currentSlide === 1 && (
                    <motion.div
                        key="slide1"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full flex flex-col items-center text-center mt-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Hoe vind je jouw richting?
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            In 2 stappen van onzekerheid naar duidelijkheid
                        </p>

                        {/* Deel 1: Profiel Opbouwen */}
                        <div className="w-full bg-white border-2 border-blue-200 rounded-2xl p-5 mb-4 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                Je bent hier
                            </div>
                            <div className="flex items-start gap-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                                    <Heart className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">
                                        Stap 1: Leer jezelf kennen
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        We ontdekken samen wie jij bent
                                    </p>
                                </div>
                            </div>
                            <div className="pl-11 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Wat trekt jouw aandacht?</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Hoe werk jij als persoon?</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Wat vind je belangrijk?</span>
                                </div>
                            </div>
                            <div className="mt-3 pl-11 text-xs text-gray-400">
                                ⏱️ Duurt 30-40 minuten
                            </div>
                        </div>

                        {/* Pijl naar beneden */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-gray-100 rounded-full p-2">
                                <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                            </div>
                        </div>

                        {/* Deel 2: Banen Verkennen */}
                        <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 mb-6 text-left">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                                    <Target className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">
                                        Stap 2: Ontdek wat past
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Jouw persoonlijke banenmatches
                                    </p>
                                </div>
                            </div>
                            <div className="pl-11 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <span>Krijg voorstellen op basis van jouw profiel</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Search className="w-4 h-4 text-blue-500" />
                                    <span>Verdiep je in banen die interessant zijn</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Maak een afgewogen keuze voor je toekomst</span>
                                </div>
                            </div>
                        </div>

                        {/* Het verschil subtle uitleggen */}
                        <div className="w-full bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                            <p className="text-xs text-blue-900 leading-relaxed">
                                💡 <strong>Geen eindeloos scrollen</strong> door banenlijsten.
                                Geen test zonder opvolging. Maar <strong>gepersonaliseerde voorstellen</strong>
                                zodat je vroeg ontdekt wat bij je past.
                            </p>
                        </div>

                        <div className="w-full flex gap-3">
                            <button
                                onClick={prevSlide}
                                className="px-4 py-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center group"
                            >
                                Verder
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* SLIDE 2: READY TO START */}
                {currentSlide === 2 && (
                    <motion.div
                        key="slide2"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full flex flex-col items-center text-center mt-10"
                    >
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-blue-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
                            <div className="relative bg-blue-50 p-6 rounded-full">
                                <Target className="w-16 h-16 text-blue-600" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Klaar om te beginnen?
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed max-w-sm">
                            We starten met <strong>stap 1: jezelf leren kennen</strong>.
                            Dit duurt ongeveer <strong>30-40 minuten</strong>.
                        </p>

                        {/* Key Benefits */}
                        <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left">
                            <h3 className="font-bold text-gray-900 mb-4 text-center">Wat je krijgt:</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-1.5 rounded-lg shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Gedetailleerd inzicht</p>
                                        <p className="text-xs text-gray-600">Banen die passen bij jou als persoon</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-1.5 rounded-lg shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Gerichte voorstellen</p>
                                        <p className="text-xs text-gray-600">Gefilterde matches, niet eindeloze lijsten</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-1.5 rounded-lg shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Afgewogen keuze</p>
                                        <p className="text-xs text-gray-600">Vind vroeg je richting voor studie & carrière</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-400 mb-6 max-w-xs">
                            💡 Je kunt altijd pauzeren en later verder gaan. Je voortgang wordt automatisch opgeslagen.
                        </p>

                        <div className="w-full flex gap-3">
                            <button
                                onClick={prevSlide}
                                className="px-4 py-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={startApp}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center group"
                            >
                                Start Analyse
                                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
