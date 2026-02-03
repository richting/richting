import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Onboarding = () => {
    const { nextStep, setStep, setLoginMode } = useStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleLoginClick = () => {
        setLoginMode(true);
        setStep(3);
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide((prev) => prev + 1);
    };

    const handleChoice = (choice) => {
        // Here you could save the choice to the store if needed
        // For now, we just acknowledge it and move on
        console.log("User choice:", choice);
        nextSlide();
    };

    const startApp = () => {
        nextStep(); // Determine next step based on logic, usually VibeSwipe (step 1)
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
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto px-6 overflow-hidden relative">

            {/* Login Button (Always visible until end) */}
            <motion.div
                className="absolute top-4 right-4 z-50"
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

            {/* Progress Indicators */}
            <div className="absolute top-12 flex space-x-2">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className={`h-1 rounded-full transition-colors duration-300 ${i <= currentSlide ? 'bg-blue-600' : 'bg-gray-200'}`}
                        initial={{ width: 8 }}
                        animate={{ width: i === currentSlide ? 24 : 8 }}
                    />
                ))}
            </div>


            <AnimatePresence initial={false} custom={direction} mode='wait'>

                {/* SLIDE 0: VALUE PROP */}
                {currentSlide === 0 && (
                    <motion.div
                        key="slide0"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full flex flex-col items-center text-center mt-10"
                    >
                        <div className="bg-blue-50 p-6 rounded-full mb-8">
                            <Sparkles className="w-12 h-12 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Jouw professionele blauwdruk <div className="text-blue-600">in 5 minuten.</div>
                        </h1>
                        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                            Geen lange saaie testen. <br />
                            Puur inzicht in wie jij bent en wat je kan.
                        </p>

                        <button
                            onClick={nextSlide}
                            className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center group"
                        >
                            Starten
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {/* SLIDE 1: SEGMENTATION */}
                {currentSlide === 1 && (
                    <motion.div
                        key="slide1"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full flex flex-col items-center text-center mt-10"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Waar sta je nu?</h2>
                        <p className="text-gray-500 mb-8">Kies wat het beste bij jou past.</p>

                        <div className="w-full space-y-4">
                            <button
                                onClick={() => handleChoice('study')}
                                className="w-full bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 p-5 rounded-2xl transition-all duration-200 flex items-center text-left group shadow-sm hover:shadow-md"
                            >
                                <div className="bg-blue-100 p-3 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
                                    <BookOpen className="text-blue-600 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Studiekeuze</h3>
                                    <p className="text-sm text-gray-500">Ik moet een studie kiezen</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleChoice('career')}
                                className="w-full bg-white border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 p-5 rounded-2xl transition-all duration-200 flex items-center text-left group shadow-sm hover:shadow-md"
                            >
                                <div className="bg-purple-100 p-3 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
                                    <Briefcase className="text-purple-600 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Carrière Switch</h3>
                                    <p className="text-sm text-gray-500">Ik zoek een nieuwe stap</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* SLIDE 2: ROADMAP (CLARITY) */}
                {currentSlide === 2 && (
                    <motion.div
                        key="slide2"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full flex flex-col items-center text-center mt-4"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Hoe het werkt</h2>

                        <div className="w-full space-y-6 relative">
                            {/* Connecting Line */}
                            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-100 z-0"></div>

                            {/* Step 1 */}
                            <div className="flex items-start text-left relative z-10">
                                <div className="bg-blue-100 text-blue-600 font-bold w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm text-xl">
                                    1
                                </div>
                                <div className="ml-4 pt-1">
                                    <h3 className="font-bold text-gray-900 text-lg">Swipe je Vibe</h3>
                                    <p className="text-sm text-gray-500">Vertrouw op je gevoel bij verschillende activiteiten.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start text-left relative z-10">
                                <div className="bg-purple-100 text-purple-600 font-bold w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm text-xl">
                                    2
                                </div>
                                <div className="ml-4 pt-1">
                                    <h3 className="font-bold text-gray-900 text-lg">Dilemma's</h3>
                                    <p className="text-sm text-gray-500">Ontdek wat jij écht belangrijk vindt in werk.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start text-left relative z-10">
                                <div className="bg-green-100 text-green-600 font-bold w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm text-xl">
                                    3
                                </div>
                                <div className="ml-4 pt-1">
                                    <h3 className="font-bold text-gray-900 text-lg">Het Resultaat</h3>
                                    <p className="text-sm text-gray-500">Jouw persoonlijke profiel en carrièrerichting.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-full mt-10 bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center"
                        >
                            Verder
                            <ChevronRight className="ml-1 w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* SLIDE 3: KICKOFF (SOCIALIZATION) */}
                {currentSlide === 3 && (
                    <motion.div
                        key="slide3"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full flex flex-col items-center text-center mt-10"
                    >
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-blue-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
                            <CheckCircle2 className="w-20 h-20 text-blue-600 relative z-10" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Alles staat klaar.</h2>
                        <p className="text-lg text-gray-500 mb-10">
                            We hebben een persoonlijk pad voor je uitgestippeld. Laten we beginnen!
                        </p>

                        <button
                            onClick={startApp}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center text-lg"
                        >
                            Start Analyse
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
