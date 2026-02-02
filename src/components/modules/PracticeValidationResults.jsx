import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { careerDirections } from '../../data/careerDirections';
import { calculateMatches } from '../../utils/matchingEngine';

const PracticeValidationResults = () => {
    const { validationResults, clearValidationResults, setStep, isPremium, userValues, personalityVector, reliabilityScore } = useStore();
    const [beforeMatches, setBeforeMatches] = useState([]);
    const [afterMatches, setAfterMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!validationResults) {
            console.log('No validation results available');
            setLoading(false);
            return;
        }

        console.log('Processing validation results:', validationResults);
        console.log('Before scores:', validationResults.beforeScores);
        console.log('After scores:', validationResults.afterScores);
        console.log('Career directions data:', careerDirections.length);

        // Calculate matches for before and after scores using local data
        const beforeDirectionMatches = calculateMatches(
            validationResults.beforeScores,
            userValues,
            careerDirections,
            personalityVector,
            reliabilityScore
        );

        const afterDirectionMatches = calculateMatches(
            validationResults.afterScores,
            userValues,
            careerDirections,
            personalityVector,
            reliabilityScore
        );

        console.log('Before matches:', beforeDirectionMatches);
        console.log('After matches:', afterDirectionMatches);

        setBeforeMatches(beforeDirectionMatches);
        setAfterMatches(afterDirectionMatches);
        setLoading(false);
    }, [validationResults, userValues, personalityVector, reliabilityScore]);

    const handleClose = () => {
        clearValidationResults();
        setStep(6); // Return to matches screen
    };

    if (!validationResults) {
        console.log('PracticeValidationResults: No validation results available');
        return (
            <div className="max-w-md mx-auto px-4 py-8 text-center">
                <p className="text-gray-600">Geen resultaten beschikbaar</p>
                <button
                    onClick={handleClose}
                    className="mt-4 text-blue-600 font-medium hover:underline"
                >
                    Terug naar overzicht
                </button>
            </div>
        );
    }

    console.log('PracticeValidationResults - Full validation results:', validationResults);

    if (loading) {
        return (
            <div className="max-w-md mx-auto px-4 py-8 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    const { beforeScores, afterScores, careerDirection } = validationResults;

    // Calculate score deltas
    const scoreDeltas = {
        R: afterScores.R - beforeScores.R,
        I: afterScores.I - beforeScores.I,
        A: afterScores.A - beforeScores.A,
        S: afterScores.S - beforeScores.S,
        E: afterScores.E - beforeScores.E,
        C: afterScores.C - beforeScores.C
    };

    // Get directions to display  (1 for free, 5 for premium)
    const directionsToShow = isPremium ? afterMatches.slice(0, 5) : afterMatches.slice(0, 1);

    // Find ranking changes
    const getRankingChange = (directionTitle) => {
        const beforeIndex = beforeMatches.findIndex(d => d.title === directionTitle);
        const afterIndex = afterMatches.findIndex(d => d.title === directionTitle);

        if (beforeIndex === -1 || afterIndex === -1) return 0;
        return beforeIndex - afterIndex; // Positive = moved up, negative = moved down
    };

    // Get match score change (in percentage points)
    const getScoreChange = (directionTitle) => {
        const beforeDirection = beforeMatches.find(d => d.title === directionTitle);
        const afterDirection = afterMatches.find(d => d.title === directionTitle);

        if (!beforeDirection || !afterDirection) return 0;

        // Return difference in percentage points (e.g. 75% - 70% = +5)
        return ((afterDirection.matchScore - beforeDirection.matchScore) * 100);
    };

    const riasecLabels = {
        R: 'Realistic',
        I: 'Investigative',
        A: 'Artistic',
        S: 'Social',
        E: 'Enterprising',
        C: 'Conventional'
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={handleClose}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft size={20} className="mr-1" />
                    Terug
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                        <Sparkles className="text-green-600 w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Validatie Voltooid!</h1>
                </div>

                {careerDirection && (
                    <p className="text-sm text-gray-600 ml-[60px]">{careerDirection}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Je score is bijgewerkt op basis van je keuzes</p>
            </div>

            {/* Score Changes Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100"
            >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Score Wijzigingen</h2>

                <div className="space-y-3">
                    {Object.entries(scoreDeltas).map(([key, delta]) => (
                        <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">{key}</span>
                                </div>
                                <span className="text-sm text-gray-700">{riasecLabels[key]}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {delta > 0 ? (
                                    <>
                                        <TrendingUp className="text-green-600 w-4 h-4" />
                                        <span className="text-green-600 font-bold">+{delta}</span>
                                    </>
                                ) : delta < 0 ? (
                                    <>
                                        <TrendingDown className="text-red-600 w-4 h-4" />
                                        <span className="text-red-600 font-bold">{delta}</span>
                                    </>
                                ) : (
                                    <>
                                        <Minus className="text-gray-400 w-4 h-4" />
                                        <span className="text-gray-400 font-bold">0</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Top Career Directions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isPremium ? 'Top 5 Richtingen' : 'Top Richting'}
                    </h2>
                    {isPremium && (
                        <Crown className="text-yellow-500 w-5 h-5" />
                    )}
                </div>

                {directionsToShow.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Debug:</strong> Geen richtingen gevonden.<br />
                            afterMatches: {afterMatches.length} | beforeMatches: {beforeMatches.length}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {directionsToShow.map((direction, index) => {
                        const rankChange = getRankingChange(direction.title);
                        const scoreChange = getScoreChange(direction.title);

                        return (
                            <motion.div
                                key={direction.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{direction.icon}</span>
                                                <h3 className="font-bold text-gray-900">{direction.title}</h3>
                                            </div>
                                            {direction.description && (
                                                <p className="text-xs text-gray-600 mt-0.5">{direction.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        {/* Ranking change */}
                                        {rankChange !== 0 && (
                                            <div className={`flex items-center gap-1 ${rankChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {rankChange > 0 ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                                <span className="text-xs font-bold">{Math.abs(rankChange)}</span>
                                            </div>
                                        )}

                                        {/* Score percentage change (for premium users) */}
                                        {isPremium && scoreChange !== 0 && (
                                            <div className={`flex items-center gap-1 ${scoreChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {scoreChange > 0 ? (
                                                    <>
                                                        <span className="text-xs font-bold">+{scoreChange.toFixed(1)}%</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xs font-bold">{scoreChange.toFixed(1)}%</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${direction.matchScore * 100}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">
                                        {(direction.matchScore * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Premium Upgrade CTA for free users */}
            {!isPremium && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 mb-6"
                >
                    <div className="flex items-start gap-3">
                        <Crown className="text-yellow-600 w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Ontdek je top 5 richtingen</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Met Premium krijg je inzicht in je top 5 meest passende richtingen en zie je precies waar je groei hebt geboekt.
                            </p>
                            <button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-amber-600 transition-all shadow-md">
                                Upgrade naar Premium
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Continue Button */}
            <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
                Terug naar overzicht
            </button>
        </div>
    );
};

export default PracticeValidationResults;
