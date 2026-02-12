import React from 'react';
import { motion } from 'framer-motion';

const LikertScale = ({ value, onChange, labels = ['Oneens', 'Eens'], scale = 5 }) => {
    return (
        <div className="w-full max-w-xl mx-auto py-8">
            <div className="flex justify-between items-center mb-4 text-gray-600 text-sm font-medium">
                <span>{labels[0]}</span>
                <span>{labels[1]}</span>
            </div>

            <div className="relative flex justify-between items-center">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" />

                {/* Points */}
                {Array.from({ length: scale }).map((_, index) => {
                    const pointValue = index + 1;
                    const isSelected = value === pointValue;

                    return (
                        <motion.button
                            key={pointValue}
                            onClick={() => onChange(pointValue)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                                ? 'bg-blue-600 shadow-lg shadow-blue-600/30 scale-110'
                                : 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-indicator"
                                    className="w-3 h-3 bg-white rounded-full"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Labels for points (Optional) */}
            <div className="flex justify-between mt-2">
                {Array.from({ length: scale }).map((_, index) => (
                    <div key={index} className="w-10 text-center text-xs text-gray-400">
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikertScale;
