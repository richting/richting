import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bird, MessageCircle } from 'lucide-react'; // Using Bird as Scout placeholder

const ScoutAvatar = ({ emotion = 'happy', message, className = '' }) => {
    // Emotion map to icons/colors
    const emotionConfig = {
        happy: { color: 'text-yellow-400', icon: Bird, animation: { y: [0, -5, 0] } },
        thinking: { color: 'text-blue-400', icon: Bird, animation: { rotate: [0, 10, 0] } },
        excited: { color: 'text-green-400', icon: Bird, animation: { scale: [1, 1.2, 1] } },
        neutral: { color: 'text-gray-400', icon: Bird, animation: {} },
    };

    const config = emotionConfig[emotion] || emotionConfig.neutral;
    const Icon = config.icon;

    return (
        <div className={`relative flex items-end ${className}`}>
            {/* Message Bubble */}
            <AnimatePresence mode='wait'>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-full left-0 mb-2 ml-8 bg-white text-dark p-3 rounded-2xl rounded-bl-sm shadow-lg max-w-[200px] z-10"
                    >
                        <p className="text-sm font-medium">{message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar */}
            <motion.div
                animate={config.animation}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className={`bg-white/10 p-3 rounded-full backdrop-blur-sm border-2 border-white/20 hover:scale-105 transition-transform cursor-pointer`}
            >
                <Icon className={`w-8 h-8 ${config.color}`} />
            </motion.div>
        </div>
    );
};

export default ScoutAvatar;
