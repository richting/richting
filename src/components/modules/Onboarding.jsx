import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Briefcase } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Onboarding = () => {
    const { nextStep, setStep, setLoginMode } = useStore();

    const handleLoginClick = () => {
        setLoginMode(true);
        setStep(3);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full"
            >
                <div className="absolute top-0 right-0 -mt-20 md:-mt-24">
                    <button
                        onClick={handleLoginClick}
                        className="text-sm font-medium text-gray-600 hover:text-blue-600 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-200 transition-all bg-white"
                    >
                        Inloggen
                    </button>
                </div>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Richting</h1>
                    <p className="text-lg text-gray-600">
                        Ontdek jouw professionele blauwdruk in 5 minuten.
                    </p>
                </div>

                <div className="space-y-4 w-full">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Waar sta je nu?
                    </p>

                    <button
                        onClick={nextStep}
                        className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 p-4 rounded-xl transition-all duration-200 flex items-center group text-left shadow-sm"
                    >
                        <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors mr-4">
                            <BookOpen className="text-blue-600 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Studiekeuze</h3>
                            <p className="text-sm text-gray-500">Ik moet binnenkort een studie kiezen</p>
                        </div>
                        <ArrowRight className="text-gray-300 group-hover:text-blue-500 w-5 h-5 transition-colors" />
                    </button>

                    <button
                        onClick={nextStep}
                        className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-500 p-4 rounded-xl transition-all duration-200 flex items-center group text-left shadow-sm"
                    >
                        <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors mr-4">
                            <Briefcase className="text-purple-600 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Carrière Switch</h3>
                            <p className="text-sm text-gray-500">Ik twijfel over mijn huidige baan</p>
                        </div>
                        <ArrowRight className="text-gray-300 group-hover:text-purple-500 w-5 h-5 transition-colors" />
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    Gebaseerd op wetenschappelijke modellen (RIASEC & Ikigai)
                </p>
            </motion.div>

        </div>
    );
};

export default Onboarding;
