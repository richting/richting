import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { Loader2, Scale } from 'lucide-react';
import { saveUserResponse } from '../../utils/syncUserData';
import { MODULES } from '../../utils/reliabilityEngine';

const DilemmaSlider = () => {
    const { userValues, setValue, nextStep, updateReliability, user } = useStore();
    const [dilemmas, setDilemmas] = useState([]);
    const [loading, setLoading] = useState(true);
    // Local state to track individual slider responses independent of the aggregated store
    const [responses, setResponses] = useState({});

    useEffect(() => {
        const fetchDilemmas = async () => {
            try {
                const { data, error } = await supabase.from('dilemmas').select('*');
                if (error) throw error;
                setDilemmas(data || []);

                // Initialize local responses with default value (5)
                const initialResponses = {};
                data?.forEach(d => {
                    initialResponses[d.id] = 5;
                });
                setResponses(initialResponses);
            } catch (error) {
                console.error('Error fetching dilemmas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDilemmas();
    }, []);

    const handleChange = async (id, value) => {
        // 1. Update local state immediately for UI responsiveness and independence
        const newResponses = { ...responses, [id]: value };
        setResponses(newResponses);

        const dilemma = dilemmas.find(d => d.id === id);
        if (dilemma) {
            // 2. Calculate the new aggregated value for the global store
            // Find all dilemmas that map to this same value key (e.g., 'security')
            const valueKey = dilemma.left_value;
            const relatedDilemmas = dilemmas.filter(d => d.left_value === valueKey);

            if (relatedDilemmas.length > 0) {
                // Calculate average of all related responses
                const paramTotal = relatedDilemmas.reduce((sum, d) => {
                    // Use the new value for the current dilemma, existing value for others
                    const val = d.id === id ? value : (newResponses[d.id] || 5);
                    return sum + val;
                }, 0);

                const averageValue = Math.round(paramTotal / relatedDilemmas.length);
                setValue(valueKey, averageValue);
            }

            // 3. Save individual response to database
            if (user?.id) {
                await saveUserResponse(user.id, 'dilemma', id, value.toString());
            }
        }
    };

    const getSliderBackground = (value) => {
        const percentage = (value / 10) * 100;
        return `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-50 p-3 rounded-xl">
                                <Scale className="text-indigo-600 w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 font-space-grotesk">Persoonlijke Balans</h1>
                                <p className="text-sm text-gray-500">Kies wat het beste bij je past</p>
                            </div>
                        </div>

                        {/* Progress Bar (Unified style with PersonalityModule) */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `30%` }} // Static progress for now or calculate based on filled
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {dilemmas.map((dilemma, index) => {
                            // Use local response state for the slider value
                            const currentValue = responses[dilemma.id] !== undefined ? responses[dilemma.id] : 5;

                            return (
                                <motion.div
                                    key={dilemma.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center font-space-grotesk">{dilemma.question}</h3>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                                            <span className={`max-w-[45%] text-left leading-tight transition-colors duration-300 ${currentValue < 5 ? 'text-indigo-600 font-bold' : ''}`}>
                                                {dilemma.left_label}
                                            </span>
                                            <span className={`max-w-[45%] text-right leading-tight transition-colors duration-300 ${currentValue > 5 ? 'text-indigo-600 font-bold' : ''}`}>
                                                {dilemma.right_label}
                                            </span>
                                        </div>

                                        <div className="relative h-12 flex items-center justify-center">
                                            {/* Custom Slider Track */}
                                            <div
                                                className="absolute w-full h-3 rounded-full overflow-hidden pointer-events-none"
                                                style={{ background: getSliderBackground(currentValue) }}
                                            ></div>

                                            {/* Standard Range Input overlaid but styled transparent to act as the interaction layer */}
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                step="1"
                                                value={currentValue}
                                                onChange={(e) => handleChange(dilemma.id, parseInt(e.target.value))}
                                                className="absolute w-full h-12 opacity-0 cursor-pointer z-10"
                                            />

                                            {/* Custom Thumb Visual */}
                                            <motion.div
                                                className="absolute h-6 w-6 bg-white border-2 border-indigo-600 rounded-full shadow-md z-0 pointer-events-none"
                                                animate={{
                                                    left: `calc(${(currentValue / 10) * 100}% - 12px)`
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => {
                                // Update reliability score before moving to next step
                                updateReliability('dilemmas', 15);
                                nextStep();
                            }}
                            className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            Bekijk Resultaten
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DilemmaSlider;
