import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMissionById } from '../../data/missionData';

const PersonalityModule = () => {
    const { completeModule, setStep } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = [
        { id: 'extraversion', label: 'Ik voel me energiek in sociale situaties', trait: 'Extraversie' },
        { id: 'openness', label: 'Ik ben nieuwsgierig naar nieuwe ervaringen', trait: 'Openheid' },
        { id: 'conscientiousness', label: 'Ik ben georganiseerd en planmatig', trait: 'Consciëntieusheid' },
        { id: 'agreeableness', label: 'Ik ben empathisch en behulpzaam', trait: 'Vriendelijkheid' },
        { id: 'neuroticism', label: 'Ik maak me snel zorgen', trait: 'Neuroticisme' },
        { id: 'creativity', label: 'Ik kom vaak met originele ideeën', trait: 'Creativiteit' },
        { id: 'analytical', label: 'Ik analyseer problemen grondig', trait: 'Analytisch' },
        { id: 'leadership', label: 'Ik neem graag het voortouw', trait: 'Leiderschap' },
        { id: 'teamwork', label: 'Ik werk het liefst in teamverband', trait: 'Teamwork' },
        { id: 'independence', label: 'Ik werk graag zelfstandig', trait: 'Zelfstandigheid' }
    ];

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Module completed
            const mission = getMissionById('personality');
            completeModule('personality', mission.scoreIncrease);
            setStep(4); // Return to home
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                        <Brain className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Persoonlijkheid</h1>
                        <p className="text-sm text-gray-500">Vraag {currentQuestion + 1} van {questions.length}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
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
                <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold mb-2">
                    {questions[currentQuestion].trait}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-8">
                    {questions[currentQuestion].label}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                    {[
                        { value: 1, label: 'Helemaal niet mee eens' },
                        { value: 2, label: 'Niet mee eens' },
                        { value: 3, label: 'Neutraal' },
                        { value: 4, label: 'Mee eens' },
                        { value: 5, label: 'Helemaal mee eens' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleAnswer(option.value)}
                            className="w-full bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-400 p-4 rounded-xl transition-all text-left font-medium text-gray-700 hover:text-purple-700 flex items-center justify-between group"
                        >
                            <span>{option.label}</span>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default PersonalityModule;
