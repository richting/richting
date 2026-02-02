import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { calculateSectorMatchesEnhanced, getVisibleMatches } from '../../utils/matchingEngine';
import { supabase } from '../../lib/supabase';
import UnlockModal from './UnlockModal';
import { Lock, Loader2, Sparkles, ChevronRight, Info } from 'lucide-react';

const MatchesScreen = () => {
    const { userScores, userValues, personalityVector, reliabilityScore, isPremium, setPremium, setStep, setSelectedSectorId } = useStore();
    const [matches, setMatches] = useState([]);
    const [visibleMatches, setVisibleMatches] = useState([]);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSectorsAndCareers = async () => {
            try {
                // Fetch sectors
                const { data: sectorsData, error: sectorsError } = await supabase.from('sectors').select('*');
                if (sectorsError) throw sectorsError;

                // Fetch careers for enhanced matching
                const { data: careersData, error: careersError } = await supabase.from('careers').select('*');
                if (careersError) throw careersError;

                // Use enhanced matching
                const results = await calculateSectorMatchesEnhanced(
                    userScores,
                    userValues,
                    sectorsData || [],
                    careersData || [],
                    personalityVector,
                    reliabilityScore
                );
                setMatches(results);

                // For MatchesScreen, we generally want to show the #1 match fully, and list the others (maybe locked)
                const visible = getVisibleMatches(results, reliabilityScore, isPremium);
                setVisibleMatches(visible);
            } catch (error) {
                console.error('Error fetching sectors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSectorsAndCareers();
    }, [userScores, userValues, personalityVector, reliabilityScore, isPremium]);

    const handleLockedClick = () => {
        setShowUnlockModal(true);
    };

    const handleUpgrade = () => {
        setPremium(true);
        setShowUnlockModal(false);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Jouw Matches</h1>

            {loading ? (
                <div className="flex justify-center h-64 items-center">
                    <Loader2 className="animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Top Match #1 */}
                    {visibleMatches.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden relative">
                            {/* Badge */}
                            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                #1 Match
                            </div>

                            <div className={`h-32 w-full bg-gradient-to-br ${visibleMatches[0].color_gradient} flex items-center justify-center`}>
                                <div className="text-6xl filter drop-shadow-md transform hover:scale-110 transition-transform duration-300">
                                    {visibleMatches[0].icon_emoji}
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{visibleMatches[0].name_nl}</h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {visibleMatches[0].description}
                                </p>

                                {/* Reliability Label */}
                                {reliabilityScore < 100 && (
                                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-blue-900 mb-1">
                                                Voorlopig resultaat ({reliabilityScore}% betrouwbaarheid)
                                            </p>
                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                {reliabilityScore < 40
                                                    ? "Je interesses matchen, maar we weten nog niet of je persoonlijkheid en waarden hierbij passen. Verhoog je score voor een definitief advies."
                                                    : reliabilityScore < 60
                                                        ? "Je interesses en persoonlijkheid matchen goed! Voltooi meer modules om ook je werkwaarden mee te nemen in de berekening."
                                                        : "Bijna compleet! Verhoog je score naar 100% voor de meest accurate matches op basis van al je kenmerken."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${visibleMatches[0].matchScore * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-bold text-blue-600">{Math.round(visibleMatches[0].matchScore * 100)}%</span>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => { setSelectedSectorId(visibleMatches[0].id); setStep(7); }} // Go to Deep Dive
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Bekijk details
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Locked Matches List */}
                    {matches.length > 1 && (
                        <div className="relative">
                            <h3 className="font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                                {(reliabilityScore < 80 && !isPremium) && <Lock size={16} className="text-gray-400" />}
                                Andere mogelijke matches
                            </h3>

                            {/* Show full list if 80%+ OR premium */}
                            {(reliabilityScore >= 80 || isPremium) ? (
                                <div className="space-y-4">
                                    {matches.slice(1).map((match, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                                        >
                                            <div
                                                onClick={() => { setSelectedSectorId(match.id); setStep(7); }}
                                                className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${match.color_gradient}`}>
                                                        {match.icon_emoji}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{match.name_nl}</h4>
                                                        <span className="text-xs text-blue-600 font-bold">{Math.round(match.matchScore * 100)}% match</span>
                                                    </div>
                                                </div>
                                                <ChevronRight size={20} className="text-gray-300" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {/* Show blurred placeholders */}
                                        {matches.slice(1, 4).map((match, idx) => (
                                            <div
                                                key={idx}
                                                onClick={handleLockedClick}
                                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 opacity-60 blur-[2px] select-none cursor-pointer transform scale-95 origin-center"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Unlock CTA Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white pt-12 pb-4">
                                        <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                                            <Lock className="text-blue-600" size={24} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2">Verhoog je betrouwbaarheid naar 80%</h4>
                                        <p className="text-sm text-gray-500 mb-2 text-center max-w-xs">
                                            Je bent nu op {reliabilityScore}%, nog {80 - reliabilityScore}% te gaan
                                        </p>
                                        <p className="text-xs text-gray-400 mb-6 text-center max-w-xs">
                                            Voltooi meer modules om alle matches te ontgrendelen
                                        </p>

                                        <button
                                            onClick={handleLockedClick}
                                            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                                        >
                                            Of upgrade nu - €2,99
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            <UnlockModal
                isOpen={showUnlockModal}
                onClose={() => setShowUnlockModal(false)}
                onUpgrade={handleUpgrade}
            />
        </div>
    );
};

export default MatchesScreen;
