import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { calculateSectorMatchesEnhanced, getVisibleMatches } from '../../utils/matchingEngine';
import { supabase } from '../../lib/supabase';
import ProgressCircle from './ProgressCircle';
import ActivitySwipe from './ActivitySwipe';
import NextMission from './NextMission';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';

const HomeScreen = () => {
    const { userScores, userValues, personalityVector, reliabilityScore, isPremium, user, setStep, setSelectedSectorId } = useStore();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topMatch, setTopMatch] = useState(null);

    useEffect(() => {
        const fetchSectorsAndCareers = async () => {
            try {
                // Fetch sectors
                const { data: sectorsData, error: sectorsError } = await supabase.from('sectors').select('*');
                if (sectorsError) throw sectorsError;

                // Fetch careers for enhanced matching
                const { data: careersData, error: careersError } = await supabase.from('careers').select('*');
                if (careersError) throw careersError;

                // Use enhanced matching with career aggregation
                const results = await calculateSectorMatchesEnhanced(
                    userScores,
                    userValues,
                    sectorsData || [],
                    careersData || [],
                    personalityVector,
                    reliabilityScore
                );

                setMatches(results);
                if (results.length > 0) {
                    setTopMatch(results[0]);
                }
            } catch (error) {
                console.error('Error fetching sectors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSectorsAndCareers();
    }, [userScores, userValues, personalityVector, reliabilityScore]);

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Hi {user?.name?.split(' ')[0] || 'User'},
                </h1>
                <p className="text-gray-500">Jouw groei vandaag</p>
            </div>

            {/* Reliability Meter */}
            <div className="mb-8 transform scale-90">
                <ProgressCircle score={reliabilityScore} size={240} strokeWidth={16} showLinearBar={false} />
            </div>

            {/* Next Mission Card */}
            <div className="mb-8">
                <NextMission />
            </div>

            {/* Daily Swipe Activity - Replaces DailyBooster */}
            {reliabilityScore >= 0 && reliabilityScore < 100 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="font-bold text-gray-900 text-lg">Dagelijkse Match</h3>
                        <ActivitySwipe.Counter />
                    </div>
                    <ActivitySwipe />
                </div>
            )}

            {/* Quick Match Preview */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3 px-1">Jouw #1 Richting</h3>

                {loading ? (
                    <div className="h-32 flex items-center justify-center bg-white rounded-2xl shadow-sm">
                        <Loader2 className="animate-spin text-blue-500" />
                    </div>
                ) : topMatch ? (
                    <div
                        onClick={() => { setSelectedSectorId(topMatch.id); setStep(7); }} // Direct to Deep Dive for top sector
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer group hover:border-blue-200 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${topMatch.color_gradient}`}>
                                {topMatch.icon_emoji}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{topMatch.name_nl}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{topMatch.description}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-blue-600">{Math.round(topMatch.matchScore * 100)}%</span>
                            <ArrowRight className="text-gray-300 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">Nog geen matches gevonden. Voltooi meer modules!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;
