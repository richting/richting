import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { assessmentService } from '../../services/assessmentService';
import { SwipeCard } from '../assessments/SwipeCard';
import Scout from '../ui/Scout';
import { useScout } from '../../hooks/useScout';
import { scoutMessages, getRandomRiasecEncouragement } from '../../utils/scoutMessages';
import ProgressBar from '../assessments/ProgressBar';

// Shuffle with constraint: max 3 of same category in a row
function intelligentShuffle(cards) {
    if (!cards.length) return [];

    // Helper to get category from a card
    const getCat = (c) => c.tag || 'R'; // Metadata should have 'tag'

    const shuffled = [];
    const remaining = [...cards].sort(() => Math.random() - 0.5); // Initial random sort
    let lastCategory = null;
    let categoryStreak = 0;

    while (remaining.length > 0) {
        // Filter: verify if we need to avoid the last category
        let candidates = remaining;
        if (categoryStreak >= 2) {
            const filtered = remaining.filter(c => getCat(c) !== lastCategory);
            if (filtered.length > 0) candidates = filtered;
        }

        // Pick random from candidates
        const index = Math.floor(Math.random() * candidates.length);
        const card = candidates[index];

        if (!card) {
            // Fallback if filtering failed (should be rare with enough cards)
            const fallbackIndex = Math.floor(Math.random() * remaining.length);
            const fallbackCard = remaining[fallbackIndex];
            remaining.splice(fallbackIndex, 1);
            shuffled.push(fallbackCard);
            // Reset streak just in case
            categoryStreak = 1;
            lastCategory = getCat(fallbackCard);
            continue;
        }

        // Remove from remaining
        const remIndex = remaining.indexOf(card);
        remaining.splice(remIndex, 1);
        shuffled.push(card);

        const currentCat = getCat(card);
        if (currentCat === lastCategory) {
            categoryStreak++;
        } else {
            categoryStreak = 1;
            lastCategory = currentCat;
        }
    }
    return shuffled;
}

const VibeSwipe = () => {
    const { addScore, setStep, user } = useStore();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(null);
    const [swipeCount, setSwipeCount] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);
    const [localScores, setLocalScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    const { say, celebrate } = useScout();

    const SWIPE_GOAL = 30;

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const questions = await assessmentService.getQuestions('riasec');

                if (!questions || questions.length === 0) {
                    console.warn("No questions found for RIASEC module");
                    setCards([]);
                    return;
                }

                // Transform questions to card format expected by SwipeCard
                const formattedCards = questions.map(q => ({
                    id: q.id,
                    title: q.question_text,
                    ...q.metadata // contains tag, emoji, gradient, description
                }));

                const shuffled = intelligentShuffle(formattedCards);
                setCards(shuffled);
            } catch (error) {
                console.error('Error fetching cards:', error);
                // We should handle error ui here
                setScoutMsg("Oeps, ik kan de kaarten niet vinden! 🙈");
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    // Scout Messages at Milestones
    useEffect(() => {
        if (swipeCount === 0) {
            say(scoutMessages.riasec.start, 'happy');
        } else if (swipeCount === 5) {
            say(scoutMessages.riasec.milestone_5, 'happy');
        } else if (swipeCount === 10) {
            say(scoutMessages.riasec.milestone_10, 'happy');
        } else if (swipeCount === 15) {
            say(scoutMessages.riasec.milestone_15, 'thinking');
        } else if (swipeCount === 20) {
            say(scoutMessages.riasec.milestone_20, 'happy');
        } else if (swipeCount === 25) {
            say(scoutMessages.riasec.milestone_25, 'encouraging');
        } else if (swipeCount === 30) {
            celebrate(scoutMessages.riasec.milestone_30);
        } else if (swipeCount === 40) {
            say(scoutMessages.riasec.milestone_40, 'celebrating');
        } else if (swipeCount === 50) {
            say(scoutMessages.riasec.milestone_50, 'celebrating');
        } else if (swipeCount === 60) {
            celebrate(scoutMessages.riasec.milestone_60);
        } else if (swipeCount % 5 === 0 && swipeCount > 0) {
            // Random encouraging message
            say(getRandomRiasecEncouragement(), 'happy');
        }
    }, [swipeCount, say, celebrate]);

    // Check for Early Exit at Goal
    useEffect(() => {
        if (swipeCount === SWIPE_GOAL) {
            setShowExitModal(true);
        }
    }, [swipeCount]);

    const activeCard = cards[cards.length - 1];

    const handleSwipe = async (dir) => {
        if (!activeCard) return;
        setDirection(dir);

        // Update Local Scores
        if (dir === 'right') {
            const tag = activeCard.tag || 'R';
            setLocalScores(prev => ({ ...prev, [tag]: prev[tag] + 1 }));
            // Also update global store for immediate feedback if used elsewhere
            addScore(tag, 1);

            // Log to DB
            if (user?.id) {
                assessmentService.saveRiasecSwipe(user.id, activeCard.id, 'right');
            }
        } else if (dir === 'left') {
            if (user?.id) {
                assessmentService.saveRiasecSwipe(user.id, activeCard.id, 'left');
            }
        }

        // Visual Delay
        setTimeout(() => {
            const newCards = cards.slice(0, -1);
            setCards(newCards);
            setDirection(null);
            setSwipeCount(prev => prev + 1);

            if (newCards.length === 0) {
                completeModule();
            }
        }, 200);
    };

    const completeModule = async () => {
        if (user?.id) {
            // Save final scores
            try {
                await assessmentService.completeRiasecModule(user.id, localScores);
            } catch (err) {
                console.error("Failed to save module completion", err);
            }
        }
        setStep(2); // Next Step (Personality - Assuming Step 2)
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Kaarten schudden...</p>
            </div>
        );
    }

    if (cards.length === 0 && !loading) {
        if (swipeCount >= SWIPE_GOAL) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                    <Scout />
                    <h2 className="text-2xl font-bold mb-4">Fantastisch gedaan! 🎉</h2>
                    <p className="text-gray-600 mb-8">We hebben een super compleet beeld van je interesses.</p>
                    <button
                        onClick={completeModule}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition w-full max-w-sm"
                    >
                        Bekijk mijn resultaten & ga door
                    </button>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                    <Scout />
                    <h2 className="text-xl font-bold mb-2 text-red-600">Oeps, geen kaarten gevonden! 🙈</h2>
                    <p className="text-gray-600 mb-6">
                        Er ging iets mis bij het ophalen van de vragen. Controleer je verbinding.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
                    >
                        Probeer opnieuw
                    </button>
                    {/* Dev Hint */}
                    {import.meta.env.DEV && (
                        <p className="text-xs text-gray-400 mt-4">Dev: Check RLS policies for 'assessment_questions' or database content.</p>
                    )}
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col items-center justify-between h-[85vh] w-full max-w-md mx-auto px-4 py-4 overflow-hidden relative">

            {/* Header / Progress */}
            <div className="w-full text-center mt-2 mb-4">
                <ProgressBar
                    progress={swipeCount}
                    total={SWIPE_GOAL}
                    current={swipeCount}
                    label="Vibe Check"
                />
            </div>

            {/* Card Stack */}
            <div className="relative w-full aspect-[3/4] max-h-[60vh] my-4">
                <AnimatePresence>
                    {cards.map((card, index) => (
                        index === cards.length - 1 && (
                            <SwipeCard
                                key={card.id || index}
                                card={card}
                                onSwipe={(dir) => handleSwipe(dir)}
                                style={{ zIndex: 100 }}
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{
                                    x: direction === 'right' ? 300 : -300,
                                    opacity: 0,
                                    rotate: direction === 'right' ? 20 : -20
                                }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                {/* Swipe Indicators (Overlay) */}
                                <motion.div
                                    className="absolute top-6 right-6 bg-green-500 text-white p-3 rounded-full opacity-0"
                                    style={{ opacity: direction === 'right' ? 1 : 0 }}
                                >
                                    <Check className="w-6 h-6" />
                                </motion.div>
                                <motion.div
                                    className="absolute top-6 left-6 bg-red-500 text-white p-3 rounded-full opacity-0"
                                    style={{ opacity: direction === 'left' ? 1 : 0 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.div>
                            </SwipeCard>
                        )
                    ))}
                </AnimatePresence>

                {/* Background Card Effect */}
                {cards.length > 1 && (
                    <div className="absolute inset-0 bg-white rounded-3xl shadow-md border border-gray-100 scale-95 translate-y-4 -z-10 opacity-50" />
                )}
            </div>

            {/* Scout Mascot */}
            <Scout />

            {/* Controls */}
            <div className="flex gap-6 mb-4 items-center z-10 w-full justify-center">
                <button
                    onClick={() => handleSwipe('left')}
                    className="p-5 rounded-full bg-white border border-gray-200 text-red-500 shadow-sm hover:bg-red-50 hover:scale-105 active:scale-95 transition-all"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Swipe</div>
                <button
                    onClick={() => handleSwipe('right')}
                    className="p-5 rounded-full bg-white border border-gray-200 text-green-500 shadow-sm hover:bg-green-50 hover:scale-105 active:scale-95 transition-all"
                >
                    <Check className="w-8 h-8" />
                </button>
            </div>

            {/* Exit Modal */}
            <AnimatePresence>
                {showExitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold mb-2">Interesseprofiel Compleet!</h3>
                                <p className="text-gray-600 mb-6">
                                    We hebben een goed beeld van wat je leuk vindt. Om de beste matches te vinden, willen we nu weten wie je <em>bent</em>.
                                </p>

                                <div className="space-y-3">
                                    <button
                                        onClick={completeModule}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                                    >
                                        Start Persoonlijkheidstest
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VibeSwipe;
