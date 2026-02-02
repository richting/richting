import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMissionById } from '../../data/missionData';
import UnlockModal from './UnlockModal';

const PersonalityQuiz = () => {
    const { isPremium, completeModule, setStep, setPersonalityVector } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showUnlock, setShowUnlock] = useState(!isPremium);
    const [answers, setAnswers] = useState({});
    const [sliderValue, setSliderValue] = useState(50); // 0-100, 50 is neutral

    // 10 Personality Dilemmas based on Big Five
    const dilemmas = [
        {
            id: 1,
            factor: 'extraversion',
            leftOption: 'Ik werk het liefst geconcentreerd in m\'n eentje.',
            rightOption: 'Ik krijg energie van brainstormen in een groep.',
            insight: 'Focus vs. Interactie'
        },
        {
            id: 2,
            factor: 'conscientiousness',
            leftOption: 'Ik improviseer graag en zie wel waar het schip strandt.',
            rightOption: 'Ik hou van lijstjes, schema\'s en een strakke planning.',
            insight: 'Flexibiliteit vs. Structuur'
        },
        {
            id: 3,
            factor: 'openness',
            leftOption: 'Ik hou van bewezen methodes die altijd werken.',
            rightOption: 'Ik ben altijd op zoek naar een nieuwe, creatieve aanpak.',
            insight: 'Behoudend vs. Innovatief'
        },
        {
            id: 4,
            factor: 'agreeableness',
            leftOption: 'Ik zeg direct waar het op staat, ook als dat schuurt.',
            rightOption: 'Ik pas me aan de groep aan om de sfeer goed te houden.',
            insight: 'Taakgericht vs. Mensgericht'
        },
        {
            id: 5,
            factor: 'stability',
            leftOption: 'Onder hoge druk word ik sneller onrustig.',
            rightOption: 'Hoe groter de chaos, hoe kalmer ik blijf.',
            insight: 'Stressgevoeligheid vs. Veerkracht'
        },
        {
            id: 6,
            factor: 'extraversion',
            leftOption: 'Ik luister en observeer liever eerst in een vergadering.',
            rightOption: 'Ik neem vaak het voortouw in een gesprek.',
            insight: 'Volgend vs. Leidend'
        },
        {
            id: 7,
            factor: 'conscientiousness',
            leftOption: 'Ik focus op het grote plaatje, de details komen later wel.',
            rightOption: 'Ik word gelukkig van een resultaat dat tot in de puntjes klopt.',
            insight: 'Visionair vs. Specialist'
        },
        {
            id: 8,
            factor: 'openness',
            leftOption: 'Ik verdiep me liever in één specifiek onderwerp.',
            rightOption: 'Ik ben breed geïnteresseerd in heel veel verschillende dingen.',
            insight: 'Diepgang vs. Breedte'
        },
        {
            id: 9,
            factor: 'agreeableness',
            leftOption: 'Ik vaar mijn eigen koers, ongeacht wat anderen denken.',
            rightOption: 'Ik vind het belangrijk dat anderen mijn werk waarderen.',
            insight: 'Autonoom vs. Coöperatief'
        },
        {
            id: 10,
            factor: 'stability',
            leftOption: 'Ik denk vaak lang na over gemaakte fouten.',
            rightOption: 'Ik laat tegenslagen snel achter me en kijk weer vooruit.',
            insight: 'Reflectief vs. Pragmatisch'
        }
    ];

    const currentDilemma = dilemmas[currentQuestion];
    const progress = ((currentQuestion + 1) / dilemmas.length) * 100;

    // Convert slider value (0-100) to score (-10 to +10)
    // 0 = strongly left (-10), 50 = neutral (0), 100 = strongly right (+10)
    const convertSliderToScore = (value) => {
        return ((value - 50) / 5); // Maps 0-100 to -10 to +10
    };

    const handleSliderChange = (e) => {
        setSliderValue(Number(e.target.value));
    };

    const handleOptionClick = (side) => {
        // Clicking left sets slider to 0, clicking right sets to 100
        const newValue = side === 'left' ? 0 : 100;
        setSliderValue(newValue);

        // Auto-advance after a short delay
        setTimeout(() => {
            handleNext(newValue);
        }, 300);
    };

    const handleNext = (valueToUse = sliderValue) => {
        const score = convertSliderToScore(valueToUse);
        const newAnswers = { ...answers, [currentDilemma.factor]: (answers[currentDilemma.factor] || 0) + score };
        setAnswers(newAnswers);

        if (currentQuestion < dilemmas.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSliderValue(50); // Reset slider to neutral
        } else {
            // Quiz completed - calculate final personality vector
            const personalityVector = {
                extraversion: newAnswers.extraversion || 0,
                conscientiousness: newAnswers.conscientiousness || 0,
                openness: newAnswers.openness || 0,
                agreeableness: newAnswers.agreeableness || 0,
                stability: newAnswers.stability || 0
            };

            // Save to store
            setPersonalityVector(personalityVector);

            // Complete module with 50% score increase
            const mission = getMissionById('personality');
            completeModule('personality', mission.scoreIncrease);

            // Return to TestHub
            setStep(8);
        }
    };

    const handleUpgrade = () => {
        // This would trigger payment flow in production
        console.log('Upgrade to premium clicked');
        setShowUnlock(false);
    };

    if (showUnlock) {
        return (
            <UnlockModal
                isOpen={showUnlock}
                onClose={() => {
                    setShowUnlock(false);
                    setStep(8); // Return to TestHub
                }}
                onUpgrade={handleUpgrade}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                        <Brain className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Persoonlijkheid</h1>
                        <p className="text-sm text-gray-500">Vraag {currentQuestion + 1} van {dilemmas.length}</p>
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
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    {/* Insight Label */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 border-b border-purple-100">
                        <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold text-center">
                            {currentDilemma.insight}
                        </p>
                    </div>

                    {/* Split-Screen Options */}
                    <div className="grid grid-cols-2 gap-0">
                        {/* Left Option */}
                        <motion.button
                            onClick={() => handleOptionClick('left')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-8 text-left transition-all border-r border-gray-200 ${sliderValue < 50 ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <ChevronLeft className={`w-6 h-6 mt-1 flex-shrink-0 ${sliderValue < 50 ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                <p className={`text-base font-medium ${sliderValue < 50 ? 'text-blue-900' : 'text-gray-700'
                                    }`}>
                                    {currentDilemma.leftOption}
                                </p>
                            </div>
                        </motion.button>

                        {/* Right Option */}
                        <motion.button
                            onClick={() => handleOptionClick('right')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-8 text-right transition-all ${sliderValue > 50 ? 'bg-purple-50' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-3 justify-end">
                                <p className={`text-base font-medium ${sliderValue > 50 ? 'text-purple-900' : 'text-gray-700'
                                    }`}>
                                    {currentDilemma.rightOption}
                                </p>
                                <ChevronRight className={`w-6 h-6 mt-1 flex-shrink-0 ${sliderValue > 50 ? 'text-purple-600' : 'text-gray-400'
                                    }`} />
                            </div>
                        </motion.button>
                    </div>

                    {/* Slider Control */}
                    <div className="px-8 py-6 bg-gray-50">
                        <div className="mb-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                onChange={handleSliderChange}
                                className="w-full h-3 bg-gradient-to-r from-blue-200 via-gray-200 to-purple-200 rounded-full appearance-none cursor-pointer slider-thumb"
                                style={{
                                    background: `linear-gradient(to right, 
                                        rgb(59, 130, 246) 0%, 
                                        rgb(209, 213, 219) ${sliderValue}%, 
                                        rgb(168, 85, 247) 100%)`
                                }}
                            />
                        </div>

                        {/* Slider Labels */}
                        <div className="flex justify-between text-xs text-gray-500 mb-6">
                            <span>Helemaal links</span>
                            <span>Neutraal</span>
                            <span>Helemaal rechts</span>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => handleNext()}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {currentQuestion < dilemmas.length - 1 ? 'Volgende vraag' : 'Voltooien'}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Custom Slider Styles */}
            <style jsx>{`
                .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid #9333ea;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .slider-thumb::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid #9333ea;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
};

export default PersonalityQuiz;
