import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getMissionById } from '../../data/missionData';
import { supabase } from '../../lib/supabase';
import { calculateSectorMatches } from '../../utils/matchingEngine';

const CapabilitiesModule = () => {
    const {
        userScores,
        userValues,
        personalityVector,
        completeModule,
        setStep,
        setSelfEfficacy,
        selfEfficacy
    } = useStore();

    const [loading, setLoading] = useState(true);
    const [skillsToAssess, setSkillsToAssess] = useState([]);
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    // Fallback skills if dynamic fetching fails or yields nothing
    const fallbackSkills = [
        { name: 'Complex Problem Solving', description: 'Complexe problemen analyseren en oplossen' },
        { name: 'Critical Thinking', description: 'Logisch en kritisch nadenken over oplossingen' },
        { name: 'Social Perceptiveness', description: 'Aanvoelen hoe anderen reageren en waarom' },
        { name: 'Active Listening', description: 'Aandachtig luisteren en vragen stellen' },
        { name: 'Speaking', description: 'Effectief informatie overbrengen aan anderen' },
        { name: 'Writing', description: 'Effectief communiceren via tekst' },
        { name: 'Time Management', description: 'Eigen tijd en die van anderen indelen' },
        { name: 'Persuasion', description: 'Anderen overtuigen van een standpunt' }
    ];

    useEffect(() => {
        const fetchRelevantSkills = async () => {
            try {
                // 1. Fetch Sectors
                const { data: sectors, error } = await supabase
                    .from('sectors')
                    .select('*');

                if (error || !sectors?.length) throw new Error("Sector fetch failed");

                // 2. Calculate Matches to find relevant sectors
                // We use weight sets for Phase 2 (RIASEC + Personality) since we are IN Phase 3 prep
                const matches = calculateSectorMatches(
                    userScores,
                    userValues,
                    sectors,
                    personalityVector,
                    50 // Mock reliability to trigger Phase 2/3 weights
                );

                // 3. Take Top 3 Sectors
                const topSectors = matches.slice(0, 3);

                // 4. Extract Skills
                const extractedSkills = [];
                const seenSkills = new Set();

                topSectors.forEach(sector => {
                    const skillData = typeof sector.top_skills === 'string'
                        ? JSON.parse(sector.top_skills)
                        : sector.top_skills;

                    if (Array.isArray(skillData)) {
                        skillData.forEach(skill => {
                            // Normalize name for dedup
                            const normName = skill.name.trim();
                            if (!seenSkills.has(normName)) {
                                seenSkills.add(normName);
                                extractedSkills.push({
                                    name: skill.name,
                                    description: skill.description || 'Belangrijke vaardigheid voor jouw matches' // Fallback desc
                                });
                            }
                        });
                    }
                });

                // 5. Select top 10 unique skills (or fallback)
                if (extractedSkills.length < 5) {
                    setSkillsToAssess(fallbackSkills);
                } else {
                    setSkillsToAssess(extractedSkills.slice(0, 10));
                }

            } catch (err) {
                console.error("Skill fetch error:", err);
                setSkillsToAssess(fallbackSkills);
            } finally {
                setLoading(false);
            }
        };

        fetchRelevantSkills();
    }, []);

    const handleAnswer = (value) => {
        const currentSkill = skillsToAssess[currentSkillIndex];
        const skillKey = currentSkill.name.toLowerCase().replace(/ /g, '_');

        const newAnswers = { ...answers, [skillKey]: value };
        setAnswers(newAnswers);

        if (currentSkillIndex < skillsToAssess.length - 1) {
            setCurrentSkillIndex(prev => prev + 1);
        } else {
            finishModule(newAnswers);
        }
    };

    const finishModule = (finalAnswers) => {
        // Merge with existing selfEfficacy to not lose defaults
        const mergedEfficacy = { ...selfEfficacy, ...finalAnswers };
        setSelfEfficacy(mergedEfficacy);

        const mission = getMissionById('capabilities');
        completeModule('capabilities', mission?.scoreIncrease || 20);

        setStep(9); // Return to TestHub to see both tests
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-500">Jouw vaardigheden laden...</p>
            </div>
        );
    }

    const currentSkill = skillsToAssess[currentSkillIndex];
    if (!currentSkill) return null; // Should not happen

    const progress = ((currentSkillIndex + 1) / skillsToAssess.length) * 100;

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-32">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                        <Zap className="text-orange-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Capaciteiten</h1>
                        <p className="text-sm text-gray-500">Vraag {currentSkillIndex + 1} van {skillsToAssess.length}</p>
                    </div>
                </div>

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
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSkill.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-50 min-h-[250px] flex flex-col justify-center"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                        {currentSkill.name}
                    </h2>
                    {/* Only show description if it isn't the placeholder */}
                    {currentSkill.description && (
                        <p className="text-gray-500 text-center mb-8">
                            {currentSkill.description}
                        </p>
                    )}

                    <p className="text-sm font-bold text-center text-orange-600 uppercase tracking-wider mb-6">
                        Hoe sterk ben je hierin?
                    </p>

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
                                className="w-full bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 p-4 rounded-xl transition-all text-left font-medium text-gray-700 hover:text-orange-900 flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-xl">{option.emoji}</span>
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CapabilitiesModule;
