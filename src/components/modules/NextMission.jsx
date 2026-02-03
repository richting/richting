import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getNextMission, MISSION_STEP_MAP } from '../../data/missionData';
import UnlockModal from './UnlockModal';

const NextMission = () => {
    const { completedModules, isPremium, reliabilityScore, setStep, setPremium } = useStore();
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    const nextMission = getNextMission(completedModules);

    // If all missions completed, don't show anything
    if (!nextMission || reliabilityScore >= 100) {
        return null;
    }

    const handleMissionClick = () => {
        if (nextMission.isPremium && !isPremium) {
            setShowUnlockModal(true);
        } else {
            // Navigate to the mission module
            setStep(MISSION_STEP_MAP[nextMission.id]);
        }
    };

    const handleUpgrade = () => {
        setPremium(true);
        setShowUnlockModal(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleMissionClick}
                className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-blue-200 transition-all cursor-pointer group overflow-hidden"
            >
                {/* Animated gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-blue-600 w-5 h-5" />
                            <h3 className="font-bold text-gray-900">Volgende Module</h3>
                        </div>
                        {nextMission.isPremium && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                <Lock size={12} />
                                Premium
                            </div>
                        )}
                    </div>

                    {/* Mission Content */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl transform group-hover:scale-110 transition-transform">
                            {nextMission.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-xl text-gray-900 mb-1">
                                {nextMission.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {nextMission.description}
                            </p>
                        </div>
                    </div>

                    {/* Score Increase Badge */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-gray-700">
                                +{nextMission.scoreIncrease}% betrouwbaarheid
                            </span>
                        </div>

                        <ArrowRight className="text-blue-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>

            <UnlockModal
                isOpen={showUnlockModal}
                onClose={() => setShowUnlockModal(false)}
                onUpgrade={handleUpgrade}
            />
        </>
    );
};

export default NextMission;
