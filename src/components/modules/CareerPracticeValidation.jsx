import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getScenariosForCareerDirection } from '../../data/careerScenarios';

const CareerPracticeValidation = () => {
    const { selectedCareerDirection, addScore, setStep, user, userScores, setValidationResults, completeModule } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [scenarios, setScenarios] = useState([]);
    const [initialScores, setInitialScores] = useState(null);

    useEffect(() => {
        // Capture initial scores when validation starts
        if (!initialScores && userScores) {
            console.log('Capturing initial scores:', userScores);
            setInitialScores({ ...userScores });
        }
    }, [userScores, initialScores]);

    useEffect(() => {
        // Load scenarios for the selected career direction
        console.log('Searching scenarios for:', selectedCareerDirection?.direction);
        const loadedScenarios = getScenariosForCareerDirection(selectedCareerDirection?.direction || '');

        if (loadedScenarios.length > 0) {
            setScenarios(loadedScenarios);
        }
        // If no scenarios, we stay with empty array and show error message in render
    }, [selectedCareerDirection]);

    const handleAnswer = (option) => {
        const newAnswers = { ...answers, [scenarios[currentQuestion].id]: option };
        setAnswers(newAnswers);

        // Add RIASEC score based on answer
        addScore(option.riasec, 1);

        if (currentQuestion < scenarios.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Module completed - save validation results and navigate to results screen
            if (initialScores) {
                const resultsToSave = {
                    beforeScores: initialScores,
                    afterScores: { ...userScores },
                    careerDirection: selectedCareerDirection?.name || selectedCareerDirection?.direction
                };
                console.log('CareerPracticeValidation - Saving results:', resultsToSave);
                console.log('CareerPracticeValidation - Saving results:', resultsToSave);
                setValidationResults(resultsToSave);
                completeModule('career_practice', 10); // Mark as completed
                setStep(15); // Navigate to results screen
            } else {
                // Fallback if initial scores weren't captured
                if (selectedCareerDirection?.returnStep) {
                    setStep(selectedCareerDirection.returnStep);
                } else {
                    setStep(6); // Default to matches screen
                }
            }
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        } else {
            // Return to previous screen
            if (selectedCareerDirection?.returnStep) {
                setStep(selectedCareerDirection.returnStep);
            } else {
                setStep(6);
            }
        }
    };

    const progress = scenarios.length > 0 ? ((currentQuestion + 1) / scenarios.length) * 100 : 0;

    if (scenarios.length === 0) {
        return (
            <div className="max-w-md mx-auto px-4 py-8 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-4">
                    <p className="font-bold">Geen scenario's gevonden</p>
                    <p className="text-sm mt-1">
                        Kon geen scenario's vinden voor: "{selectedCareerDirection?.direction}"
                    </p>
                </div>
                <button
                    onClick={() => setStep(6)}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Terug naar overzicht
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-1" />
                        {currentQuestion === 0 ? 'Terug' : 'Vorige'}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-xl">
                            <CheckCircle2 className="text-green-600 w-5 h-5" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">Praktijk-validatie</h1>
                {selectedCareerDirection?.name && (
                    <p className="text-sm text-gray-600 mb-2">{selectedCareerDirection.name}</p>
                )}
                <p className="text-sm text-gray-500">Scenario {currentQuestion + 1} van {scenarios.length}</p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                    <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Scenario Card */}
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg mb-6 border border-green-100"
            >
                <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 italic">
                        "{scenarios[currentQuestion].situation}"
                    </p>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-6">
                    {scenarios[currentQuestion].question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                    {scenarios[currentQuestion].options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className="w-full bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-400 p-4 rounded-xl transition-all text-left group"
                        >
                            <div className="flex items-start gap-3">
                                <Circle className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors mt-0.5 flex-shrink-0" />
                                <p className="flex-1 font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                                    {option.text}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            <p className="text-xs text-center text-gray-400">
                Er zijn geen foute antwoorden. Kies wat het beste bij jou past.
            </p>
        </div>
    );
};

export default CareerPracticeValidation;
