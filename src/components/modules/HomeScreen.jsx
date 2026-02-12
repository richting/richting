import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { calculateSectorMatchesEnhanced } from '../../utils/matchingEngine';
import { supabase } from '../../lib/supabase';
import ProgressCircle from './ProgressCircle';
import DailyBooster from './DailyBooster';
import NextMission from './NextMission';
import Scout from '../ui/Scout';
import { useScout } from '../../hooks/useScout';
import { scoutMessages } from '../../utils/scoutMessages';
import { ArrowRight, Loader2 } from 'lucide-react';

const HomeScreen = () => {
    const { userScores, userValues, personalityVector, reliabilityScore, user, setStep, setSelectedSectorId, selfEfficacy } = useStore();
    const [loading, setLoading] = useState(true);
    const [topMatch, setTopMatch] = useState(null);
    const { say, setReliability } = useScout();

    // Sync reliability score with Scout
    useEffect(() => {
        setReliability(reliabilityScore);
    }, [reliabilityScore, setReliability]);

    // Welcome message on first load
    useEffect(() => {
        say(scoutMessages.home.welcome, 'happy');
    }, [say]);

    useEffect(() => {
        const fetchSectorsAndCareers = async () => {
            try {
                // Fetch sectors
                const { data: sectorsData, error: sectorsError } = await supabase.from('sectors').select('*');
                if (sectorsError) throw sectorsError;

                // Fetch ESCO occupations (replacing 'careers')
                // We only want mapped occupations (where riasec_vector is not null)
                const { data: escoData, error: escoError } = await supabase
                    .from('esco_occupations')
                    .select('*')
                    .not('riasec_vector', 'is', null)
                    .limit(1000); // Limit for performance

                if (escoError) throw escoError;

                // Map ESCO data to expected format for matching engine
                const mappedCareers = (escoData || []).map(job => ({
                    ...job,
                    title: job.title_nl,
                    description: job.description_nl,
                }));

                // Use enhanced matching with career aggregation
                const results = await calculateSectorMatchesEnhanced(
                    userScores,
                    userValues,
                    sectorsData || [],
                    mappedCareers,
                    personalityVector,
                    reliabilityScore,
                    selfEfficacy
                );

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
    }, [userScores, userValues, personalityVector, reliabilityScore, selfEfficacy]);

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            {/* Scout Mascot */}
            <Scout />

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

            {/* Daily Booster (Dilemmas) */}
            {reliabilityScore >= 0 && reliabilityScore < 100 && (
                <div className="mb-8">
                    <DailyBooster />
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
                        onClick={() => { setSelectedSectorId(topMatch.id); setStep(9); }} // Direct to Deep Dive for top sector (Step 9)
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
