import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMissionById } from '../../data/missionData';

const WorkValuesDeepModule = () => {
    const { completeModule, setStep, setValue } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const valueQuestions = [
        {
            id: 'security',
            label: 'Zekerheid & Stabiliteit',
            question: 'Hoe belangrijk is een vaste baan met voorspelbare inkomsten voor jou?',
            scenarios: [
                'Een vast contract met gemiddeld salaris',
                'Een flexibel contract met hoger salaris maar minder zekerheid'
            ]
        },
        {
            id: 'creativity',
            label: 'Creativiteit & Innovatie',
            question: 'Hoeveel ruimte wil je voor creatief en innovatief werk?',
            scenarios: [
                'Dagelijks nieuwe uitdagingen en creatieve vrijheid',
                'Gestructureerde taken met bewezen methodes'
            ]
        },
        {
            id: 'autonomy',
            label: 'Autonomie & Vrijheid',
            question: 'Hoe belangrijk is het om je eigen tijd en werk in te delen?',
            scenarios: [
                'Volledige controle over je werkdag en projecten',
                'Duidelijke structuur en begeleiding van een manager'
            ]
        },
        {
            id: 'team',
            label: 'Teamwerk & Samenwerking',
            question: 'Hoe belangrijk is intensieve samenwerking met collega\'s?',
            scenarios: [
                'Constant samenwerken in teams',
                'Vooral zelfstandig werken met periodiek overleg'
            ]
        },
        {
            id: 'dynamic',
            label: 'Dynamiek & Afwisseling',
            question: 'Hoeveel afwisseling en dynamiek wil je in je werk?',
            scenarios: [
                'Elke dag anders, veel variatie',
                'Voorspelbare routine met duidelijke patronen'
            ]
        },
        {
            id: 'impact',
            label: 'Impact & Betekenis',
            question: 'Hoe belangrijk is het dat je werk een zichtbare impact heeft?',
            scenarios: [
                'Direct zichtbare resultaten en maatschappelijke impact',
                'Bijdragen aan een groter geheel, ook achter de schermen'
            ]
        }
    ];

    const handleScenarioChoice = (preferFirst) => {
        const question = valueQuestions[currentQuestion];
        // Update the value: if they prefer first scenario, increase value, otherwise decrease
        const newValue = preferFirst ? 8 : 3;
        setValue(question.id, newValue);

        if (currentQuestion < valueQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Module completed
            const mission = getMissionById('work_values_deep');
            completeModule('work_values_deep', mission.scoreIncrease);
            setStep(4); // Return to home
        }
    };

    const progress = ((currentQuestion + 1) / valueQuestions.length) * 100;

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <Scale className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Werkwaarden Verdieping</h1>
                        <p className="text-sm text-gray-500">Vraag {currentQuestion + 1} van {valueQuestions.length}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
                <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-2">
                    {valueQuestions[currentQuestion].label}
                </p>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                    {valueQuestions[currentQuestion].question}
                </h2>

                <p className="text-sm text-gray-500 mb-4">Kies het scenario dat het beste bij je past:</p>

                {/* Scenario Options */}
                <div className="space-y-4">
                    {valueQuestions[currentQuestion].scenarios.map((scenario, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleScenarioChoice(idx === 0)}
                            className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-400 p-5 rounded-xl transition-all text-left group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full border-2 border-blue-400 group-hover:bg-blue-400 group-hover:border-blue-500 transition-all flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="flex-1 font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                                    {scenario}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default WorkValuesDeepModule;
