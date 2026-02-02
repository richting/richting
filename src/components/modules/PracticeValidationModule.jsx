import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMissionById } from '../../data/missionData';

const PracticeValidationModule = () => {
    const { completeModule, setStep, addScore } = useStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const scenarios = [
        {
            id: 'scenario_1',
            situation: 'Je krijgt een complex project aangeboden dat je nog nooit hebt gedaan.',
            question: 'Wat is je eerste reactie?',
            options: [
                { text: 'Ik duik er meteen in en leer onderweg', riasec: 'I', value: 'autonomy' },
                { text: 'Ik vraag om begeleiding en training', riasec: 'S', value: 'team' },
                { text: 'Ik maak eerst een gedetailleerd plan', riasec: 'C', value: 'security' },
                { text: 'Ik zoek naar een creatieve aanpak', riasec: 'A', value: 'creativity' }
            ]
        },
        {
            id: 'scenario_2',
            situation: 'Er is een conflict in je team over de aanpak van een project.',
            question: 'Hoe reageer je?',
            options: [
                { text: 'Ik neem het voortouw en stel een oplossing voor', riasec: 'E', value: 'impact' },
                { text: 'Ik luister naar alle partijen en bemiddel', riasec: 'S', value: 'team' },
                { text: 'Ik analyseer de feiten en presenteer data', riasec: 'I', value: 'security' },
                { text: 'Ik blijf liever op de achtergrond', riasec: 'C', value: 'autonomy' }
            ]
        },
        {
            id: 'scenario_3',
            situation: 'Je hebt de keuze tussen twee projecten: één innovatief maar risicovol, één bewezen maar saai.',
            question: 'Welke kies je?',
            options: [
                { text: 'Het innovatieve project, ik hou van uitdagingen', riasec: 'A', value: 'creativity' },
                { text: 'Het bewezen project, ik waardeer stabiliteit', riasec: 'C', value: 'security' },
                { text: 'Ik zou beide combineren als dat kan', riasec: 'E', value: 'dynamic' },
                { text: 'Ik kies op basis van waar ik het meest kan leren', riasec: 'I', value: 'autonomy' }
            ]
        },
        {
            id: 'scenario_4',
            situation: 'Je moet een presentatie geven voor een grote groep.',
            question: 'Hoe voel je je hierover?',
            options: [
                { text: 'Enthousiast, ik presenteer graag', riasec: 'E', value: 'impact' },
                { text: 'Nerveus, maar ik doe het wel', riasec: 'S', value: 'team' },
                { text: 'Ik bereid me grondig voor met data', riasec: 'I', value: 'security' },
                { text: 'Ik zou liever een schriftelijk rapport maken', riasec: 'C', value: 'autonomy' }
            ]
        },
        {
            id: 'scenario_5',
            situation: 'Je krijgt de kans om een nieuw proces te ontwerpen voor je afdeling.',
            question: 'Wat doe je?',
            options: [
                { text: 'Ik ontwerp iets compleet nieuws en innovatiefs', riasec: 'A', value: 'creativity' },
                { text: 'Ik betrek het hele team in het ontwerpproces', riasec: 'S', value: 'team' },
                { text: 'Ik onderzoek best practices en pas die aan', riasec: 'I', value: 'security' },
                { text: 'Ik optimaliseer het huidige proces stap voor stap', riasec: 'C', value: 'dynamic' }
            ]
        }
    ];

    const handleAnswer = (option) => {
        const newAnswers = { ...answers, [scenarios[currentQuestion].id]: option };
        setAnswers(newAnswers);

        // Add RIASEC score based on answer
        addScore(option.riasec, 2);

        if (currentQuestion < scenarios.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Module completed
            const mission = getMissionById('practice_validation');
            completeModule('practice_validation', mission.scoreIncrease);
            setStep(4); // Return to home
        }
    };

    const progress = ((currentQuestion + 1) / scenarios.length) * 100;

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                        <CheckCircle2 className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Praktijk-validatie</h1>
                        <p className="text-sm text-gray-500">Scenario {currentQuestion + 1} van {scenarios.length}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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

export default PracticeValidationModule;
