import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMissionById } from '../../data/missionData';

const CapabilitiesModule = () => {
    const { completeModule, setStep } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const capabilities = [
        { id: 'technical', label: 'Technische vaardigheden', description: 'Programmeren, data-analyse, technisch ontwerp' },
        { id: 'communication', label: 'Communicatie', description: 'Presenteren, schrijven, overtuigen' },
        { id: 'problem_solving', label: 'Probleemoplossend vermogen', description: 'Analytisch denken, creatieve oplossingen' },
        { id: 'leadership', label: 'Leiderschap', description: 'Teams aansturen, beslissingen nemen' },
        { id: 'creativity', label: 'Creativiteit', description: 'Innoveren, out-of-the-box denken' },
        { id: 'organization', label: 'Organisatie', description: 'Plannen, structureren, prioriteren' },
        { id: 'social', label: 'Sociale vaardigheden', description: 'Samenwerken, empathie, netwerken' },
        { id: 'adaptability', label: 'Aanpassingsvermogen', description: 'Flexibel, leergierig, veerkrachtig' }
    ];

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [capabilities[currentQuestion].id]: value };
        setAnswers(newAnswers);

        if (currentQuestion < capabilities.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Module completed
            const mission = getMissionById('capabilities');
            completeModule('capabilities', mission.scoreIncrease);
            setStep(8); // Return to TestHub to see both tests
        }
    };

    const progress = ((currentQuestion + 1) / capabilities.length) * 100;

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                        <Zap className="text-orange-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Capaciteiten</h1>
                        <p className="text-sm text-gray-500">Vraag {currentQuestion + 1} van {capabilities.length}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {capabilities[currentQuestion].label}
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                    {capabilities[currentQuestion].description}
                </p>

                <p className="text-sm font-medium text-gray-700 mb-4">
                    Hoe sterk ben je hierin?
                </p>

                {/* Answer Options */}
                <div className="space-y-3">
                    {[
                        { value: 1, label: 'Beginner', emoji: '🌱' },
                        { value: 2, label: 'Basis', emoji: '📚' },
                        { value: 3, label: 'Gemiddeld', emoji: '⚡' },
                        { value: 4, label: 'Gevorderd', emoji: '🚀' },
                        { value: 5, label: 'Expert', emoji: '⭐' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className="w-full bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 p-4 rounded-xl transition-all text-left font-medium text-gray-700 hover:text-orange-700 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.emoji}</span>
                                <span>{option.label}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default CapabilitiesModule;
