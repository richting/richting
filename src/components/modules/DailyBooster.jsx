import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, CheckCircle, Brain } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { assessmentService } from '../../services/assessmentService';
import ScoutAvatar from '../assessments/ScoutAvatar';

const DailyBooster = () => {
    const { user, addScore, updateReliability } = useStore();
    const [loading, setLoading] = useState(true);
    const [dilemma, setDilemma] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [scoutMsg, setScoutMsg] = useState(null);

    useEffect(() => {
        const fetchDilemma = async () => {
            try {
                // Check local storage or user progress for daily limit
                const lastBooster = localStorage.getItem(`last_booster_${user?.id}`);
                const today = new Date().toISOString().split('T')[0];

                if (lastBooster === today) {
                    setCompleted(true);
                    setLoading(false);
                    return;
                }

                const questions = await assessmentService.getQuestions('dilemma');
                if (questions && questions.length > 0) {
                    // Pick random dilemma
                    const random = questions[Math.floor(Math.random() * questions.length)];
                    setDilemma({
                        id: random.id,
                        text: random.question_text,
                        ...random.metadata
                    });
                }
            } catch (err) {
                console.error("Failed to fetch dilemma", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDilemma();
    }, [user?.id]);

    const handleChoice = async (option) => { // 'A' or 'B'
        if (!dilemma) return;

        const scores = option === 'A' ? dilemma.scoreA : dilemma.scoreB;

        // Update scores
        if (scores) {
            Object.entries(scores).forEach(([key, val]) => {
                addScore(key, val); // key is R, I, A, S, E, C or Big5 char
            });
        }

        // Save progress
        if (user?.id) {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem(`last_booster_${user.id}`, today);
            // Optionally save to DB log
        }

        // Feedback
        setScoutMsg("Interessante keuze! Dat past bij jou. 🧠");
        updateReliability('daily_booster', 5);

        // Show completion
        setTimeout(() => {
            setCompleted(true);
        }, 1500);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Laden...</div>;

    if (completed) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Booster Voltooid!</h3>
                <p className="text-gray-600 mb-6">Je hebt je dagelijkse inzicht binnen. Kom morgen terug voor een nieuwe.</p>
                <div className="flex justify-center gap-2 text-sm font-medium text-orange-500 bg-orange-50 py-2 px-4 rounded-full inline-flex">
                    <Zap size={16} /> +5% Betrouwbaarheid
                </div>
            </div>
        );
    }

    if (!dilemma) return null;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h2 className="text-xl font-bold">Daily Dilemma</h2>
                <p className="text-white/80 text-sm">Wat past het beste bij jou?</p>
            </div>

            {/* Dilemma Content */}
            <div className="p-8">
                <h3 className="text-lg font-bold text-gray-900 text-center mb-8 leading-relaxed">
                    "{dilemma.text}"
                </h3>

                <div className="space-y-4">
                    <button
                        onClick={() => handleChoice('A')}
                        className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-violet-500 hover:bg-violet-50 transition-all text-left group"
                    >
                        <span className="font-semibold text-gray-700 group-hover:text-violet-700 block mb-1">Optie A</span>
                        <span className="text-sm text-gray-500">{dilemma.optionA}</span>
                    </button>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-gray-100 w-full absolute"></div>
                        <span className="bg-white px-2 text-xs text-gray-400 font-bold uppercase relative z-10">of</span>
                    </div>

                    <button
                        onClick={() => handleChoice('B')}
                        className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-fuchsia-500 hover:bg-fuchsia-50 transition-all text-left group"
                    >
                        <span className="font-semibold text-gray-700 group-hover:text-fuchsia-700 block mb-1">Optie B</span>
                        <span className="text-sm text-gray-500">{dilemma.optionB}</span>
                    </button>
                </div>
            </div>

            {/* Scout */}
            <AnimatePresence>
                {scoutMsg && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                        <ScoutAvatar emotion="happy" message={scoutMsg} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DailyBooster;
