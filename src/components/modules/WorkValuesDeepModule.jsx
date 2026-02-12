import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { assessmentService } from '../../services/assessmentService';
import ScoutAvatar from '../assessments/ScoutAvatar';

const WorkValuesDeepModule = ({ isStandalone = false }) => {
    const { setStep, user, setValue } = useStore();
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [definitions, setDefinitions] = useState([]);

    // Default state matching DB columns
    const [values, setValues] = useState({
        achievement: 5,
        independence: 5,
        recognition: 5,
        relationships: 5,
        support: 5,
        working_conditions: 5
    });

    useEffect(() => {
        const fetchDefinitions = async () => {
            try {
                const data = await assessmentService.getQuestions('work_values');
                if (data && data.length > 0) {
                    // Transform to expected format
                    const formatted = data.map(q => ({
                        id: q.category?.toLowerCase().replace(' ', '_'), // e.g. achievement
                        label: q.question_text,
                        description: q.metadata?.description,
                        icon: q.metadata?.icon,
                        // Add color mapping if needed, or random
                        color: 'from-blue-500 to-indigo-500' // Placeholder, could map based on id
                    }));

                    // Manual color mapping for aesthetics
                    const colors = {
                        achievement: 'from-blue-500 to-indigo-500',
                        independence: 'from-indigo-500 to-purple-500',
                        recognition: 'from-purple-500 to-pink-500',
                        relationships: 'from-pink-500 to-rose-500',
                        support: 'from-rose-500 to-orange-500',
                        working_conditions: 'from-orange-500 to-amber-500'
                    };

                    // Fix IDs to match state keys if necessary (category in DB vs state key)
                    // DB categories: Achievement, Independence, Recognition, Relationships, Support, Working Conditions
                    // State keys: achievement, independence, recognition, relationships, support, working_conditions

                    const mapped = formatted.map(d => ({
                        ...d,
                        id: d.id === 'working conditions' ? 'working_conditions' : d.id, // Handle space
                        color: colors[d.id === 'working conditions' ? 'working_conditions' : d.id] || colors.achievement
                    }));

                    setDefinitions(mapped);
                } else {
                    // Fallback if no DB data
                    console.warn("No work values found in DB");
                }
            } catch (err) {
                console.error("Failed to fetch work values", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDefinitions();
    }, []);

    const handleSliderChange = (id, val) => {
        setValues(prev => ({ ...prev, [id]: parseInt(val) }));
    };

    const handleComplete = async () => {
        // Save to store locally via setValue (existing action)
        Object.entries(values).forEach(([key, val]) => {
            setValue(key, val);
        });

        // Save to DB via service
        if (user?.id) {
            try {
                await assessmentService.saveWorkValues(user.id, values);
            } catch (err) {
                console.error("Failed to save work values", err);
            }
        }

        // Navigate to SCCT Scanner (Step 17) or Hub if standalone
        // SCCT Scanner will then go to Auth (Step 4)
        setStep(isStandalone ? 9 : 4);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Waarden laden...</p>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-blue-100 p-6 rounded-full mb-6"
                >
                    <Scale className="w-12 h-12 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Werkwaarden</h1>
                <p className="text-gray-600 mb-8 max-w-sm">
                    Wat vind jij écht belangrijk in je werk? Geef per onderdeel aan hoeveel waarde je eraan hecht.
                </p>
                <button
                    onClick={() => setStarted(true)}
                    className="w-full max-w-xs bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                    Starten
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-32 space-y-8 relative">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Jouw Werkwaarden</h1>
                <p className="text-sm text-gray-500">Sleep de balken naar jouw voorkeur (1 = niet belangrijk, 10 = heel belangrijk)</p>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
                {definitions.map((val, idx) => (
                    <motion.div
                        key={val.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <span>{val.icon}</span> {val.label}
                            </h3>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-bold font-mono">
                                {values[val.id]} / 10
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            {val.description}
                        </p>

                        <input
                            type="range"
                            min="1"
                            max="100" // using 100 steps for smoothness, mapped to 1-10
                            value={values[val.id] * 10}
                            onChange={(e) => handleSliderChange(val.id, Math.ceil(e.target.value / 10))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-blue"
                            style={{
                                backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${values[val.id] * 10}%, #e5e7eb ${values[val.id] * 10}%, #e5e7eb 100%)`
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Complete Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 flex justify-center"
            >
                <button
                    onClick={handleComplete}
                    className="w-full max-w-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                    Opslaan & Naar Resultaat <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>

            <style jsx>{`
                .slider-thumb-blue::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid #3b82f6;
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
            `}</style>

            {/* Scout Avatar */}
            <div className="absolute -top-12 right-0">
                <ScoutAvatar emotion="happy" className="scale-75 origin-bottom-right" />
            </div>
        </div>
    );
};

export default WorkValuesDeepModule;
