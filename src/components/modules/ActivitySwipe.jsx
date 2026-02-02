import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Check, Info, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { activities } from '../../data/activities';
import UnlockModal from './UnlockModal';

const ActivityCard = ({ activity, onSwipe, index, frontCard, swipeDirection }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Background color transformation based on swipe direction
    const bg = useTransform(
        x,
        [-150, 0, 150],
        ["rgb(254, 226, 226)", "rgb(255, 255, 255)", "rgb(220, 252, 231)"]
    );

    // Border color transformation
    const borderColor = useTransform(
        x,
        [-150, 0, 150],
        ["rgb(239, 68, 68)", "rgb(229, 231, 235)", "rgb(34, 197, 94)"]
    );

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe('right', activity.id);
        } else if (info.offset.x < -100) {
            onSwipe('left', activity.id);
        }
    };

    return (
        <motion.div
            style={{
                x: frontCard ? x : 0,
                rotate: frontCard ? rotate : 0,
                opacity: frontCard ? opacity : 1,
                zIndex: 100 - index,
                scale: 1 - index * 0.05,
                y: index * 10,
                backgroundColor: frontCard ? bg : "white",
                borderColor: frontCard ? borderColor : "rgb(229, 231, 235)"
            }}
            drag={frontCard ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.6}
            whileTap={{ cursor: 'grabbing' }}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1 - index * 0.05, opacity: 1 - index * 0.2, y: index * 10 }}
            exit={{
                x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : (x.get() < 0 ? -200 : 200),
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.2 }
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-0 left-0 w-full h-[360px] bg-white rounded-3xl p-6 flex flex-col justify-between shadow-xl border-2 cursor-grab"
        >
            <div className="flex justify-between items-start">
                {/* Empty spacer */}
            </div>

            <div className="flex-1 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-800 leading-tight text-center px-4">
                    {activity.text}
                </h3>
            </div>

            <div className="flex-1"></div>

            {/* Visual cues overlay */}
            <motion.div style={{ opacity: useTransform(x, [-100, -20], [1, 0]) }} className="absolute top-1/2 left-8 text-red-500 transform -translate-y-1/2 -rotate-12 pointer-events-none">
                <X size={64} strokeWidth={4} />
            </motion.div>
            <motion.div style={{ opacity: useTransform(x, [20, 100], [0, 1]) }} className="absolute top-1/2 right-8 text-green-500 transform -translate-y-1/2 rotate-12 pointer-events-none">
                <Check size={64} strokeWidth={4} />
            </motion.div>
        </motion.div>
    );
};

// Sub-component for the counter
const SwipeCounter = () => {
    const { dailySwipes, MAX_FREE_SWIPES, isPremium } = useStore();

    if (isPremium) {
        return (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <Sparkles size={12} /> Unlimited
            </span>
        );
    }

    const remaining = Math.max(0, MAX_FREE_SWIPES - dailySwipes);

    return (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${remaining === 0 ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>
            {remaining} swipes over
        </span>
    );
};

const ActivitySwipe = () => {
    const { swipedActivities, swipeActivity, dailySwipes, MAX_FREE_SWIPES, isPremium, setPremium } = useStore();
    const [stack, setStack] = useState([]);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [currentSwipeDirection, setCurrentSwipeDirection] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    // Calculate limit status
    useEffect(() => {
        if (!isPremium && dailySwipes >= MAX_FREE_SWIPES) {
            setIsLimitReached(true);
        } else {
            setIsLimitReached(false);
        }
    }, [dailySwipes, isPremium, MAX_FREE_SWIPES]);

    // Load initial stack
    useEffect(() => {
        // Filter out already swiped activities
        const available = activities.filter(a => !swipedActivities.includes(a.id));
        // For premium users, load more cards (20); for free users, load 10
        const stackSize = isPremium ? 20 : 10;
        const shuffled = [...available].sort(() => 0.5 - Math.random()).slice(0, stackSize);
        setStack(shuffled);
    }, []);

    // Auto-refill stack for premium users when running low
    useEffect(() => {
        if (isPremium && stack.length <= 2 && stack.length > 0) {
            // Load more cards when stack is running low
            const available = activities.filter(a => !swipedActivities.includes(a.id));
            if (available.length > 0) {
                const newCards = [...available].sort(() => 0.5 - Math.random()).slice(0, 10);
                setStack(current => [...current, ...newCards]);
            }
        }
    }, [stack.length, isPremium, swipedActivities]);

    const handleSwipe = (direction, activityId) => {
        if (isLimitReached) return;

        const activity = stack.find(a => a.id === activityId);
        if (!activity) return;

        // Set swipe direction for animation
        setCurrentSwipeDirection(direction);

        // Visual delay before actual remove to allow animation to play
        setTimeout(() => {
            // Update store
            swipeActivity(activity.id, activity.riasec, direction, activity.intensity);

            // Remove from local stack
            setStack(current => current.filter(a => a.id !== activityId));

            // Reset swipe direction
            setCurrentSwipeDirection(null);
        }, 200);
    };

    const handleManualSwipe = (direction) => {
        if (stack.length === 0 || isLimitReached) return;
        handleSwipe(direction, stack[0].id);
    };

    if (isLimitReached) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[360px] bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200"
            >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Sparkles size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Daglimiet bereikt!</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-[200px]">
                    Je hebt je 10 gratis swipes voor vandaag gebruikt. Kom morgen terug of upgrade voor onbeperkt toegang.
                </p>
                <button
                    onClick={() => setShowUnlockModal(true)}
                    className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                >
                    Upgrade naar Premium
                </button>
                <UnlockModal
                    isOpen={showUnlockModal}
                    onClose={() => setShowUnlockModal(false)}
                    onUpgrade={() => {
                        setPremium(true);
                        setShowUnlockModal(false);
                    }}
                />
            </motion.div>
        );
    }

    // Only show completion screen for free users
    if (stack.length === 0 && !isPremium) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[360px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex flex-col items-center justify-center text-center p-8 border border-green-100 shadow-md relative overflow-hidden"
            >
                {/* Success Animation Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-green-400 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white p-4 rounded-full mb-6 shadow-sm z-10">
                    <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 z-10">Klaar voor nu!</h3>
                <p className="text-gray-600 text-sm mb-6 z-10 max-w-[200px]">
                    Goed bezig! Je profiel is weer iets nauwkeuriger geworden.
                </p>
                <div className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium z-10">
                    Score verwerkt
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="relative w-full h-[360px] mb-6">
                <AnimatePresence>
                    {stack.map((activity, index) => (
                        index < 2 && ( // Only render top 2 cards
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onSwipe={handleSwipe}
                                index={index}
                                frontCard={index === 0}
                                swipeDirection={index === 0 ? currentSwipeDirection : null}
                            />
                        )
                    ))}
                </AnimatePresence>
            </div>

            {/* Manual Controls */}
            <div className="flex gap-4 w-full px-4">
                <button
                    onClick={() => handleManualSwipe('left')}
                    className="flex-1 bg-white border border-gray-200 text-red-500 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    <X size={20} /> Nee
                </button>
                <button
                    onClick={() => handleManualSwipe('right')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                >
                    Ja <Check size={20} />
                </button>
            </div>
        </div>
    );
};

// Export Counter separately for header usage
ActivitySwipe.Counter = SwipeCounter;

export default ActivitySwipe;
