import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ArrowRight } from 'lucide-react';
import Card from './Card';
import { swipeCards } from '../data/swipeCards';

const SwipeGame = ({ onComplete, userScores, setUserScores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const handleSwipe = (swipeDirection, tag) => {
    setDirection(swipeDirection);
    
    // Update scores
    if (swipeDirection === 'right') {
      setUserScores(prev => ({
        ...prev,
        [tag]: prev[tag] + 1
      }));
    } else {
      setUserScores(prev => ({
        ...prev,
        [tag]: Math.max(0, prev[tag] - 0.5)
      }));
    }

    // Move to next card
    setTimeout(() => {
      if (currentIndex < swipeCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      } else {
        onComplete();
      }
    }, 300);
  };

  const handleButtonSwipe = (swipeDirection) => {
    if (currentIndex < swipeCards.length) {
      handleSwipe(swipeDirection, swipeCards[currentIndex].tag);
    }
  };

  const progress = ((currentIndex + 1) / swipeCards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 font-display">
            Vibe Check
          </h2>
          <p className="text-light/70">
            Swipe naar rechts als het je aanspreekt →
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="text-center mb-4 text-light/50 text-sm">
          {currentIndex + 1} / {swipeCards.length}
        </div>

        {/* Card Stack */}
        <div className="relative h-[500px] mb-8">
          <AnimatePresence>
            {swipeCards.slice(currentIndex, currentIndex + 3).map((card, index) => {
              const isTop = index === 0;
              
              return (
                <motion.div
                  key={card.id}
                  className="absolute w-full h-full"
                  initial={{ scale: 1 - index * 0.05, opacity: 1 }}
                  animate={{
                    scale: 1 - index * 0.05,
                    y: index * 10,
                    opacity: 1,
                    rotate: isTop && direction === 'right' ? 15 : 
                           isTop && direction === 'left' ? -15 : 0,
                    x: isTop && direction === 'right' ? 300 : 
                       isTop && direction === 'left' ? -300 : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  style={{ zIndex: swipeCards.length - index }}
                >
                  {isTop ? (
                    <Card
                      card={card}
                      onSwipe={handleSwipe}
                    />
                  ) : (
                    <div className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-8 h-full opacity-30`} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButtonSwipe('left')}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 hover:border-red-400 transition-colors"
          >
            <X className="w-8 h-8 text-red-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButtonSwipe('right')}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
          >
            <Heart className="w-8 h-8 text-white fill-white" />
          </motion.button>

          {currentIndex === swipeCards.length && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="ml-4 px-6 py-3 rounded-full bg-white text-secondary font-semibold flex items-center gap-2"
            >
              Volgende <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Instructions */}
        <p className="text-center text-light/50 text-sm mt-8">
          Sleep de kaart of gebruik de knoppen
        </p>
      </div>
    </div>
  );
};

export default SwipeGame;
