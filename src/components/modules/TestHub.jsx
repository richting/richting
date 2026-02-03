import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Lock, ArrowRight, Crown } from 'lucide-react';
import { useStore } from '../../store/useStore';

const TestHub = () => {
    const { isPremium, completedModules, setStep } = useStore();

    const personalityCompleted = completedModules.includes('personality');
    const capabilitiesCompleted = completedModules.includes('capabilities');

    const handleTestClick = (testStep, requiresPremium, requiresPersonality = false) => {
        if (!isPremium && requiresPremium) {
            // Show premium modal or message
            return;
        }
        if (requiresPersonality && !personalityCompleted) {
            // Don't navigate - test is locked
            return;
        }
        setStep(testStep);
    };

    if (!isPremium) {
        return (
            <div className="max-w-md mx-auto px-4 py-8 pb-24">
                {/* Premium Gate */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Testcentrum</h1>
                    <p className="text-gray-500">Ontgrendel premium voor toegang</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl p-8 shadow-lg border-2 border-yellow-200"
                >
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Crown className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Module</h2>
                        <p className="text-gray-600 mb-6">
                            Krijg toegang tot geavanceerde persoonlijkheids- en capaciteitentests om je profiel te verbeteren.
                        </p>
                        <button
                            onClick={() => {/* TODO: Implement upgrade flow */ }}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            Upgrade naar Premium
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Testcentrum</h1>
                <p className="text-gray-500">Verdiep je zelfkennis</p>
            </div>

            {/* Test Cards */}
            <div className="space-y-4">
                {/* Personality Test Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleTestClick(13, true)}
                    className={`bg-white rounded-2xl p-6 shadow-md border-2 transition-all cursor-pointer group ${personalityCompleted
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-blue-200 hover:border-blue-400 hover:shadow-lg'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${personalityCompleted
                                ? 'bg-green-100'
                                : 'bg-gradient-to-br from-blue-100 to-purple-100'
                                }`}>
                                <Brain className={`w-7 h-7 ${personalityCompleted ? 'text-green-600' : 'text-blue-600'
                                    }`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">
                                    Persoonlijkheidstest
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {personalityCompleted ? '✓ Voltooid' : 'Big Five persoonlijkheid'}
                                </p>
                            </div>
                        </div>
                        <ArrowRight className={`w-6 h-6 transition-transform ${personalityCompleted
                            ? 'text-green-400'
                            : 'text-blue-400 group-hover:translate-x-1'
                            }`} />
                    </div>
                </motion.div>

                {/* Capabilities Quiz Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleTestClick(14, true, true)}
                    className={`bg-white rounded-2xl p-6 shadow-md border-2 transition-all ${capabilitiesCompleted
                        ? 'border-green-200 bg-green-50/50 cursor-default'
                        : !personalityCompleted
                            ? 'border-gray-200 opacity-60 cursor-not-allowed'
                            : 'border-orange-200 hover:border-orange-400 hover:shadow-lg cursor-pointer group'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${capabilitiesCompleted
                                ? 'bg-green-100'
                                : !personalityCompleted
                                    ? 'bg-gray-100'
                                    : 'bg-gradient-to-br from-orange-100 to-red-100'
                                }`}>
                                {!personalityCompleted ? (
                                    <Lock className="w-7 h-7 text-gray-400" />
                                ) : (
                                    <Zap className={`w-7 h-7 ${capabilitiesCompleted ? 'text-green-600' : 'text-orange-600'
                                        }`} />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">
                                    Capaciteiten Quiz
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {capabilitiesCompleted
                                        ? '✓ Voltooid'
                                        : !personalityCompleted
                                            ? '🔒 Vergrendeld'
                                            : 'Ontdek je sterke punten'}
                                </p>
                            </div>
                        </div>

                        {!personalityCompleted ? (
                            <Lock className="w-6 h-6 text-gray-300" />
                        ) : (
                            <ArrowRight className={`w-6 h-6 transition-transform ${capabilitiesCompleted
                                ? 'text-green-400'
                                : 'text-orange-400 group-hover:translate-x-1'
                                }`} />
                        )}
                    </div>

                    {!personalityCompleted && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                <Lock size={14} />
                                Voltooi eerst de Persoonlijkheidstest
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-600 text-center">
                    💡 Beide modules verhogen je betrouwbaarheidsscore en verbeteren je matches
                </p>
            </div>
        </div>
    );
};

export default TestHub;
