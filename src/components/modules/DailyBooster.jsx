import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getNextModule } from '../../utils/reliabilityEngine';

const DailyBooster = () => {
    const { completedModules, isPremium, updateReliability, reliabilityScore } = useStore();
    const [isCompleting, setIsCompleting] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);

    const nextModule = getNextModule(completedModules, isPremium);

    // Sample tasks for daily dilemmas
    const tasks = [
        {
            id: 'daily_dilemma_1',
            title: 'Beantwoord 3 vragen over je ideale werkomgeving',
            description: 'Kies tussen werken in een team of solo',
            scoreValue: 5
        },
        {
            id: 'daily_dilemma_2',
            title: 'Deel je voorkeur voor werkstijl',
            description: 'Gestructureerd of flexibel werken?',
            scoreValue: 5
        },
        {
            id: 'daily_dilemma_3',
            title: 'Kies je ideale werklocatie',
            description: 'Kantoor, thuis, of hybride?',
            scoreValue: 5
        },
        {
            id: 'daily_dilemma_4',
            title: 'Bepaal je communicatiestijl',
            description: 'Direct of diplomatiek?',
            scoreValue: 5
        },
        {
            id: 'daily_dilemma_5',
            title: 'Kies je leiderschapsstijl',
            description: 'Leiden of volgen?',
            scoreValue: 5
        },
        {
            id: 'daily_dilemma_6',
            title: 'Deel je risicoprofiel',
            description: 'Veilig of avontuurlijk?',
            scoreValue: 5
        }
    ];

    // Find current active task
    const activeTask = tasks.find(task => !completedModules.includes(task.id));

    const handleCompleteTask = () => {
        if (!activeTask || isCompleting) return;

        setIsCompleting(true);

        // Simulate task completion with animation
        setTimeout(() => {
            updateReliability(activeTask.id, activeTask.scoreValue);
            setJustCompleted(true);
            setIsCompleting(false);

            // Reset completion state after animation
            setTimeout(() => {
                setJustCompleted(false);
            }, 2000);
        }, 800);
    };

    // If all tasks completed or score is 100%
    if (!activeTask || reliabilityScore >= 100) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 rounded-full p-2">
                        <CheckCircle className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Alles voltooid!</h3>
                </div>
                <p className="text-sm text-gray-600">
                    Je hebt alle beschikbare taken voltooid. {!isPremium && 'Upgrade naar Premium voor meer modules!'}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
                <div className="flex items-center gap-2 text-white">
                    <Zap size={20} fill="white" />
                    <h3 className="font-bold text-lg">Verhoog je score</h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-1">{activeTask.title}</h4>
                    <p className="text-sm text-gray-600">{activeTask.description}</p>
                </div>

                {/* Score Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <Zap size={14} />
                    +{activeTask.scoreValue}% betrouwbaarheid
                </div>

                {/* Action Button */}
                <button
                    onClick={handleCompleteTask}
                    disabled={isCompleting || justCompleted}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform ${justCompleted
                            ? 'bg-green-500 text-white'
                            : isCompleting
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {justCompleted ? (
                        <>
                            <CheckCircle size={20} />
                            Voltooid!
                        </>
                    ) : isCompleting ? (
                        'Bezig...'
                    ) : (
                        <>
                            Start taak
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

                {/* Progress Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Dagelijkse taken</span>
                        <span>{completedModules.filter(m => m.startsWith('daily_dilemma')).length} / {tasks.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(completedModules.filter(m => m.startsWith('daily_dilemma')).length / tasks.length) * 100}%`
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* Completion Animation */}
            {justCompleted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm"
                >
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                            className="bg-green-500 rounded-full p-4 inline-block mb-2"
                        >
                            <CheckCircle className="text-white" size={48} />
                        </motion.div>
                        <p className="font-bold text-gray-900">+{activeTask.scoreValue}% toegevoegd!</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default DailyBooster;
