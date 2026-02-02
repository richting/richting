import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, X, Sparkles } from 'lucide-react';

const UnlockModal = ({ isOpen, onClose, onUpgrade }) => {
    if (!isOpen) return null;

    const benefits = [
        'Zie al je top matches (niet alleen #1)',
        'Toegang tot persoonlijkheidsmodule (Big Five)',
        'Toegang tot waardenmodule',
        'Verhoog je score tot 100%',
        'Volledige studieroute-aanbevelingen',
        'Diepgaande analyse van je profiel'
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header with Gradient */}
                            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                                        <Lock size={32} />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-center mb-2">
                                    Ontgrendel Volledige Richting
                                </h2>
                                <p className="text-center text-white/90 text-sm">
                                    Verhoog je betrouwbaarheid naar 100%
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="text-yellow-500" size={20} />
                                        Wat krijg je?
                                    </h3>
                                    <ul className="space-y-3">
                                        {benefits.map((benefit, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                                                    <Check className="text-green-600" size={14} />
                                                </div>
                                                <span className="text-sm text-gray-700">{benefit}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Reliability Comparison */}
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-600">Gratis versie</span>
                                        <span className="text-xs font-bold text-gray-900">30%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full mb-4">
                                        <div className="h-full w-[30%] bg-gray-400 rounded-full" />
                                    </div>

                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-blue-600 font-medium">Premium versie</span>
                                        <span className="text-xs font-bold text-blue-600">100%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={onUpgrade}
                                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Upgrade naar Premium - €2,99
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Eenmalige betaling • Direct toegang • Geen abonnement
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UnlockModal;
