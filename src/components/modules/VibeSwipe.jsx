import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { MODULES } from '../../utils/reliabilityEngine';
import { saveUserResponse } from '../../utils/syncUserData';

const VibeSwipe = () => {
    const { addScore, nextStep, updateReliability, user } = useStore();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const { data, error } = await supabase.from('swipe_cards').select('*');
                if (error) throw error;
                setCards(data || []);
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    const activeCard = cards[cards.length - 1];

    const handleSwipe = async (dir) => {
        setDirection(dir);

        if (activeCard) {
            if (dir === 'right') {
                addScore(activeCard.tag, 1);

                // Save response to database if user is logged in
                if (user?.id) {
                    await saveUserResponse(user.id, 'swipe', activeCard.id.toString(), 'right');
                }
            } else if (dir === 'left' && user?.id) {
                // Also track left swipes
                await saveUserResponse(user.id, 'swipe', activeCard.id.toString(), 'left');
            }

            // Remove card
            setTimeout(() => {
                const newCards = cards.slice(0, -1);
                setCards(newCards);
                setDirection(null);

                if (newCards.length === 0) {
                    // Onboarding complete - set reliability score to 30%
                    updateReliability(MODULES.ONBOARDING_SWIPES.id, MODULES.ONBOARDING_SWIPES.scoreValue);
                    nextStep();
                }
            }, 200);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto px-4 overflow-hidden">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">Vibe Check</h2>
                        <p className="text-gray-500">Wat spreekt je aan? ({cards.length} te gaan)</p>
                    </div>

                    <div className="relative w-full h-96">
                        <AnimatePresence>
                            {cards.map((card, index) => (
                                index === cards.length - 1 && (
                                    <motion.div
                                        key={card.id}
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{
                                            x: direction === 'right' ? 200 : -200,
                                            opacity: 0,
                                            rotate: direction === 'right' ? 10 : -10
                                        }}
                                        transition={{ duration: 0.3 }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            if (offset.x > 100) handleSwipe('right');
                                            else if (offset.x < -100) handleSwipe('left');
                                        }}
                                        className={`absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-100 flex flex-col`}
                                    >
                                        <div className={`h-1/2 w-full bg-gradient-to-br ${card.gradient} flex items-center justify-center text-6xl`}>
                                            {card.emoji}
                                        </div>
                                        <div className="p-6 flex flex-col justify-center flex-1">
                                            <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                                            <p className="text-gray-600">{card.description}</p>
                                        </div>

                                        {/* Visual cues for swipe */}
                                        <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100 bg-green-500 text-white p-2 rounded-full">
                                            <Check />
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>

                        {cards.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-xl font-medium text-gray-400">Klaar!</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => handleSwipe('left')}
                            className="p-4 rounded-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <button
                            onClick={() => handleSwipe('right')}
                            className="p-4 rounded-full bg-white border-2 border-green-100 text-green-500 hover:bg-green-50 transition-colors shadow-sm"
                        >
                            <Check className="w-8 h-8" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VibeSwipe;
