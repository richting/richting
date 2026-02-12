import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { User, Shield, CreditCard, LogOut, CheckCircle, Lock, Map, RotateCcw, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileScreen = () => {
    const { user, userScores, completedModules, logout, setStep, resetModule } = useStore();
    const [resetting, setResetting] = useState(null); // Track which ID is being reset
    const [isDataOpen, setIsDataOpen] = useState(false); // Unified accordion state

    const MODULE_STEPS = {
        'onboarding': 0,
        'swipes': 1,
        'dilemmas': 2,
        'values': 10,
        'practice_validation': 11,
        'career_practice': 12,
        'bigfive': 13,
        'validation_results': 15
    };

    const COMPLETION_MAPPING = {
        'onboarding': 'onboarding', // or specific check
        'swipes': 'onboarding_swipes',
        'dilemmas': 'dilemmas',
        'values': 'work_values_deep',
        'practice_validation': 'practice_validation',
        'career_practice': 'career_practice',
        'validation_results': 'career_practice', // Linked to career practice
        'bigfive': 'personality'
    };

    const handleReset = async (moduleId, label) => {
        if (window.confirm(`Weet je zeker dat je "${label}" wilt wissen? Je moet deze module dan opnieuw doen om resultaten te zien.`)) {
            setResetting(moduleId);
            try {
                await resetModule(moduleId);
                // No navigation, just reset data
            } catch (err) {
                console.error('Reset failed', err);
                alert(`Er ging iets mis bij het resetten: ${err.message || 'Onbekende fout'}`);
            } finally {
                setResetting(null);
            }
        }
    };

    const handleRedo = async (moduleId) => {
        setResetting(moduleId);
        try {
            // For modules that accumulate data (like swipes), we must reset them to allow a "Redo".
            // For others (like dilemmas), it might be optional, but consistent to start fresh or at least allow re-entry.
            // check if specific modules need reset
            if (['swipes', 'onboarding', 'bigfive'].includes(moduleId)) {
                await resetModule(moduleId);
            }
            // For Dilemmas and Values, we might strictly not need to reset DB if we want to keep previous values visible,
            // but resetting ensures clean state. However, the user said "Remove delete function",
            // maybe they WANT to see old values? 
            // DilemmaSlider loads from DB. If we don't reset, they see old values. That's good for "Edit".
            // Swipes loads 0? No, it just adds. So we MUST reset Swipes.

            // Navigate to the module
            const targetStep = MODULE_STEPS[moduleId];
            if (targetStep !== undefined) {
                setStep(targetStep);
            }
        } catch (err) {
            console.error('Redo failed', err);
            alert(`Er ging iets mis bij het openen: ${err.message || 'Onbekende fout'}`);
        } finally {
            setResetting(null);
        }
    };

    const data = [
        { subject: 'Realistisch', A: userScores.R, fullMark: 20 },
        { subject: 'Intellectueel', A: userScores.I, fullMark: 20 },
        { subject: 'Artistiek', A: userScores.A, fullMark: 20 },
        { subject: 'Sociaal', A: userScores.S, fullMark: 20 },
        { subject: 'Ondernemend', A: userScores.E, fullMark: 20 },
        { subject: 'Conventioneel', A: userScores.C, fullMark: 20 },
    ];

    const getTraits = () => {
        // Simple logic to get top traits
        const scores = Object.entries(userScores).sort((a, b) => b[1] - a[1]);
        const topTraits = scores.slice(0, 3).map(([key]) => {
            const map = {
                R: 'Doener',
                I: 'Denker',
                A: 'Creatieveling',
                S: 'Helper',
                E: 'Ondernemer',
                C: 'Organisator'
            };
            return map[key];
        });
        return topTraits;
    };

    const modules = [
        { id: 'onboarding', label: 'Onboarding' },
        { id: 'swipes', label: 'Interesse Test (Swipes)' },
        { id: 'dilemmas', label: 'Dilemma Slider' },
        { id: 'values', label: 'Work Values Deep' },
        { id: 'practice_validation', label: 'Practice Validation' },
        { id: 'career_practice', label: 'Career Practice' },
        { id: 'validation_results', label: 'Validation Results' },
        { id: 'bigfive', label: 'Persoonlijkheid (Big 5)' }
    ];

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Mijn Blauwdruk</h1>

            {/* Radar Chart Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm uppercase tracking-wider">Jouw DNA</h3>
                <div className="h-64 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                            <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Traits Tags */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {getTraits().map(trait => (
                        <span key={trait} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                            {trait}
                        </span>
                    ))}
                </div>
            </div>

            {/* Unified Data Management Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <button
                    onClick={() => setIsDataOpen(!isDataOpen)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                            <RotateCcw className="text-gray-600 w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">Gegevens & Voortgang</h3>
                    </div>
                    <motion.div
                        animate={{ rotate: isDataOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="text-gray-400 w-5 h-5" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isDataOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="p-4 pt-0 border-t border-gray-50 mt-2">
                                <p className="text-xs text-gray-500 mb-4 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                    Hier kun je jouw voortgang beheren. Wis resultaten om de interesse test opnieuw te doen, of start een missie opnieuw om je antwoorden aan te passen.
                                </p>

                                {/* Sub-Section: Interesse Test */}
                                <div className="mb-6">
                                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 mt-2">Interesse Test</h4>
                                    <div className="space-y-3">
                                        {modules.filter(m => m.id === 'swipes').map(mod => {
                                            const completionId = COMPLETION_MAPPING[mod.id] || mod.id;
                                            const isStrictlyCompleted = completedModules.includes(completionId);
                                            const isVisuallyCompleted = isStrictlyCompleted || (mod.id === 'swipes' && userScores.R > 0);

                                            return (
                                                <div key={mod.id} className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <Map className="text-blue-500 w-4 h-4" />
                                                        <span className="text-sm font-medium text-gray-700">{mod.label}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {isVisuallyCompleted ? (
                                                            <>
                                                                <CheckCircle size={18} className="text-green-500" />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleReset(mod.id, mod.label); }}
                                                                    disabled={resetting === mod.id}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Gegevens wissen"
                                                                >
                                                                    {resetting === mod.id ? (
                                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full" />
                                                                        </motion.div>
                                                                    ) : (
                                                                        <Trash2 size={16} />
                                                                    )}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="bg-gray-200 p-1 rounded-full">
                                                                <Lock size={14} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Sub-Section: Jouw Missies */}
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Test (Testcentrum)</h4>
                                    <div className="space-y-3">
                                        {modules.filter(m => m.id !== 'swipes').map(mod => {
                                            const completionId = COMPLETION_MAPPING[mod.id] || mod.id;
                                            const isStrictlyCompleted = completedModules.includes(completionId);
                                            const isVisuallyCompleted = isStrictlyCompleted || (mod.id === 'onboarding');

                                            return (
                                                <div key={mod.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                    <span className="text-sm font-medium text-gray-700">{mod.label}</span>
                                                    <div className="flex items-center gap-3">
                                                        {isVisuallyCompleted ? (
                                                            <>
                                                                <CheckCircle size={18} className="text-green-500" />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRedo(mod.id); }}
                                                                    disabled={resetting === mod.id}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Opnieuw doen"
                                                                >
                                                                    {resetting === mod.id ? (
                                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                                                                        </motion.div>
                                                                    ) : (
                                                                        <RotateCcw size={16} />
                                                                    )}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="bg-gray-200 p-1 rounded-full">
                                                                <Lock size={14} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Settings / Account */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <User className="text-gray-500" size={20} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Gastgebruiker'}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>






                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 transition-colors text-red-500 text-left"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Uitloggen</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;
