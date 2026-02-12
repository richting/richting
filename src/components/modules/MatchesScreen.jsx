import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { calculateSectorMatchesEnhanced, getVisibleMatches, calculateMatches } from '../../utils/matchingEngine';
import { supabase } from '../../lib/supabase';

import { Lock, Loader2, Sparkles, ChevronRight, Info } from 'lucide-react';

const MatchesScreen = () => {
    const { userScores, userValues, personalityVector, reliabilityScore, isPremium, setPremium, setStep, setSelectedSectorId, selfEfficacy, user } = useStore();
    const [matches, setMatches] = useState([]);
    const [jobMatches, setJobMatches] = useState([]);
    const [visibleMatches, setVisibleMatches] = useState([]);
    const [visibleJobMatches, setVisibleJobMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('sector'); // 'sector' or 'job'

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    .limit(1000); // Limit for performance, maybe paginate later

                if (escoError) throw escoError;

                // Map ESCO data to expected format for matching engine
                // Matching engine expects: { title, description, riasec_vector, work_values, personality_fit?, sector_id? }
                const mappedCareers = (escoData || []).map(job => ({
                    ...job,
                    title: job.title_nl,
                    description: job.description_nl,
                    // riasec_vector and work_values are already in correct format
                    // sector_id is missing, so sector aggregation won't work fully independently
                }));

                // Use enhanced matching for Sectors
                const sectorResults = await calculateSectorMatchesEnhanced(
                    userScores,
                    userValues,
                    sectorsData || [],
                    mappedCareers,
                    personalityVector,
                    reliabilityScore,
                    selfEfficacy
                );
                setMatches(sectorResults);

                // Calculate Job Matches
                const jobResults = calculateMatches(
                    userScores,
                    userValues,
                    mappedCareers,
                    personalityVector,
                    reliabilityScore
                );
                setJobMatches(jobResults);

                // For MatchesScreen, we generally want to show the #1 match fully, and list the others (maybe locked)
                const visibleSectors = getVisibleMatches(sectorResults, reliabilityScore, isPremium);
                setVisibleMatches(visibleSectors);

                const visibleJobs = getVisibleMatches(jobResults, reliabilityScore, isPremium);
                setVisibleJobMatches(visibleJobs);

                // Save matches to Supabase (Top 10)
                if (user && jobResults.length > 0) {
                    const topMatches = jobResults.slice(0, 10).map(match => ({
                        user_id: user.id,
                        esco_occupation_id: match.id,
                        match_score: match.matchScore,
                        riasec_match: match.riasecMatch,
                        personality_match: match.personalityMatch,
                        value_match: match.valueMatch
                    }));

                    // Upsert matches
                    const { error: saveError } = await supabase
                        .from('user_matches')
                        .upsert(topMatches, { onConflict: 'user_id, esco_occupation_id' });

                    if (saveError) console.error('Error saving matches:', saveError);
                    else console.log('Matches saved successfully.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchSectorsAndCareers();
    }, [userScores, userValues, personalityVector, reliabilityScore, isPremium]);



    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Jouw Matches</h1>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('sector')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'sector'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Sectoren
                </button>
                <button
                    onClick={() => setActiveTab('job')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'job'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Banen
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center h-64 items-center">
                    <Loader2 className="animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Empty State */}
                    {activeTab === 'sector' && visibleMatches.length === 0 && (
                        <div className="text-center py-10">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Geen matches gevonden</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                We konden geen passende sectoren vinden. Probeer de test (opnieuw) te maken.
                            </p>
                        </div>
                    )}

                    {activeTab === 'job' && visibleJobMatches.length === 0 && (
                        <div className="text-center py-10">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Geen banen gevonden</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                We konden geen passende banen vinden. Probeer de test (opnieuw) te maken.
                            </p>
                        </div>
                    )}

                    {/* Top Match #1 */}
                    {activeTab === 'sector' ? (
                        visibleMatches.length > 0 && (
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
                                            onClick={() => { setSelectedSectorId(visibleMatches[0].id); setStep(9); }} // Go to Deep Dive
                                            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Bekijk details
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        visibleJobMatches.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden relative">
                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                    #1 Match
                                </div>

                                {/* Jobs might not have icon_emoji/color_gradient in the same way, falling back or using defaults if needed.
                                    Assuming jobs have a 'sector' relation we could pull that, but unrelated to sector object here.
                                    Let's use a generic or derived style if missing.
                                */}
                                <div className={`h-32 w-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center`}>
                                    <div className="text-6xl filter drop-shadow-md transform hover:scale-110 transition-transform duration-300">
                                        💼
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{visibleJobMatches[0].title}</h2>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {visibleJobMatches[0].description || "Geen beschrijving beschikbaar."}
                                    </p>

                                    {/* Reliability Label - Reuse logic */}
                                    {reliabilityScore < 100 && (
                                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-blue-900 mb-1">
                                                    Voorlopig resultaat ({reliabilityScore}% betrouwbaarheid)
                                                </p>
                                                <p className="text-xs text-blue-700 leading-relaxed">
                                                    {reliabilityScore < 40
                                                        ? "Je interesses matchen, maar we weten nog niet of je persoonlijkheid en waarden hierbij passen."
                                                        : reliabilityScore < 60
                                                            ? "Je interesses en persoonlijkheid matchen goed! Voltooi meer modules voor een betere score."
                                                            : "Bijna compleet! Verhoog je score naar 100% voor de meest accurate matches."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${visibleJobMatches[0].matchScore * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-blue-600">{Math.round(visibleJobMatches[0].matchScore * 100)}%</span>
                                    </div>

                                    <div className="space-y-2">
                                        {/* Jobs might not have a deep dive yet, or we link to the sector deep dive if we can find it? 
                                            For now, maybe just a placeholder or no button if no deep dive for specific job.
                                            Or link to sector?
                                            Let's leave button purely visual or link to sector if available.
                                        */}
                                        {visibleJobMatches[0].sector_id && (
                                            <button
                                                onClick={() => { setSelectedSectorId(visibleJobMatches[0].sector_id); setStep(7); }}
                                                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                Bekijk sector
                                                <ChevronRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}

                    {/* Locked Matches List */}
                    {activeTab === 'sector' ? (
                        matches.length > 1 && (
                            <div className="relative">
                                <h3 className="font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                                    Andere mogelijke matches
                                </h3>

                                <div className="space-y-4">
                                    {matches.slice(1).map((match, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                                        >
                                            <div
                                                onClick={() => { setSelectedSectorId(match.id); setStep(9); }}
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
                            </div>
                        )
                    ) : (
                        jobMatches.length > 1 && (
                            <div className="relative">
                                <h3 className="font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                                    Andere mogelijke banen
                                </h3>

                                <div className="space-y-4">
                                    {jobMatches.slice(1).map((match, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                                        >
                                            <div
                                                // Allow clicking to go to sector deep dive if available
                                                onClick={() => { if (match.sector_id) { setSelectedSectorId(match.sector_id); setStep(9); } }}
                                                className={`flex items-center justify-between ${match.sector_id ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-blue-400 to-indigo-600`}>
                                                        💼
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{match.title}</h4>
                                                        <span className="text-xs text-blue-600 font-bold">{Math.round(match.matchScore * 100)}% match</span>
                                                    </div>
                                                </div>
                                                {match.sector_id && <ChevronRight size={20} className="text-gray-300" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}





        </div>
    );
};

export default MatchesScreen;
