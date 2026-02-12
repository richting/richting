import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoutAvatar from './ScoutAvatar';
import { useScout } from '../../hooks/useScout';

/**
 * Scout Mascot Component
 *
 * The friendly eagle guide that accompanies users through their journey.
 * - Always visible in top-right corner
 * - Floats with gentle animation
 * - Shows context-aware messages in speech bubble
 * - Evolves based on user's reliability score
 *
 * Usage:
 * <Scout />
 *
 * Control via hook:
 * const { say, celebrate, hide } = useScout();
 * say("Goed bezig!", "happy");
 */

const Scout = ({ className = '' }) => {
  const { message, pose, visible, reliabilityScore } = useScout();

  // Floating animation
  const floatAnimation = {
    y: [-12, 0, -12],
    rotate: [-3, 3, -3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  if (!visible) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 ${className}`}>
      {/* Scout Avatar with float animation */}
      <motion.div
        animate={floatAnimation}
        className="relative"
      >
        <ScoutAvatar
          pose={pose}
          size={64}
          reliabilityScore={reliabilityScore}
          className="drop-shadow-lg"
        />
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-20 right-0 max-w-[200px] z-50"
          >
            <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
              <p className="text-sm text-gray-800 font-inter leading-snug">
                {message}
              </p>

              {/* Speech bubble tail */}
              <div className="absolute -top-2 right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white" />
              <div className="absolute -top-[10px] right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-100" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scout;
