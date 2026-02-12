import React from 'react';
import { motion } from 'framer-motion';
import { getGradient } from '../../utils/gradients';

export function SwipeCard({ card, onSwipe, style, className = '', children, ...props }) {
    // Use the utility to get the gradient based on the tag
    // This ensures Tailwind classes are present in the build and prevents white-on-white issues
    const gradientClass = getGradient(card.tag);

    return (
        <motion.div
            style={style}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
                if (Math.abs(info.offset.x) > 100) { // Reduced threshold slightly to match VibeSwipe feel
                    onSwipe(info.offset.x > 0 ? 'right' : 'left', card.tag);
                }
            }}
            className={`absolute w-full h-full cursor-grab active:cursor-grabbing ${className}`}
            {...props}
        >
            <div className={`
        bg-gradient-to-br ${gradientClass} 
        rounded-3xl p-8 h-full flex flex-col justify-between 
        shadow-xl shadow-black/10
        border border-white/10
        will-change-transform
      `}>
                {card.imageUrl ? (
                    <div className="absolute inset-x-0 top-0 h-3/5 overflow-hidden rounded-t-3xl">
                        <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                ) : (
                    <div className="text-7xl mb-6 drop-shadow-md">{card.emoji}</div>
                )}

                {/* Spacer if image exists to push content down */}
                {card.imageUrl && <div className="h-1/2" />}

                <div className={`text-white ${card.imageUrl ? 'bg-white/90 backdrop-blur-md p-4 rounded-xl text-gray-900 mt-auto' : ''}`}>
                    <h3 className={`font-display font-bold text-3xl mb-2 leading-tight drop-shadow-md ${card.imageUrl ? 'text-gray-900' : 'text-white'}`}>
                        {card.title}
                    </h3>
                    <p className={`font-body text-lg opacity-95 leading-relaxed drop-shadow-md ${card.imageUrl ? 'text-gray-600' : 'text-white'}`}>
                        {card.description || card.tagline}
                    </p>
                </div>

                {!card.imageUrl && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <span className="text-white font-medium text-sm tracking-wide">
                                {card.sectors ? card.sectors.join(', ') : (
                                    <>
                                        {card.tag === 'R' && 'Realistisch'}
                                        {card.tag === 'I' && 'Intellectueel'}
                                        {card.tag === 'A' && 'Artistiek'}
                                        {card.tag === 'S' && 'Sociaal'}
                                        {card.tag === 'E' && 'Ondernemend'}
                                        {card.tag === 'C' && 'Conventioneel'}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                )}
                {children}
            </div>
        </motion.div>
    );
}
