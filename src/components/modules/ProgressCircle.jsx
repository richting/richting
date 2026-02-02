import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { getProgressMessage, getProgressStatus } from '../../utils/reliabilityEngine';

const ProgressCircle = ({ score, size = 200, strokeWidth = 12, showLinearBar = true }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const status = getProgressStatus(score);
    const message = getProgressMessage(score);

    const [displayScore, setDisplayScore] = useState(score);
    const [showConfetti, setShowConfetti] = useState(false);
    const prevScoreRef = useRef(score);
    const controls = useAnimation();

    useEffect(() => {
        const prevScore = prevScoreRef.current;

        if (score > prevScore) {
            // Trigger pulse animation
            controls.start({
                scale: [1, 1.1, 1],
                transition: { duration: 0.5 }
            });

            // Animate counter from previous to new score
            const duration = 1000; // 1 second
            const steps = 30;
            const increment = (score - prevScore) / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const newScore = Math.min(prevScore + (increment * currentStep), score);
                setDisplayScore(Math.round(newScore));

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setDisplayScore(score);
                }
            }, duration / steps);

            // Show confetti at 100%
            if (score >= 100 && prevScore < 100) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }

            return () => clearInterval(timer);
        } else {
            setDisplayScore(score);
        }

        prevScoreRef.current = score;
    }, [score, controls]);

    return (
        <div className="flex flex-col items-center justify-center">
            {/* SVG Circle */}
            <motion.div
                className="relative"
                style={{ width: size, height: size }}
                animate={controls}
            >
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />

                    {/* Progress Circle */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - progress }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.2
                        }}
                    />

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center"
                    >
                        <div className="text-5xl font-bold text-gray-900">
                            {displayScore}%
                        </div>
                        <div className={`text-xs font-semibold mt-1 ${status.color}`}>
                            {status.label}
                        </div>
                    </motion.div>
                </div>

                {/* Confetti Effect at 100% */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    background: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5],
                                    left: `${50 + (Math.random() - 0.5) * 20}%`,
                                    top: '50%'
                                }}
                                initial={{ y: 0, opacity: 1, scale: 0 }}
                                animate={{
                                    y: [0, -100 - Math.random() * 100],
                                    x: (Math.random() - 0.5) * 200,
                                    opacity: [1, 1, 0],
                                    scale: [0, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1.5 + Math.random(),
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Message Below Circle */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-6 text-center max-w-xs"
            >
                <p className="text-sm text-gray-600 leading-relaxed">
                    {message}
                </p>
            </motion.div>

            {/* Progress Bar Alternative (Mobile) - conditionally rendered */}
            {showLinearBar && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-4 w-full max-w-xs"
                >
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProgressCircle;
