import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, total, current, label }) => {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2 text-sm text-light/70">
                <span>{label || 'Progress'}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Optional: Add milestones markers here if needed */}
            </div>
        </div>
    );
};

export default ProgressBar;
